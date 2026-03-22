import type { CatalogItem } from '@/data/catalog'
import { DISCS, CROWNS } from '@/data/catalog'

export interface ProductsState {
  discs: CatalogItem[]
  crowns: CatalogItem[]
  isLoading: boolean
  error: string | null
}

export function useProducts(): ProductsState {
  return {
    discs: DISCS,
    crowns: CROWNS,
    isLoading: false,
    error: null,
  }
}
