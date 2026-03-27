import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { type NextFunction, type Request, type Response } from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import jwt, { type JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import multer from 'multer'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { mkdir } from 'node:fs/promises'

const prisma = new PrismaClient()
const app = express()
const isProduction = process.env.NODE_ENV === 'production'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const port = Number(process.env.PORT ?? 4001)
const accessSecret = process.env.JWT_ACCESS_SECRET ?? 'access_secret_dev'
const refreshSecret = process.env.JWT_REFRESH_SECRET ?? 'refresh_secret_dev'
const allowedOrigins = (process.env.CLIENT_ORIGIN ?? 'http://localhost:5174')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean)
const uploadDir = path.resolve(__dirname, '..', 'uploads')

app.use(helmet())
app.set('trust proxy', 1)
app.use(cors({ origin: allowedOrigins, credentials: true }))
app.use(express.json({ limit: '2mb' }))
app.use(cookieParser())
app.use('/api', rateLimit({ windowMs: 60_000, max: 120 }))
app.use('/uploads', express.static(uploadDir))

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    void mkdir(uploadDir, { recursive: true })
      .then(() => callback(null, uploadDir))
      .catch((error: unknown) => callback(error as Error, uploadDir))
  },
  filename: (_req, file, callback) => {
    const ext = path.extname(file.originalname) || '.bin'
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_')
    callback(null, `${Date.now()}-${base}${ext}`)
  },
})
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } })

type AuthContext = { userId: number; role: 'admin' | 'editor' }

declare module 'express-serve-static-core' {
  interface Request {
    auth?: AuthContext
  }
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(128),
})

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128).optional(),
  role: z.enum(['admin', 'editor']),
  status: z.enum(['active', 'disabled']).default('active'),
})

const categorySchema = z.object({
  name: z.string().min(1).max(128),
  slug: z.string().min(1).max(128),
  parentId: z.number().int().nullable().default(null),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
})

const productSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  categoryId: z.number().int(),
  shortDescription: z.string().default(''),
  fullDescriptionHtml: z.string().default(''),
  price: z.number().nonnegative().nullable().default(null),
  currency: z.string().default('RUB'),
  stockStatus: z.enum(['in_stock', 'out_of_stock', 'on_request']).default('in_stock'),
  isActive: z.boolean().default(true),
  attributes: z.array(z.object({ key: z.string(), value: z.string(), sortOrder: z.number().int().default(0) })).default([]),
  images: z.array(z.object({ url: z.string().min(1), alt: z.string().default(''), sortOrder: z.number().int().default(0), isCover: z.boolean().default(false) })).default([]),
})

const bannerSchema = z.object({
  title: z.string().min(1).max(255),
  imageUrl: z.string().min(1),
  targetUrl: z.string().url(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
})

const contentSchema = z.object({
  key: z.string().min(1).max(128),
  title: z.string().min(1).max(255),
  bodyHtml: z.string().default(''),
})

function signAccessToken(payload: AuthContext): string {
  return jwt.sign(payload, accessSecret, { expiresIn: '15m' })
}

function signRefreshToken(payload: AuthContext): string {
  return jwt.sign(payload, refreshSecret, { expiresIn: '7d' })
}

function auth(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : req.cookies.refreshToken
  if (!token) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }
  try {
    const decoded = jwt.verify(token, accessSecret) as JwtPayload & AuthContext
    req.auth = { userId: decoded.userId, role: decoded.role }
    next()
  } catch {
    res.status(401).json({ message: 'Session expired' })
  }
}

function permit(roles: Array<'admin' | 'editor'>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      res.status(403).json({ message: 'Forbidden' })
      return
    }
    next()
  }
}

async function writeAuditLog(userId: number | null, action: string, entityType: string, entityId?: string, payloadJson?: unknown): Promise<void> {
  await prisma.auditLog.create({
    data: { userId, action, entityType, entityId, payloadJson: payloadJson as object | undefined },
  })
}

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

