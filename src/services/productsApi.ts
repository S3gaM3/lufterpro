import type { CatalogItem } from '@/data/catalog'
import { apiUrl } from '@/lib/api'

const credentials: RequestCredentials = 'include'

export interface ProductsData {
  discs: CatalogItem[]
  crowns: CatalogItem[]
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(apiUrl(path), {
    ...init,
    credentials: init?.credentials ?? credentials,
  })
  if (!response.ok) {
    const message = await response
      .json()
      .then((body) => body?.message as string | undefined)
      .catch(() => undefined)
    const fallback = `Ошибка запроса (${response.status})`
    throw new Error(message ?? fallback)
  }
  return response.json() as Promise<T>
}

export async function fetchProducts(): Promise<ProductsData> {
  return request<ProductsData>('/api/products')
}

export async function fetchAdminProducts(): Promise<ProductsData> {
  const res = await fetch(apiUrl('/api/admin/products'), { credentials })
  if (res.ok) return res.json() as Promise<ProductsData>
  if (res.status === 404) return fetchProducts()
  const msg = await res.json().then((b) => (b as { message?: string })?.message).catch(() => undefined)
  throw new Error(msg ?? `Ошибка запроса (${res.status})`)
}

export async function saveProducts(data: ProductsData): Promise<ProductsData> {
  const res = await request<{ discs: CatalogItem[]; crowns: CatalogItem[] }>('/api/admin/products', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res
}

export async function uploadFile(file: File): Promise<{ url: string }> {
  const formData = new FormData()
  formData.append('file', file)
  const response = await fetch(apiUrl('/api/admin/upload'), {
    method: 'POST',
    credentials,
    body: formData,
  })
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error((body?.message as string) ?? 'Ошибка загрузки')
  }
  return response.json()
}

export async function exportData(): Promise<Blob> {
  const response = await fetch(apiUrl('/api/admin/export'), { credentials })
  if (!response.ok) throw new Error('Ошибка экспорта')
  return response.blob()
}

export async function importData(data: { content?: unknown; products?: ProductsData }): Promise<void> {
  const res = await request<{ ok: boolean }>('/api/admin/import', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res?.ok) throw new Error('Ошибка импорта')
}
