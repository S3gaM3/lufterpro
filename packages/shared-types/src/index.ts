export type UserRole = 'admin' | 'editor'

export interface AuthUser {
  id: number
  email: string
  role: UserRole
}

export interface Category {
  id: number
  name: string
  slug: string
  parentId: number | null
  sortOrder: number
  isActive: boolean
}

export interface Product {
  id: number
  name: string
  slug: string
  categoryId: number
  shortDescription: string
  fullDescriptionHtml: string
  price: number | null
  currency: string
  stockStatus: 'in_stock' | 'out_of_stock' | 'on_request'
  isActive: boolean
}

export interface Banner {
  id: number
  title: string
  imageUrl: string
  targetUrl: string
  startsAt: string
  endsAt: string
  isActive: boolean
  sortOrder: number
}