app.post('/api/auth/register', async (req, res) => {
  const parsed = userSchema.pick({ email: true, password: true }).safeParse(req.body)
  if (!parsed.success || !parsed.data.password) {
    res.status(400).json({ message: 'Invalid payload' })
    return
  }
  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } })
  if (existing) {
    res.status(409).json({ message: 'Email already exists' })
    return
  }
  const role = await prisma.role.findUnique({ where: { code: 'editor' } })
  if (!role) {
    res.status(500).json({ message: 'Roles not initialized. Run seed first.' })
    return
  }
  const passwordHash = await bcrypt.hash(parsed.data.password, 10)
  const user = await prisma.user.create({
    data: { email: parsed.data.email, passwordHash, status: 'active', roleId: role.id },
    include: { role: true },
  })
  await writeAuditLog(user.id, 'register', 'user', String(user.id), { email: user.email })
  res.status(201).json({ id: user.id, email: user.email, role: user.role.code })
})

app.post('/api/auth/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid credentials' })
    return
  }
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email }, include: { role: true } })
  if (!user || user.status !== 'active') {
    res.status(401).json({ message: 'Invalid credentials' })
    return
  }
  const valid = await bcrypt.compare(parsed.data.password, user.passwordHash)
  if (!valid) {
    await writeAuditLog(user.id, 'login_failed', 'auth')
    res.status(401).json({ message: 'Invalid credentials' })
    return
  }
  const payload: AuthContext = { userId: user.id, role: user.role.code as 'admin' | 'editor' }
  const accessToken = signAccessToken(payload)
  const refreshToken = signRefreshToken(payload)
  res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict', secure: isProduction, path: '/' })
  await writeAuditLog(user.id, 'login_ok', 'auth')
  res.json({ accessToken, user: { id: user.id, email: user.email, role: user.role.code } })
})

app.post('/api/auth/refresh', (req, res) => {
  const token = req.cookies.refreshToken
  if (!token) {
    res.status(401).json({ message: 'Missing refresh token' })
    return
  }
  try {
    const decoded = jwt.verify(token, refreshSecret) as JwtPayload & AuthContext
    const accessToken = signAccessToken({ userId: decoded.userId, role: decoded.role })
    res.json({ accessToken })
  } catch {
    res.status(401).json({ message: 'Invalid refresh token' })
  }
})

app.post('/api/auth/logout', auth, async (req, res) => {
  res.clearCookie('refreshToken', { path: '/', httpOnly: true, sameSite: 'strict', secure: isProduction })
  await writeAuditLog(req.auth?.userId ?? null, 'logout', 'auth')
  res.json({ ok: true })
})

app.get('/api/users', auth, permit(['admin']), async (_req, res) => {
  const users = await prisma.user.findMany({ include: { role: true }, orderBy: { id: 'asc' } })
  res.json(users.map((u) => ({ id: u.id, email: u.email, role: u.role.code, status: u.status })))
})

app.post('/api/users', auth, permit(['admin']), async (req, res) => {
  const parsed = userSchema.safeParse(req.body)
  if (!parsed.success || !parsed.data.password) {
    res.status(400).json({ message: 'Invalid payload' })
    return
  }
  const role = await prisma.role.findUnique({ where: { code: parsed.data.role } })
  if (!role) {
    res.status(400).json({ message: 'Role not found' })
    return
  }
  const passwordHash = await bcrypt.hash(parsed.data.password, 10)
  const user = await prisma.user.create({
    data: { email: parsed.data.email, passwordHash, roleId: role.id, status: parsed.data.status },
    include: { role: true },
  })
  await writeAuditLog(req.auth?.userId ?? null, 'create_user', 'user', String(user.id))
  res.status(201).json({ id: user.id, email: user.email, role: user.role.code, status: user.status })
})

app.put('/api/users/:id', auth, permit(['admin']), async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isFinite(id)) {
    res.status(400).json({ message: 'Invalid id' })
    return
  }
  const parsed = userSchema.partial().safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid payload' })
    return
  }
  const data: { email?: string; status?: string; roleId?: number; passwordHash?: string } = {}
  if (parsed.data.email) data.email = parsed.data.email
  if (parsed.data.status) data.status = parsed.data.status
  if (parsed.data.role) {
    const role = await prisma.role.findUnique({ where: { code: parsed.data.role } })
    if (!role) {
      res.status(400).json({ message: 'Role not found' })
      return
    }
    data.roleId = role.id
  }
  if (parsed.data.password) {
    data.passwordHash = await bcrypt.hash(parsed.data.password, 10)
  }
  const user = await prisma.user.update({ where: { id }, data, include: { role: true } })
  await writeAuditLog(req.auth?.userId ?? null, 'update_user', 'user', String(id))
  res.json({ id: user.id, email: user.email, role: user.role.code, status: user.status })
})

