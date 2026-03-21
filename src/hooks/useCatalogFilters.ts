import { useState, useCallback, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { CatalogItem } from '@/data/catalog'
import {
  filterDiscs,
  filterCrowns,
  paginate,
  getTotalPages,
  getUniqueDiscLines,
  getUniqueDiameters,
  DEFAULT_FILTERS,
  type CatalogFiltersState,
} from '@/data/catalogFilters'

export type CatalogType = 'discs' | 'crowns'

function stateFromParams(params: URLSearchParams): CatalogFiltersState {
  const pageRaw = parseInt(params.get('page') ?? '1', 10)
  return {
    search: params.get('q') ?? '',
    line: params.get('line') ?? '',
    diameter: params.get('d') ?? '',
    page: Number.isNaN(pageRaw) ? 1 : Math.max(1, pageRaw),
    perPage: DEFAULT_FILTERS.perPage,
  }
}

function stateToParams(state: CatalogFiltersState): URLSearchParams {
  const p = new URLSearchParams()
  if (state.search) p.set('q', state.search)
  if (state.line) p.set('line', state.line)
  if (state.diameter) p.set('d', state.diameter)
  if (state.page > 1) p.set('page', String(state.page))
  return p
}

export function useCatalogFilters(items: CatalogItem[], type: CatalogType) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [state, setState] = useState<CatalogFiltersState>(() =>
    stateFromParams(searchParams)
  )

  useEffect(() => {
    setState(stateFromParams(searchParams))
  }, [searchParams])

  const updateFilter = useCallback(<K extends keyof CatalogFiltersState>(
    key: K,
    value: CatalogFiltersState[K]
  ) => {
    const current = stateFromParams(searchParams)
    const next: CatalogFiltersState = { ...current, [key]: value }
    if (key === 'search' || key === 'line' || key === 'diameter') {
      next.page = 1
    }
    setSearchParams(stateToParams(next), { replace: true })
  }, [searchParams, setSearchParams])

  const filtered = useMemo(() => {
    return type === 'discs' ? filterDiscs(items, state) : filterCrowns(items, state)
  }, [items, type, state])

  const totalPages = useMemo(
    () => getTotalPages(filtered.length, state.perPage),
    [filtered.length, state.perPage]
  )

  const safePage = Math.min(state.page, totalPages)

  useEffect(() => {
    if (state.page !== safePage) {
      const next = { ...state, page: safePage }
      setSearchParams(stateToParams(next), { replace: true })
    }
  }, [safePage, setSearchParams, state])

  const paginated = useMemo(
    () => paginate(filtered, safePage, state.perPage),
    [filtered, safePage, state.perPage]
  )

  const lines = useMemo(() => getUniqueDiscLines(items), [items])
  const diameters = useMemo(() => getUniqueDiameters(items), [items])

  const resetFilters = useCallback(() => {
    setState(DEFAULT_FILTERS)
    setSearchParams({}, { replace: true })
  }, [setSearchParams])

  return {
    state: { ...state, page: safePage },
    updateFilter,
    filtered,
    paginated,
    totalPages,
    lines,
    diameters,
    resetFilters,
  }
}
