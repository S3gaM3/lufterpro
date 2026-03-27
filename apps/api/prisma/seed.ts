import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main(): Promise<void> {
  const adminRole = await prisma.role.upsert({
    where: { code: 'admin' },
    update: { name: 'Administrator' },
    create: { code: 'admin', name: 'Administrator' },
  })
  const editorRole = await prisma.role.upsert({
    where: { code: 'editor' },
    update: { name: 'Editor' },
    create: { code: 'editor', name: 'Editor' },
  })

  const permissions = [
    'users.manage',
    'products.manage',
    'categories.manage',
    'banners.manage',
    'content.manage',
    'media.upload',
    'audit.read',
  ]

  for (const code of permissions) {
    const permission = await prisma.permission.upsert({
      where: { code },
      update: { name: code },
      create: { code, name: code },
    })

    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: adminRole.id, permissionId: permission.id } },
      update: {},
      create: { roleId: adminRole.id, permissionId: permission.id },
    })
  }

  for (const code of ['products.manage', 'categories.manage', 'banners.manage', 'content.manage', 'media.upload']) {
    const permission = await prisma.permission.findUniqueOrThrow({ where: { code } })
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: editorRole.id, permissionId: permission.id } },
      update: {},
      create: { roleId: editorRole.id, permissionId: permission.id },
    })
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@newlufter.local'
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'Admin12345!'
  const passwordHash = await bcrypt.hash(adminPassword, 10)
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, roleId: adminRole.id, status: 'active' },
    create: { email: adminEmail, passwordHash, roleId: adminRole.id, status: 'active' },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
