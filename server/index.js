import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '..', '.env') })
const isProduction = process.env.NODE_ENV === 'production'

// --- Fail-fast: секреты обязательны, без fallback ---
// trim() убирает \r и пробелы (типично для Windows .env)
const JWT_SECRET = process.env.JWT_SECRET?.trim()
const ADMIN_LOGIN = process.env.ADMIN_LOGIN?.trim()
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD?.trim()

if (!JWT_SECRET || JWT_SECRET.length < 8) {
  console.error('[FATAL] JWT_SECRET must be set in .env and at least 8 chars.')
  process.exit(1)
}
if (!ADMIN_LOGIN || !ADMIN_LOGIN.trim()) {
  console.error('[FATAL] ADMIN_LOGIN must be set in .env.')
  process.exit(1)
}
if (!ADMIN_PASSWORD || ADMIN_PASSWORD.length < 5) {
  console.error('[FATAL] ADMIN_PASSWORD must be set in .env and at least 5 chars.')
  process.exit(1)
}

const PORT = Number(process.env.PORT ?? 4000)
const CLIENT_ORIGINS = (process.env.CLIENT_ORIGIN ?? 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)
const TOKEN_TTL = '8h'
const COOKIE_NAME = 'admin_session'

const DATA_DIR = path.join(__dirname, 'data')
const CONTENT_FILE = path.join(DATA_DIR, 'content.json')
const DEFAULT_CONTENT_FILE = path.join(__dirname, 'default-content.json')
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json')
const DEFAULT_PRODUCTS_FILE = path.join(__dirname, 'default-products.json')
const BACKUPS_DIR = path.join(DATA_DIR, 'backups')
const AUDIT_LOG_FILE = path.join(DATA_DIR, 'audit.log')
const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads')
let defaultContent = null

const storage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    await fs.mkdir(UPLOADS_DIR, { recursive: true })
    cb(null, UPLOADS_DIR)
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg'
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_')
    cb(null, `${Date.now()}-${base}${ext}`)
  },
})
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /^image\/(jpeg|png|gif|webp)$/i
    if (allowed.test(file.mimetype)) return cb(null, true)
    cb(new Error('Разрешены только изображения (JPEG, PNG, GIF, WebP).'))
  },
})

// --- Zod schemas ---
const loginSchema = z.object({
  login: z.string().min(1).max(128),
  password: z.string().min(1).max(256),
})

const featureSchema = z.object({
  title: z.string().max(200).optional().default(''),
  text: z.string().max(2000).optional().default(''),
  iconKey: z.enum(['warehouse', 'quality', 'price']).optional().default('warehouse'),
})

const productSchema = z.object({
  id: z.string().min(1).max(64),
  sku: z.string().max(64).optional().default(''),
  name: z.string().min(1).max(256),
  description: z.string().max(2000).optional().default(''),
  image: z.string().max(500).optional().default(''),
  images: z.array(z.string().max(500)).optional().default([]),
  price: z.string().max(64).optional().default(''),
  fullDescription: z.string().max(10000).optional().default(''),
  workVideos: z.array(z.string().max(500)).optional().default([]),
})