app.delete('/api/users/:id', auth, permit(['admin']), async (req, res) => {
  const id = Number(req.params.id)
  await prisma.user.delete({ where: { id } })
  await writeAuditLog(req.auth?.userId ?? null, 'delete_user', 'user', String(id))
  res.json({ ok: true })
})

app.get('/api/categories', auth, permit(['admin', 'editor']), async (_req, res) => {
  const categories = await prisma.category.findMany({ orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] })
  res.json(categories)
})

app.post('/api/categories', auth, permit(['admin', 'editor']), async (req, res) => {
  const parsed = categorySchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid payload' })
    return
  }
  const category = await prisma.category.create({ data: parsed.data })
  await writeAuditLog(req.auth?.userId ?? null, 'create_category', 'category', String(category.id))
  res.status(201).json(category)
})

app.put('/api/categories/:id', auth, permit(['admin', 'editor']), async (req, res) => {
  const id = Number(req.params.id)
  const parsed = categorySchema.partial().safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid payload' })
    return
  }
  const category = await prisma.category.update({ where: { id }, data: parsed.data })
  await writeAuditLog(req.auth?.userId ?? null, 'update_category', 'category', String(id))
  res.json(category)
})

app.delete('/api/categories/:id', auth, permit(['admin', 'editor']), async (req, res) => {
  const id = Number(req.params.id)
  await prisma.category.delete({ where: { id } })
  await writeAuditLog(req.auth?.userId ?? null, 'delete_category', 'category', String(id))
  res.json({ ok: true })
})

app.post('/api/categories/reorder', auth, permit(['admin', 'editor']), async (req, res) => {
  const payload = z.array(z.object({ id: z.number().int(), sortOrder: z.number().int(), parentId: z.number().int().nullable() })).safeParse(req.body)
  if (!payload.success) {
    res.status(400).json({ message: 'Invalid payload' })
    return
  }
  await prisma.$transaction(
    payload.data.map((item) =>
      prisma.category.update({
        where: { id: item.id },
        data: { sortOrder: item.sortOrder, parentId: item.parentId },
      }),
    ),
  )
  await writeAuditLog(req.auth?.userId ?? null, 'reorder_categories', 'category')
  res.json({ ok: true })
})

app.get('/api/products', auth, permit(['admin', 'editor']), async (req, res) => {
  const q = String(req.query.q ?? '').trim().toLowerCase()
  const categoryId = req.query.categoryId ? Number(req.query.categoryId) : null
  const where = {
    ...(q ? { name: { contains: q } } : {}),
    ...(categoryId ? { categoryId } : {}),
  }
  const products = await prisma.product.findMany({
    where,
    include: { attributes: true, images: true },
    orderBy: { id: 'desc' },
  })
  res.json(products)
})

app.post('/api/products', auth, permit(['admin', 'editor']), async (req, res) => {
  const parsed = productSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid payload' })
    return
  }
  const product = await prisma.product.create({
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      categoryId: parsed.data.categoryId,
      shortDescription: parsed.data.shortDescription,
      fullDescriptionHtml: parsed.data.fullDescriptionHtml,
      price: parsed.data.price,
      currency: parsed.data.currency,
      stockStatus: parsed.data.stockStatus,
      isActive: parsed.data.isActive,
      attributes: { create: parsed.data.attributes },
      images: { create: parsed.data.images },
    },
    include: { attributes: true, images: true },
  })
  await writeAuditLog(req.auth?.userId ?? null, 'create_product', 'product', String(product.id))
  res.status(201).json(product)
})

