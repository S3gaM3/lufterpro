/**
 * Категории, фильтры и утилиты для каталога.
 * Линейки дисков определяются по префиксу SKU.
 */

import type { CatalogItem } from './catalog'

/** Линейка диска (категория по типу/серии) */
const DISC_LINE_BY_PREFIX: Record<string, string> = {
  '001': 'Angle Shape',
  '002': 'Basic H12',
  '003': 'Biggest',
  '004': 'Black Road Plus',
  '005': 'Black Road',
  '006': 'Corner',
  '007': 'Dolomite',
  '008': 'Erudite',
  '009': 'Gabbro Lux',
  '010': 'Granite Norm',
  '011': 'Main Sandstone',
  '012': 'New Form',
  '014': 'Sander',
  '016': 'Smart',
  '018': 'The Fastest',
  '019': 'Thick Ceramics Carbon',
  '020': 'Turbo High Speed',
  '021': 'Turbo Lux',
  '022': 'Turbo Premium Balance',
  '023': 'Turbo Smart Tip-X',
  '024': 'Uranium Segment',
}

export function getDiscLine(item: CatalogItem): string | undefined {
  if (!item.sku) return undefined
  const prefix = item.sku.split('-')[0]
  return DISC_LINE_BY_PREFIX[prefix]
}

export function getDiameter(item: CatalogItem): number | undefined {
  const match = item.name.match(/(\d{2,3})\s*мм/)
  return match ? parseInt(match[1], 10) : undefined
}

export function getUniqueDiscLines(items: CatalogItem[]): { value: string; label: string }[] {
  const seen = new Set<string>()
  const result: { value: string; label: string }[] = []
  for (const item of items) {
    const line = getDiscLine(item)
    if (line && !seen.has(line)) {
      seen.add(line)
      result.push({ value: line, label: line })
    }
  }
  return result.sort((a, b) => a.label.localeCompare(b.label))
}

export function getUniqueDiameters(items: CatalogItem[]): number[] {
  const seen = new Set<number>()
  for (const item of items) {
    const d = getDiameter(item)
    if (d != null) seen.add(d)
  }
  return [...seen].sort((a, b) => a - b)
}

export interface CatalogFiltersState {
  search: string
  line: string
  diameter: string
  page: number
  perPage: number
}

export const DEFAULT_FILTERS: CatalogFiltersState = {
  search: '',
  line: '',
  diameter: '',
  page: 1,
  perPage: 12,
}

export function filterDiscs(
  items: CatalogItem[],
  state: CatalogFiltersState
): CatalogItem[] {
  let result = items

  if (state.search.trim()) {
    const q = state.search.trim().toLowerCase()
    result = result.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        (item.sku?.toLowerCase().includes(q)) ||
        (item.description?.toLowerCase().includes(q))
    )
  }

  if (state.line) {
    result = result.filter((item) => getDiscLine(item) === state.line)
  }

  if (state.diameter) {
    const d = parseInt(state.diameter, 10)
    result = result.filter((item) => getDiameter(item) === d)
  }

  return result
}

export function filterCrowns(
  items: CatalogItem[],
  state: CatalogFiltersState
): CatalogItem[] {
  let result = items

  if (state.search.trim()) {
    const q = state.search.trim().toLowerCase()
    result = result.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        (item.sku?.toLowerCase().includes(q)) ||
        (item.description?.toLowerCase().includes(q))
    )
  }

  if (state.diameter) {
    const d = parseInt(state.diameter, 10)
    result = result.filter((item) => getDiameter(item) === d)
  }

  return result
}

export function paginate<T>(items: T[], page: number, perPage: number): T[] {
  const start = (page - 1) * perPage
  return items.slice(start, start + perPage)
}

export function getTotalPages(totalItems: number, perPage: number): number {
  return Math.max(1, Math.ceil(totalItems / perPage))
}