const contentSchema = z.object({
  topBarAddressAriaLabel: z.string().max(200).optional().default(''),
  headerMenuDiscsLabel: z.string().max(64).optional().default(''),
  headerMenuCrownsLabel: z.string().max(64).optional().default(''),
  headerMenuContactsLabel: z.string().max(64).optional().default(''),
  headerFeedbackButtonLabel: z.string().max(64).optional().default(''),
  mobileMenuAriaLabel: z.string().max(64).optional().default(''),
  heroTitle: z.string().max(500).optional().default(''),
  heroLead: z.string().max(5000).optional().default(''),
  heroConsultButtonLabel: z.string().max(128).optional().default(''),
  heroBrochureButtonLabel: z.string().max(128).optional().default(''),
  productsTitle: z.string().max(200).optional().default(''),
  productsLead: z.string().max(500).optional().default(''),
  productsDiscsTitle: z.string().max(128).optional().default(''),
  productsDiscsLinkLabel: z.string().max(128).optional().default(''),
  productsCrownsTitle: z.string().max(128).optional().default(''),
  productsCrownsLinkLabel: z.string().max(128).optional().default(''),
  orderTitle: z.string().max(200).optional().default(''),
  orderLead: z.string().max(500).optional().default(''),
  orderSuccessMessage: z.string().max(200).optional().default(''),
  orderPhoneLabel: z.string().max(64).optional().default(''),
  orderNameLabel: z.string().max(64).optional().default(''),
  orderPhonePlaceholder: z.string().max(64).optional().default(''),
  orderNamePlaceholder: z.string().max(128).optional().default(''),
  orderSubmitLabel: z.string().max(64).optional().default(''),
  orderSubmittingLabel: z.string().max(64).optional().default(''),
  orderAgreementLead: z.string().max(256).optional().default(''),
  orderAgreementLinkLabel: z.string().max(128).optional().default(''),
  aboutTitle: z.string().max(200).optional().default(''),
  aboutText: z.string().max(10000).optional().default(''),
  aboutImageAlt: z.string().max(256).optional().default(''),
  featuresTitle: z.string().max(128).optional().default(''),
  featuresLead: z.string().max(256).optional().default(''),
  mapTitle: z.string().max(256).optional().default(''),
  footerContactsTitle: z.string().max(64).optional().default(''),
  footerFormTitle: z.string().max(128).optional().default(''),
  footerFormLead: z.string().max(256).optional().default(''),
  footerSuccessMessage: z.string().max(200).optional().default(''),
  footerNamePlaceholder: z.string().max(64).optional().default(''),
  footerPhonePlaceholder: z.string().max(64).optional().default(''),
  footerConsentPersonalLabel: z.string().max(256).optional().default(''),
  footerConsentAgreementLead: z.string().max(128).optional().default(''),
  footerConsentAgreementLinkLabel: z.string().max(128).optional().default(''),
  footerSubmitLabel: z.string().max(64).optional().default(''),
  footerSubmittingLabel: z.string().max(64).optional().default(''),
  footerCopyright: z.string().max(256).optional().default(''),
  footerContactsLinkLabel: z.string().max(64).optional().default(''),
  feedbackTitle: z.string().max(128).optional().default(''),
  feedbackLead: z.string().max(256).optional().default(''),
  feedbackSuccessTitle: z.string().max(64).optional().default(''),
  feedbackSuccessMessage: z.string().max(256).optional().default(''),
  feedbackNamePlaceholder: z.string().max(64).optional().default(''),
  feedbackPhonePlaceholder: z.string().max(64).optional().default(''),
  feedbackCommentPlaceholder: z.string().max(128).optional().default(''),
  feedbackConsentPersonalLabel: z.string().max(256).optional().default(''),
  feedbackConsentAgreementLead: z.string().max(128).optional().default(''),
  feedbackConsentAgreementLinkLabel: z.string().max(128).optional().default(''),
  feedbackSubmitLabel: z.string().max(64).optional().default(''),
  feedbackSubmittingLabel: z.string().max(64).optional().default(''),
  features: z.array(featureSchema).length(3),
}).strict()

const app = express()

app.get('/ping', (_req, res) => res.json({ pong: true }))

// --- Security headers ---
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))
app.set('trust proxy', 1)

app.use(
  cors({
    origin: CLIENT_ORIGINS.length > 0 ? CLIENT_ORIGINS : ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  })
)
app.use(cookieParser())
app.use(express.json({ limit: '1mb' }))

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})

// --- Rate limits ---
const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
})

const loginLimitStore = new Map()
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20,
  skipSuccessfulRequests: true,
  message: { message: 'Слишком много попыток входа. Повторите через 5 минут.' },
  standardHeaders: true,
  legacyHeaders: false,
  store: {
    increment: (key, cb) => {
      const now = Date.now()
      let r = loginLimitStore.get(key)
      if (!r || r.resetTime < now) r = { count: 0, resetTime: now + 5 * 60 * 1000 }
      r.count++
      loginLimitStore.set(key, r)
      cb(null, r.count, { resetTime: r.resetTime })
    },
    decrement: () => {},
    resetKey: (key) => loginLimitStore.delete(key),
  },
})

