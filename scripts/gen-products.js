import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

function main() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  let catalog
  try {
    catalog = readFileSync(path.join(__dirname, '../src/data/catalog.ts'), 'utf-8')
  } catch {
    return
  }

  function discImage(sku) {
    const jpgSkus = ['005-230', '005-400', '001-180', '001-200', '001-230', '001-250']
    const ext = jpgSkus.includes(sku) ? '.jpg' : '.png'
    const imageSku =
      sku === '003-125' ? '003-232' : sku === '021-125' ? '021-115' : sku === '016-125-1' ? '016-125' : sku
    return `/images/disks/${imageSku}${ext}`
  }

  const discsSection =
    catalog.match(/export const DISCS[^=]*=\s*\[([\s\S]*?)\]\s*\n\s*\/\*\* Diamond crowns/)?.[1] || catalog
  const discRe =
    /\{\s*id:\s*'([^']+)',\s*sku:\s*'([^']+)',\s*name:\s*'([^']*(?:\\'[^']*)*)',\s*description:\s*'([^']*(?:\\'[^']*)*)'/g
  const discs = []
  let m
  while ((m = discRe.exec(discsSection)) !== null) {
    const id = m[1]
    if (!id.includes('-') || id.length > 15) continue
    const chunk = discsSection.substring(m.index, m.index + 600)
    const workVideosMatch = chunk.match(/workVideos:\s*\[([^\]]+)\]/)
    const item = {
      id,
      sku: m[2],
      name: m[3].replace(/\\'/g, "'"),
      description: m[4].replace(/\\'/g, "'"),
      image: discImage(id),
    }
    if (workVideosMatch) {
      const urls = workVideosMatch[1].match(/https?:\/\/[^\s'"`)]+/g)
      if (urls) item.workVideos = urls
    }
    discs.push(item)
  }
  const seen = new Set()
  const discsDeduped = discs.filter((d) => {
    if (seen.has(d.id)) return false
    seen.add(d.id)
    return true
  })
  const discsFinal = discsDeduped.slice(0, 72)

  const crowns = [
  {
    id: '027-70',
    sku: '027-70',
    name: 'Алмазная коронка LUFTER 70мм',
    description: 'Для бурения бетона, кирпича, камня. Сегментная конструкция.',
    image: '/images/1_sajt_razdely_2.png',
  },
  {
    id: '026-68',
    sku: '026-68',
    name: 'Алмазная коронка LUFTER 68мм',
    description: 'Для бурения отверстий в бетоне и армированных конструкциях.',
    image: '/images/1_sajt_razdely_2.png',
  },
  {
    id: '026-72',
    sku: '026-72',
    name: 'Алмазная коронка LUFTER 72мм',
    description: 'Для бурения бетона, керамогранита. Высокая износостойкость.',
    image: '/images/1_sajt_razdely_2.png',
  },
  {
    id: '026-82',
    sku: '026-82',
    name: 'Алмазная коронка LUFTER 82мм',
    description: 'Для бурения отверстий под трубы и коммуникации в твёрдых материалах.',
    image: '/images/1_sajt_razdely_2.png',
  },
  ]

  try {
    const outPath = path.join(__dirname, '../server/default-products.json')
    writeFileSync(outPath, JSON.stringify({ discs: discsFinal, crowns }, null, 2), 'utf-8')
    console.log('Wrote', discsFinal.length, 'discs,', crowns.length, 'crowns')
  } catch (e) {
    console.warn('gen-products:', e.message)
  }
}
try {
  main()
} catch (e) {
  console.warn('gen-products:', e.message)
}
process.exit(0)
