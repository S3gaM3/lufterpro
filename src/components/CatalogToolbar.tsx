import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import type { CatalogFiltersState } from '@/data/catalogFilters'

interface CatalogToolbarProps {
  state: CatalogFiltersState
  onSearchChange: (v: string) => void
  onLineChange?: (v: string) => void
  onDiameterChange: (v: string) => void
  onPageChange: (page: number) => void
  totalPages: number
  totalItems: number
  lines?: { value: string; label: string }[]
  diameters: number[]
  showLineFilter?: boolean
  onReset?: () => void
}

export function CatalogToolbar({
  state,
  onSearchChange,
  onLineChange,
  onDiameterChange,
  onPageChange,
  totalPages,
  totalItems,
  lines = [],
  diameters,
  showLineFilter = false,
  onReset,
}: CatalogToolbarProps) {
  const [searchInput, setSearchInput] = useState(state.search)

  useEffect(() => {
    setSearchInput(state.search)
  }, [state.search])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (searchInput !== state.search) {
        onSearchChange(searchInput)
      }
    }, 250)
    return () => window.clearTimeout(timer)
  }, [onSearchChange, searchInput, state.search])

  const visiblePages = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    const pages = new Set<number>([1, totalPages, state.page - 1, state.page, state.page + 1])
    return [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b)
  }, [state.page, totalPages])

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 space-y-4"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="search"
            placeholder="Поиск по названию, артикулу..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full px-4 py-3 pl-10 rounded-xl bg-surface border border-border text-fg placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex flex-wrap gap-3">
          {showLineFilter && onLineChange && (
            <select
              value={state.line}
              onChange={(e) => onLineChange(e.target.value)}
              className="px-4 py-3 rounded-xl bg-surface border border-border text-fg focus:outline-none focus:border-accent/50 transition-colors min-w-[160px]"
            >
              <option value="">Все линейки</option>
              {lines.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          )}

          <select
            value={state.diameter}
            onChange={(e) => onDiameterChange(e.target.value)}
            className="px-4 py-3 rounded-xl bg-surface border border-border text-fg focus:outline-none focus:border-accent/50 transition-colors min-w-[120px]"
          >
            <option value="">Все диаметры</option>
            {diameters.map((d) => (
              <option key={d} value={d}>{d} мм</option>
            ))}
          </select>

          {(state.search || state.line || state.diameter) && onReset && (
            <button
              type="button"
              onClick={onReset}
              className="px-4 py-3 rounded-xl border border-border text-muted-light hover:text-fg hover:border-accent/30 transition-colors text-sm"
            >
              Сбросить
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="text-sm text-muted">
          Найдено: {totalItems}
        </span>

        {totalPages > 1 && (
          <nav className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onPageChange(Math.max(1, state.page - 1))}
              disabled={state.page <= 1}
              className="p-2 rounded-lg border border-border text-fg hover:bg-overlay-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Предыдущая"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {visiblePages.map((p, index) => (
              <span key={p} className="contents">
                {index > 0 && visiblePages[index] - visiblePages[index - 1] > 1 && (
                  <span className="px-1 text-muted-light">…</span>
                )}
                <button
                  type="button"
                  onClick={() => onPageChange(p)}
                  className={`min-w-[40px] h-10 rounded-lg border transition-colors ${
                    p === state.page
                      ? 'bg-accent border-accent text-white'
                      : 'border-border text-fg hover:bg-overlay-hover'
                  }`}
                >
                  {p}
                </button>
              </span>
            ))}

            <button
              type="button"
              onClick={() => onPageChange(Math.min(totalPages, state.page + 1))}
              disabled={state.page >= totalPages}
              className="p-2 rounded-lg border border-border text-fg hover:bg-overlay-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Следующая"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </nav>
        )}
      </div>
    </motion.div>
  )
}