app.put('/api/products/:id', auth, permit(['admin', 'editor']), async (req, res) => {
  const id = Number(req.params.id)
  const parsed = productSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid payload' })
    return
  }
  const product = await prisma.$transaction(async (tx) => {
    await tx.productAttribute.deleteMany({ where: { productId: id } })
    await tx.productImage.deleteMany({ where: { productId: id } })
    return tx.product.update({
      where: { id },
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        categoryId: parsed.data.categoryId,
        shortDescription: parsed.data.shortDescription,
        fullDescriptionHtml: parsed.data.fullDescriptionHtml,
        price: parsed.data.price,
        currency: parsed.data.currency,
        stockStatus: parsed.data.stockStatus,
        isActive: parsed.data.isActive,
        attributes: { create: parsed.data.attributes },
        images: { create: parsed.data.images },
      },
      include: { attributes: true, images: true },
    })
  })
  await writeAuditLog(req.auth?.userId ?? null, 'update_product', 'product', String(id))
  res.json(product)
})

app.delete('/api/products/:id', auth, permit(['admin', 'editor']), async (req, res) => {
  const id = Number(req.params.id)
  await prisma.product.delete({ where: { id } })
  await writeAuditLog(req.auth?.userId ?? null, 'delete_product', 'product', String(id))
  res.json({ ok: true })
})

app.get('/api/banners', auth, permit(['admin', 'editor']), async (_req, res) => {
  const banners = await prisma.banner.findMany({ orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] })
  res.json(banners)
})

app.post('/api/banners', auth, permit(['admin', 'editor']), async (req, res) => {
  const parsed = bannerSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid payload' })
    return
  }
  const banner = await prisma.banner.create({
    data: {
      ...parsed.data,
      startsAt: new Date(parsed.data.startsAt),
      endsAt: new Date(parsed.data.endsAt),
    },
  })
  await writeAuditLog(req.auth?.userId ?? null, 'create_banner', 'banner', String(banner.id))
  res.status(201).json(banner)
})

app.put('/api/banners/:id', auth, permit(['admin', 'editor']), async (req, res) => {
  const id = Number(req.params.id)
  const parsed = bannerSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid payload' })
    return
  }
  const banner = await prisma.banner.update({
    where: { id },
    data: { ...parsed.data, startsAt: new Date(parsed.data.startsAt), endsAt: new Date(parsed.data.endsAt) },
  })
  await writeAuditLog(req.auth?.userId ?? null, 'update_banner', 'banner', String(id))
  res.json(banner)
})

app.delete('/api/banners/:id', auth, permit(['admin', 'editor']), async (req, res) => {
  const id = Number(req.params.id)
  await prisma.banner.delete({ where: { id } })
  await writeAuditLog(req.auth?.userId ?? null, 'delete_banner', 'banner', String(id))
  res.json({ ok: true })
})

app.get('/api/content', auth, permit(['admin', 'editor']), async (_req, res) => {
  const content = await prisma.pageContent.findMany({ orderBy: { updatedAt: 'desc' } })
  res.json(content)
})

app.post('/api/content', auth, permit(['admin', 'editor']), async (req, res) => {
  const parsed = contentSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid payload' })
    return
  }
  const page = await prisma.pageContent.upsert({
    where: { key: parsed.data.key },
    update: { title: parsed.data.title, bodyHtml: parsed.data.bodyHtml, updatedBy: req.auth?.userId },
    create: { key: parsed.data.key, title: parsed.data.title, bodyHtml: parsed.data.bodyHtml, updatedBy: req.auth?.userId },
  })
  await writeAuditLog(req.auth?.userId ?? null, 'save_content', 'page_content', String(page.id))
  res.json(page)
})

app.post('/api/media/upload', auth, permit(['admin', 'editor']), upload.single('file'), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ message: 'File is required' })
    return
  }
  const host = req.get('host')
  const protocol = req.headers['x-forwarded-proto']?.toString() || req.protocol
  const relativeUrl = `/uploads/${req.file.filename}`
  const absoluteUrl = `${protocol}://${host}${relativeUrl}`
  await writeAuditLog(req.auth?.userId ?? null, 'upload_media', 'media', undefined, { filename: req.file.originalname })
  res.json({ url: absoluteUrl, relativeUrl })
})

app.get('/api/audit-logs', auth, permit(['admin']), async (_req, res) => {
  const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 200 })
  res.json(logs)
})

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  void _next
  console.error(error)
  res.status(500).json({ message: 'Internal server error' })
})

app.listen(port, () => {
  console.log(`CMS API running on http://localhost:${port}`)
})