const RATE_LIMIT_RESET_SECRET = process.env.RATE_LIMIT_RESET_SECRET?.trim()

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))
app.get('/api/products', async (_req, res) => {
  try {
    const products = await readProducts()
    return res.json(products)
  } catch (error) {
    console.error('Read products error', error)
    return res.status(500).json({ message: 'Не удалось загрузить товары.' })
  }
})
app.get('/api/admin/reset-rate-limit', (req, res) => {
  if (!RATE_LIMIT_RESET_SECRET || req.query.secret !== RATE_LIMIT_RESET_SECRET) {
    return res.status(404).json({ message: 'Not found' })
  }
  loginLimitStore.clear()
  return res.json({ ok: true, message: 'Rate limit сброшен.' })
})

app.use('/api', generalLimiter)

async function ensureStorage() {
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.mkdir(BACKUPS_DIR, { recursive: true })
  await fs.mkdir(UPLOADS_DIR, { recursive: true })
  defaultContent = JSON.parse(await fs.readFile(DEFAULT_CONTENT_FILE, 'utf-8'))

  try {
    await fs.access(CONTENT_FILE)
  } catch {
    await fs.writeFile(CONTENT_FILE, JSON.stringify(defaultContent, null, 2), 'utf-8')
  }

  try {
    await fs.access(PRODUCTS_FILE)
  } catch {
    let defaultProducts = { discs: [], crowns: [] }
    try {
      defaultProducts = JSON.parse(await fs.readFile(DEFAULT_PRODUCTS_FILE, 'utf-8'))
    } catch {
      /* use empty */
    }
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(defaultProducts, null, 2), 'utf-8')
  }
}

let defaultProducts = { discs: [], crowns: [] }

async function loadDefaultProducts() {
  try {
    defaultProducts = JSON.parse(await fs.readFile(DEFAULT_PRODUCTS_FILE, 'utf-8'))
  } catch {
    /* keep empty */
  }
}

async function readProducts() {
  const raw = await fs.readFile(PRODUCTS_FILE, 'utf-8')
  const data = JSON.parse(raw)
  const discs = Array.isArray(data.discs) ? data.discs : []
  const crowns = Array.isArray(data.crowns) ? data.crowns : []
  // если пусто — отдаём дефолтный каталог
  return {
    discs: discs.length > 0 ? discs : defaultProducts.discs,
    crowns: crowns.length > 0 ? crowns : defaultProducts.crowns,
  }
}

async function writeProducts(data) {
  await backupProducts()
  await fs.writeFile(
    PRODUCTS_FILE,
    JSON.stringify(
      {
        discs: Array.isArray(data.discs) ? data.discs : [],
        crowns: Array.isArray(data.crowns) ? data.crowns : [],
      },
      null,
      2
    ),
    'utf-8'
  )
}

async function backupProducts() {
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const backupPath = path.join(BACKUPS_DIR, `products.${ts}.json`)
  const current = await fs.readFile(PRODUCTS_FILE, 'utf-8')
  await fs.writeFile(backupPath, current, 'utf-8')
  const files = (await fs.readdir(BACKUPS_DIR)).filter((f) => f.startsWith('products.'))
  if (files.length > 5) {
    const sorted = files.sort()
    for (let i = 0; i < sorted.length - 5; i++) {
      await fs.unlink(path.join(BACKUPS_DIR, sorted[i])).catch(() => {})
    }
  }
}

function sanitizeContent(content) {
  const fallbackFeatures = Array.isArray(defaultContent?.features) ? defaultContent.features : []
  const features = Array.isArray(content?.features) && content.features.length > 0 ? content.features : fallbackFeatures
  const base = defaultContent ?? {}

  const sanitized = {}
  for (const [key, value] of Object.entries(base)) {
    if (key === 'features') continue
    sanitized[key] = String(content?.[key] ?? value ?? '').trim()
  }

  return {
    ...sanitized,
    features: features.slice(0, 3).map((feature, index) => {
      const iconKey =
        feature?.iconKey === 'warehouse' || feature?.iconKey === 'quality' || feature?.iconKey === 'price'
          ? feature.iconKey
          : ['warehouse', 'quality', 'price'][index] ?? 'warehouse'

      return {
        title: String(feature?.title ?? '').trim(),
        text: String(feature?.text ?? '').trim(),
        iconKey,
      }
    }),
  }
}

