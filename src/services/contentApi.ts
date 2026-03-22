import { apiUrl } from '@/lib/api'
import type { SiteEditableContent } from '@/types/content'

const credentials: RequestCredentials = 'include'

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

    throw new Error(message ?? 'Ошибка запроса')
  }
  return response.json() as Promise<T>
}

export async function fetchPublicContent(): Promise<SiteEditableContent> {
  return request<SiteEditableContent>('/api/content')
}

export async function adminLogin(login: string, password: string): Promise<void> {
  await request<{ ok: boolean }>('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, password }),
  })
}

export async function adminLogout(): Promise<void> {
  await request<{ ok: boolean }>('/api/admin/logout', { method: 'POST' })
}

export async function fetchAdminContent(): Promise<SiteEditableContent> {
  return request<SiteEditableContent>('/api/admin/content')
}

export async function resetRateLimit(): Promise<void> {
  const secret = import.meta.env.VITE_RATE_LIMIT_RESET_SECRET
  if (!secret) throw new Error('VITE_RATE_LIMIT_RESET_SECRET не задан в .env')
  await request<{ ok: boolean }>(`/api/admin/reset-rate-limit?secret=${encodeURIComponent(secret)}`)
}

export async function saveAdminContent(content: SiteEditableContent): Promise<SiteEditableContent> {
  const response = await request<{ ok: boolean; content: SiteEditableContent }>('/api/admin/content', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(content),
  })

  return response.content
}
