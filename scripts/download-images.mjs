#!/usr/bin/env node
/**
 * Скачивает изображения товаров с lufter-tools.ru в public/images/
 */
import { mkdir, writeFile } from 'fs/promises'
import { createWriteStream } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DISKS_DIR = join(ROOT, 'public', 'images', 'disks')
const CROWNS_DIR = join(ROOT, 'public', 'images', 'crowns')

const DISK_IMAGES = [
  ['002-125', 'https://lufter-tools.ru/thumb/2/Y47a0hibWlNazrIomEHI3w/r/d/disk_almaznyj_lufter_basic_h12_125mm_002-125.png'],
  ['002-150', 'https://lufter-tools.ru/thumb/2/uTkWG2DN84f-UIOLQgIRfA/r/d/disk_almaznyj_lufter_basic_h12_150mm_002-150.png'],
  ['002-232', 'https://lufter-tools.ru/thumb/2/8G2-XUmB-99QsMjN72LNKQ/r/d/disk_almaznyj_lufter_basic_h12_232mm_002-232.png'],
  ['002-300', 'https://lufter-tools.ru/thumb/2/d5IXWKYslmbbJYPt4yOgGg/r/d/disk_almaznyj_lufter_turbo_basic_h12_002-300.png'],
  ['002-350', 'https://lufter-tools.ru/thumb/2/qRSo7N01pYB3OliGNK9axQ/r/d/disk_almaznyj_lufter_turbo_basic_h12_002-350.png'],
  ['002-400', 'https://lufter-tools.ru/thumb/2/yJ0SOQUZoSHVSCUw9GcBGg/r/d/disk_almaznyj_lufter_turbo_basic_h12_002-400.png'],
  ['002-450', 'https://lufter-tools.ru/thumb/2/03oI4h-Fq7zNaLBjBgxJlA/r/d/disk_almaznyj_lufter_turbo_basic_h12_002-450.png'],
  ['002-500', 'https://lufter-tools.ru/thumb/2/A65Ec9mcwEqNdcCPmYjYww/r/d/disk_almaznyj_lufter_turbo_basic_h12_002-500.png'],
  ['002-600', 'https://lufter-tools.ru/thumb/2/cg0Ls4fhDJtD4TPOrhxZPA/r/d/disk_almaznyj_lufter_turbo_basic_h12_002-600.png'],
  ['003-232', 'https://lufter-tools.ru/thumb/2/H4PVOfcfQf3hRFMWQGd1OQ/r/d/disk_almaznyj_lufter_biggest_003-232.png'],
  ['004-300', 'https://lufter-tools.ru/thumb/2/UQLDw4TGa4KC_SwhsQ6Jwg/r/d/disk_almaznyj_lufter_black_road_plus_segment_004-300_901750.png'],
  ['004-350', 'https://lufter-tools.ru/thumb/2/qh35qDY59wleBK7mhX0mLA/r/d/disk_almaznyj_lufter_black_road_plus_segment_004-350_1.png'],
  ['004-400', 'https://lufter-tools.ru/thumb/2/HYVyJP3j4-S88CBY3qoonQ/r/d/disk_almaznyj_lufter_black_road_plus_segment_004-400.png'],
  ['004-450', 'https://lufter-tools.ru/thumb/2/7-9RP3rf4xEn29EVG0HY0A/r/d/disk_almaznyj_lufter_black_road_plus_segment_004-450_1.png'],
  ['004-500', 'https://lufter-tools.ru/thumb/2/p7tvF6UXEkXEyxHKuP7m5w/r/d/disk_almaznyj_lufter_black_road_plus_segment_004-500.png'],
  ['005-230', 'https://lufter-tools.ru/thumb/2/9nkR3YAm4swOZ2Z08oFsMA/r/d/005-230.jpg'],
  ['005-400', 'https://lufter-tools.ru/thumb/2/vZg18-AqhNi4FpJ6sLpCsg/r/d/005-400.jpg'],
  ['006-115', 'https://lufter-tools.ru/thumb/2/__V_RK1nz1FMGA-mKsvH9w/r/d/disk_almaznyj_lufter_corner_115mm_art_006-115.png'],
  ['006-125', 'https://lufter-tools.ru/thumb/2/bd4s5tjaeHNH3LpKpxN5-w/r/d/disk_almaznyj_lufter_corner_125mm_art_006-125.png'],
  ['006-125-14', 'https://lufter-tools.ru/thumb/2/8-2scsdDM6KApux7V_b8CQ/r/d/disk_almaznyj_lufter_corner_006-125-14.png'],
  ['007-125', 'https://lufter-tools.ru/thumb/2/UgjXxVrwWSJOQQl9BPYa5g/r/d/disk_almaznyj_lufter_dolomite_007-125_841462.png'],
  ['007-180', 'https://lufter-tools.ru/thumb/2/g4n8_sHKnfXYPDMzsDWFhg/r/d/disk_almaznyj_lufter_dolomite_007-180.png'],
  ['007-200', 'https://lufter-tools.ru/thumb/2/tX2Mn5uR3jhIZZFhlgcCOA/r/d/disk_almaznyj_lufter_dolomite_200mm_art_007-200_1.png'],
  ['007-230', 'https://lufter-tools.ru/thumb/2/3mqlbYc_0-jsgpInwPqmEA/r/d/disk_almaznyj_lufter_dolomite_230mm_art_007-230.png'],
  ['007-250', 'https://lufter-tools.ru/thumb/2/YFP-2N1463zztIlGWyDDPQ/r/d/disk_almaznyj_lufter_dolomite_007-250_625458.png'],
  ['007-300', 'https://lufter-tools.ru/thumb/2/1ZTlWeG6Hg-rI8cYMQmTYQ/r/d/disk_almaznyj_lufter_dolomite_007-300.png'],
  ['007-350', 'https://lufter-tools.ru/thumb/2/S21YKKWvi3EGFVjmefF4gQ/r/d/disk_almaznyj_lufter_dolomie_350mm_art_007-350.png'],
  ['007-400', 'https://lufter-tools.ru/thumb/2/l7T1RQz3U6sejKXRlJkhOQ/r/d/disk_almaznyj_lufter_dolomie_400mm_art_007-400.png'],
  ['008-125', 'https://lufter-tools.ru/thumb/2/emsMEaCsKjfd1Ej82z-EGA/r/d/disk_almaznyj_lufter_erudite_segment_125mm_art_008-125.png'],
  ['008-230', 'https://lufter-tools.ru/thumb/2/AmiyQFIDBS7vh99nIThYeg/r/d/disk_almaznyj_lufter_erudite_segment_230mm_art_008-230.png'],
  ['009-125', 'https://lufter-tools.ru/thumb/2/Hk0YEXHpj7DyCxD5TLHRYQ/r/d/disk_almaznyj_gabbro_lux_009-125_281696.png'],
  ['009-180', 'https://lufter-tools.ru/thumb/2/Z5jkVcECgJxhy84TmG31PA/r/d/disk_almaznyj_lufter_gabbro_lux_180mm_art_009-180_1.png'],
  ['009-200', 'https://lufter-tools.ru/thumb/2/ZczKyf1AcbOviIooYJSCCw/r/d/disk_almaznyj_gabbro_lux_009-200_907897.png'],
  ['009-230', 'https://lufter-tools.ru/thumb/2/k7EzMSnLcWLn7AlU_F8lIg/r/d/disk_almaznyj_lufter_gabbro_lux_230mm_art_009-230_771250.png'],
  ['009-250', 'https://lufter-tools.ru/thumb/2/5PcxndGW_eToejLuLGuAaw/r/d/disk_almaznyj_gabbro_lux_009-250_454516.png'],
  ['009-300', 'https://lufter-tools.ru/thumb/2/3yJzN0bPVYDvjJFer2ZjNA/r/d/disk-almaznyj-lufter-gabbro-lux-300mm-art-009-300.png'],
  ['009-350', 'https://lufter-tools.ru/thumb/2/vTyIEJerB1XyHrMK6DksmA/r/d/disk-almaznyj-lufter-gabbro-lux-350mm-art-009-350.png'],
  ['009-400', 'https://lufter-tools.ru/thumb/2/vfbcYkw_gDL2jXELaN6v-w/r/d/disk-almaznyj-lufter-gabbro-lux-400mm-art-009-400.png'],
  ['010-125', 'https://lufter-tools.ru/thumb/2/YdYbJw6yefHcttGZnp-Gyw/r/d/disk_almaznyj_lufter_granite_norm_125mm_art_010-125_915611.png'],
  ['010-200', 'https://lufter-tools.ru/thumb/2/UiLGclbeTq9ocWjw0sZEeQ/r/d/disk_almaznyj_lufter_granie_norm_010-200.png'],
  ['010-230', 'https://lufter-tools.ru/thumb/2/CS8eBkT5V_oH938h8yKrrQ/r/d/disk_almaznyj_lufter_granie_norm_010-230.png'],
  ['010-250', 'https://lufter-tools.ru/thumb/2/VvBD7coxQMrg6DUPXcU2-w/r/d/disk-almaznyj-lufter-granite-norm-250mm-art-010-250_121983.png'],
  ['011-300', 'https://lufter-tools.ru/thumb/2/7W13aVKWKmnMQAPZMVegRA/r/d/disk-almaznyj-lufter-main-sandstone-segmet-300mm-art-011-300_756474.png'],
  ['011-350', 'https://lufter-tools.ru/thumb/2/gJabHiwDOAaASRb7CQLFmQ/r/d/disk_almaznyj_lufter_main_sandstone_segment_350mm_art_011-350.png'],
  ['011-400', 'https://lufter-tools.ru/thumb/2/ZFniem_7cfWC1dsbhcoEbA/r/d/disk_almaznyj_lufter_main_sandstone_segment_400mm_art_011-400.png'],
  ['012-115', 'https://lufter-tools.ru/thumb/2/BjSqvJSN1wAExgB0BK5bWQ/r/d/disk_almaznyj_lufter_new_form_115mm_art_012-115.png'],
  ['012-125', 'https://lufter-tools.ru/thumb/2/hYpvb7Yq3etJ9WBjKcEVlw/r/d/disk_almaznyj_lufter_new_form_125mm_art_012-125.png'],
  ['012-150', 'https://lufter-tools.ru/thumb/2/coVXR006ouekqLzz-dFwsA/r/d/disk_almaznyj_lufter_new_form_115mm_art_012-150.png'],
  ['012-180', 'https://lufter-tools.ru/thumb/2/uQPosFI8htjNvHnyO0nACg/r/d/disk_almaznyj_lufter_new_form_180mm_art_012-180.png'],
  ['012-232', 'https://lufter-tools.ru/thumb/2/_4ojrNFtqkFYHBmW393zQQ/r/d/disk_almaznyj_lufter_new_form_232mm_art_012-232.png'],
  ['014-125-14', 'https://lufter-tools.ru/thumb/2/m-Cv_b4b3cxhjupnNRrc4g/r/d/disk_almaznyj_lufter_sander_125mm_art_014-125-14.png'],
  ['016-115', 'https://lufter-tools.ru/thumb/2/-a0wZYf5QOqYgzI5eKOtTw/r/d/disk_almaznyj_lufter_smart_016-115.png'],
  ['016-125', 'https://lufter-tools.ru/thumb/2/i3fjkqXzaMKEo7BBLDGzaw/r/d/016-125-11.png'],
  ['018-115', 'https://lufter-tools.ru/thumb/2/DjAgZe7wKtppae8Dn0B3zg/r/d/disk_almaznyj_lufter_the_fastest_018-115.png'],
  ['018-125', 'https://lufter-tools.ru/thumb/2/7P8h45s-V7v8xnWYCb5TIg/r/d/disk_almaznyj_lufter_the_fastest_018-125_726031.png'],
  ['019-115', 'https://lufter-tools.ru/thumb/2/oMnMKFPOeFX2UDqLjcyLJQ/r/d/disk_almaznyj_lufter_thick_ceramics_carbon_115mm_art_019-115_778389.png'],
  ['019-125', 'https://lufter-tools.ru/thumb/2/LviqSFybwnKA1rz12pii6A/r/d/disk_almaznyj_lufter_thick_ceramics_carbon_125mm_art_019-125_347045.png'],
  ['019-180', 'https://lufter-tools.ru/thumb/2/zHnCji-lRrgfcsajMgfeog/r/d/disk_almaznyj_lufter_thick_ceramics_carbon_180mm_art_019-180_845495.png'],
  ['019-200', 'https://lufter-tools.ru/thumb/2/HT-tA37iMpmlXHY4F7hE1w/r/d/disk_almaznyj_lufter_thick_ceramics_carbon_200mm_art_019-200_348694.png'],
  ['019-230', 'https://lufter-tools.ru/thumb/2/_nW1tzLafXtICIqzNlEILA/r/d/disk-almaznyj-lufter-thick-ceramics-carbon-230mm-art-019-230.png'],
  ['019-250', 'https://lufter-tools.ru/thumb/2/mi40_cdQ_W_VNXkUiaPnuw/r/d/disk-almaznyj-lufter-thick-ceramics-carbon-250mm-art-019-250.png'],
  ['020-232', 'https://lufter-tools.ru/thumb/2/581Zni4QSZ7Nx3ErBJRoRQ/r/d/disk_almaznyj_lufter_turbo_high_speed_232mm_020-232.png'],
  ['021-115', 'https://lufter-tools.ru/thumb/2/EX1TVveCd1CDt-mUZmJUjg/r/d/disk_almaznyj_lufter_turbo_lux_125mm_021-115.png'],
  ['021-150', 'https://lufter-tools.ru/thumb/2/H9bZ2TDiXARhIQYWx8FaGQ/r/d/disk_almaznyj_lufter_turbo_lux_150mm_021-150.png'],
  ['021-180', 'https://lufter-tools.ru/thumb/2/yY8kVVSHeHJ5euAgoFgbGQ/r/d/disk_almaznyj_lufter_turbo_lux_180mm_021-180.png'],
  ['021-232', 'https://lufter-tools.ru/thumb/2/FYlB2AfsGOT-NOlo7W9K_A/r/d/disk_almaznyj_lufter_turbo_lux_large_232mm_021-232_284368.png'],
  ['022-115', 'https://lufter-tools.ru/thumb/2/w5Ztcv6qlpibrQqlFo728w/r/d/disk_almaznyj_lufter_turbo_premium_balance_115mm_art_022-115.png'],
  ['022-125', 'https://lufter-tools.ru/thumb/2/MZhQW2GlqDhzF5Ca77z5hw/r/d/disk_almaznyj_lufter_turbo_premium_balance_125mm_art_022-125.png'],
  ['022-150', 'https://lufter-tools.ru/thumb/2/wkNQ4d_kc_USH1PmSd8LMg/r/d/disk-almaznyj-lufter-turbo-premium-balance-150mm-art-022-150.png'],
  ['022-180', 'https://lufter-tools.ru/thumb/2/ufefZc00g4h7HkBTPGu0WQ/r/d/disk-almaznyj-lufter-turbo-premium-balance-180mm-art-022-180.png'],
  ['022-230', 'https://lufter-tools.ru/thumb/2/SIXc1oW_Gqh30tvi_eg-tQ/r/d/disk-almaznyj-lufter-turbo-premium-balance-230mm-art-022-230.png'],
  ['023-115', 'https://lufter-tools.ru/thumb/2/rOV4armN3X70Dxv5hAiD9w/r/d/disk_almaznyj_lufter_turbo_smart_tip-x_115mm_art_023-115.png'],
  ['023-125', 'https://lufter-tools.ru/thumb/2/JL6ABdhLf8q7Gynk4xFXIw/r/d/023-125.png'],
  ['023-232', 'https://lufter-tools.ru/thumb/2/qAJ7DkLUR4CNC36DBOMdtg/r/d/disk_almaznyj_lufter_turbo_smart_tip-x_232mm_art_023-232.png'],
  ['024-125', 'https://lufter-tools.ru/thumb/2/h5-udWB63QWtKrbGsEQbcw/r/d/disk_almaznyj_lufter_uranium_segment_h12_024-125.png'],
  ['024-230', 'https://lufter-tools.ru/thumb/2/bafW-20sO1j9RxjYFqRZdg/r/d/disk_almaznyj_uranium_segment_h12_024-230.png'],
  ['024-300', 'https://lufter-tools.ru/thumb/2/sOPaChjg6CSxxIEVA4Uyug/r/d/disk_almaznyj_lufter_uranium_segment_h12_024-300.png'],
  ['024-350', 'https://lufter-tools.ru/thumb/2/vrpM4F8eFDgEXEIdhiFG7w/r/d/disk_almaznyj_lufter_uranium_segment_h12_024-350.png'],
  ['024-400', 'https://lufter-tools.ru/thumb/2/mrz8myK96f_L_KytWsx4xA/r/d/disk_almaznyj_lufter_uranium_segment_h12_024-400.png'],
  ['024-450', 'https://lufter-tools.ru/thumb/2/LypFLdnexpJBEIHK1pddQg/r/d/disk_almaznyj_lufter_uranium_segment_h12_024-450.png'],
  ['024-500', 'https://lufter-tools.ru/thumb/2/1P_6P3_wFjsLXMoxfVZMZA/r/d/disk_almaznyj_lufter_uranium_segment_h12_500mm_art_024-500.png'],
  ['024-600', 'https://lufter-tools.ru/thumb/2/B1GSzKF0xrIQxxwKPO2J1A/r/d/disk_almaznyj_lufter_uranium_segment_h12_600mm_art_024-600.png'],
  ['001-180', 'https://lufter-tools.ru/thumb/2/xgsdyCasSdyj6eTRfjGhjg/r/d/001-180.jpg'],
  ['001-200', 'https://lufter-tools.ru/thumb/2/gLxDrRMgJTCXfIUWK-6MjA/r/d/001-200.jpg'],
  ['001-230', 'https://lufter-tools.ru/thumb/2/nH95Sa56GCrktgeRgPa2kQ/r/d/001-230.jpg'],
  ['001-250', 'https://lufter-tools.ru/thumb/2/5eQItVwy7V5gpJvXep4O7w/r/d/001-250.jpg'],
]

async function download(url, filepath) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`)
  const buffer = await res.arrayBuffer()
  await writeFile(filepath, Buffer.from(buffer))
}

async function main() {
  await mkdir(DISKS_DIR, { recursive: true })
  await mkdir(CROWNS_DIR, { recursive: true })

  const seen = new Set()
  for (const [sku, url] of DISK_IMAGES) {
    if (seen.has(url)) continue
    seen.add(url)
    const ext = url.endsWith('.jpg') ? 'jpg' : 'png'
    const path = join(DISKS_DIR, `${sku}.${ext}`)
    try {
      console.log(`Downloading ${sku}...`)
      await download(url, path)
    } catch (e) {
      console.error(`Failed ${sku}:`, e.message)
    }
  }
  console.log('Done.')
}

main()