async function readContent() {
  const raw = await fs.readFile(CONTENT_FILE, 'utf-8')
  return sanitizeContent(JSON.parse(raw))
}

async function backupBeforeWrite() {
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const backupPath = path.join(BACKUPS_DIR, `content.${ts}.json`)
  const current = await fs.readFile(CONTENT_FILE, 'utf-8')
  await fs.writeFile(backupPath, current, 'utf-8')
  const files = await fs.readdir(BACKUPS_DIR)
  if (files.length > 10) {
    const sorted = files.sort()
    for (let i = 0; i < sorted.length - 10; i++) {
      await fs.unlink(path.join(BACKUPS_DIR, sorted[i])).catch(() => {})
    }
  }
}

async function auditLog(event, meta = {}) {
  const line = JSON.stringify({
    ts: new Date().toISOString(),
    event,
    ...meta,
  }) + '\n'
  await fs.appendFile(AUDIT_LOG_FILE, line).catch(() => {})
}

async function writeContent(content) {
  await backupBeforeWrite()
  await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf-8')
}

function getTokenFromRequest(req) {
  const cookie = req.cookies?.[COOKIE_NAME]
  if (cookie) return cookie
  const authHeader = req.headers.authorization
  if (authHeader?.startsWith('Bearer ')) return authHeader.slice('Bearer '.length)
  return null
}

function authMiddleware(req, res, next) {
  const token = getTokenFromRequest(req)
  if (!token) {
    return res.status(401).json({ message: 'Требуется авторизация.' })
  }

  try {
    jwt.verify(token, JWT_SECRET)
    return next()
  } catch {
    res.clearCookie(COOKIE_NAME, { path: '/', httpOnly: true, secure: isProduction, sameSite: 'strict' })
    return res.status(401).json({ message: 'Сессия истекла. Войдите снова.' })
  }
}

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'strict',
  maxAge: 8 * 60 * 60,
  path: '/',
}

app.get('/api/content', async (_req, res) => {
  try {
    const content = await readContent()
    return res.json(content)
  } catch (error) {
    console.error('Read content error', error)
    return res.status(500).json({ message: 'Не удалось загрузить контент.' })
  }
})

app.post('/api/admin/login', loginLimiter, (req, res) => {
  const body = req.body ?? {}
  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) {
    return res.status(400).json({ message: 'Некорректные данные.' })
  }
  const { login, password } = parsed.data
  const loginTrimmed = String(login).trim()
  const passwordTrimmed = String(password).trim()

  const loginOk = loginTrimmed === ADMIN_LOGIN && passwordTrimmed === ADMIN_PASSWORD
  if (!loginOk) {
    auditLog('login_fail', { login: loginTrimmed.slice(0, 3) + '***' })
    return res.status(401).json({ message: 'Неверный логин или пароль.' })
  }

  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: TOKEN_TTL })
  res.cookie(COOKIE_NAME, token, cookieOptions)
  auditLog('login_ok', { login: loginTrimmed.slice(0, 3) + '***' })
  return res.json({ ok: true })
})

app.post('/api/admin/logout', (_req, res) => {
  res.clearCookie(COOKIE_NAME, { path: '/', httpOnly: true, secure: isProduction, sameSite: 'strict' })
  return res.json({ ok: true })
})

