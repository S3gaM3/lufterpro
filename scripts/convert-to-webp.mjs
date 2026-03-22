#!/usr/bin/env node
/**
 * Конвертирует PNG/JPG в public/images/ в WebP (качество 82).
 * Запуск: node scripts/convert-to-webp.mjs
 */
import { readdir, readFile, unlink } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const IMAGES_DIR = join(__dirname, '..', 'public', 'images')
const RASTER_EXT = /\.(png|jpe?g)$/i

async function convertDir(dir) {
  let count = 0
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => [])
  for (const e of entries) {
    const full = join(dir, e.name)
    if (e.isDirectory()) {
      count += await convertDir(full)
    } else if (RASTER_EXT.test(e.name)) {
      try {
        const buf = await readFile(full)
        const webpPath = full.replace(RASTER_EXT, '.webp')
        await sharp(buf)
          .webp({ quality: 82 })
          .toFile(webpPath)
        await unlink(full)
        console.log(`${e.name} → ${webpPath.split(/[/\\]/).pop()}`)
        count++
      } catch (err) {
        console.error(`Failed ${e.name}:`, err.message)
      }
    }
  }
  return count
}

convertDir(IMAGES_DIR).then((n) => console.log(`Converted ${n} images.`))
