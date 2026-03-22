import { useEffect, useState } from 'react'
import type { CatalogItem } from '@/data/catalog'
import { DISCS, CROWNS } from '@/data/catalog'
import { fetchProducts } from '@/services/productsApi'

export interface ProductsState {
  discs: CatalogItem[]
  crowns: CatalogItem[]
  isLoading: boolean
  error: string | null
}

export function useProducts(): ProductsState {
  const [state, setState] = useState<ProductsState>({
    discs: DISCS,
    crowns: CROWNS,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false
    setState((s) => ({ ...s, isLoading: true, error: null }))
    fetchProducts()
      .then((data) => {
        if (cancelled) return
        const hasDiscs = Array.isArray(data.discs) && data.discs.length > 0
        const hasCrowns = Array.isArray(data.crowns) && data.crowns.length > 0
        setState({
          discs: hasDiscs ? data.discs : DISCS,
          crowns: hasCrowns ? data.crowns : CROWNS,
          isLoading: false,
          error: null,
        })
      })
      .catch(() => {
        if (cancelled) return
        setState({
          discs: DISCS,
          crowns: CROWNS,
          isLoading: false,
          error: null,
        })
      })
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