app.get('/api/admin/content', authMiddleware, async (_req, res) => {
  try {
    const content = await readContent()
    return res.json(content)
  } catch (error) {
    console.error('Read admin content error', error)
    return res.status(500).json({ message: 'Не удалось загрузить контент.' })
  }
})
app.get('/api/admin/products', authMiddleware, async (_req, res) => {
  try {
    const products = await readProducts()
    return res.json(products)
  } catch (error) {
    console.error('Read admin products error', error)
    return res.status(500).json({ message: 'Не удалось загрузить товары.' })
  }
})
app.get('/api/admin/export', authMiddleware, async (_req, res) => {
  try {
    const [content, products] = await Promise.all([readContent(), readProducts()])
    const payload = { content, products, exportedAt: new Date().toISOString() }
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Disposition', `attachment; filename="newlufter-backup-${Date.now()}.json"`)
    return res.send(JSON.stringify(payload, null, 2))
  } catch (error) {
    console.error('Export error', error)
    return res.status(500).json({ message: 'Не удалось экспортировать данные.' })
  }
})
app.put('/api/admin/content', authMiddleware, async (req, res) => {
  const sanitized = sanitizeContent(req.body)
  const parsed = contentSchema.safeParse(sanitized)

  if (!parsed.success) {
    const err = parsed.error.flatten()
    const first = Object.values(err.fieldErrors)[0]?.[0]
    return res.status(400).json({ message: first ?? 'Некорректная структура контента.' })
  }

  const validated = parsed.data
  const hasInvalidFeature = validated.features.some((f) => !f.title || !f.text)
  if (hasInvalidFeature) {
    return res.status(400).json({ message: 'Каждое преимущество должно содержать заголовок и описание.' })
  }

  try {
    await writeContent(validated)
    await auditLog('content_save', {})
    return res.json({ ok: true, content: validated })
  } catch (error) {
    console.error('Save content error', error)
    return res.status(500).json({ message: 'Не удалось сохранить контент.' })
  }
})

app.put('/api/admin/products', authMiddleware, async (req, res) => {
  const body = req.body ?? {}
  const discs = Array.isArray(body.discs) ? body.discs : []
  const crowns = Array.isArray(body.crowns) ? body.crowns : []

  const validateItems = (items) => {
    for (let i = 0; i < items.length; i++) {
      const p = productSchema.safeParse(items[i])
      if (!p.success) {
        const first = Object.values(p.error.flatten().fieldErrors)[0]?.[0]
        throw new Error(`Товар ${i + 1}: ${first ?? 'некорректные данные'}`)
      }
    }
  }
  try {
    validateItems(discs)
    validateItems(crowns)
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }

  try {
    await writeProducts({ discs, crowns })
    await auditLog('products_save', {})
    return res.json({ ok: true, discs, crowns })
  } catch (error) {
    console.error('Save products error', error)
    return res.status(500).json({ message: 'Не удалось сохранить товары.' })
  }
})

// --- Upload ---
app.post('/api/admin/upload', authMiddleware, (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'Файл слишком большой (макс. 5 МБ).' })
      }
      return res.status(400).json({ message: err.message ?? 'Ошибка загрузки.' })
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Файл не выбран.' })
    }
    const url = `/uploads/${req.file.filename}`
    auditLog('upload', { filename: req.file.filename })
    return res.json({ url })
  })
})

// --- Import ---
app.post('/api/admin/import', authMiddleware, async (req, res) => {
  const body = req.body ?? {}
  const hasContent = body.content && typeof body.content === 'object'
  const hasProducts = body.products && typeof body.products === 'object'

  if (!hasContent && !hasProducts) {
    return res.status(400).json({ message: 'Требуется content и/или products в теле запроса.' })
  }

  try {
    if (hasContent) {
      const sanitized = sanitizeContent(body.content)
      const parsed = contentSchema.safeParse(sanitized)
      if (!parsed.success) {
        return res.status(400).json({ message: 'Некорректная структура контента.' })
      }
      await writeContent(parsed.data)
    }
    if (hasProducts) {
      const discs = Array.isArray(body.products.discs) ? body.products.discs : []
      const crowns = Array.isArray(body.products.crowns) ? body.products.crowns : []
      await writeProducts({ discs, crowns })
    }
    await auditLog('import', { hasContent, hasProducts })
    return res.json({ ok: true, message: 'Данные импортированы.' })
  } catch (error) {
    console.error('Import error', error)
    return res.status(500).json({ message: 'Не удалось импортировать данные.' })
  }
})

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ message: 'Внутренняя ошибка сервера.' })
})

ensureStorage()
  .then(() => loadDefaultProducts())
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Admin API started on http://localhost:${PORT}`)
      console.log(`Admin login: ${ADMIN_LOGIN?.slice(0, 3)}*** (from .env)`)
      console.log('Admin routes: /api/admin/content, /api/admin/products, /api/admin/export')
    })
  })
  .catch((error) => {
    console.error('Server bootstrap error', error)
    process.exit(1)
  })
