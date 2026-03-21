import type { SiteEditableContent } from '@/types/content'

const TOKEN_KEY = 'admin_token'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, init)
  if (!response.ok) {
    const message = await response
      .json()
      .then((body) => body?.message as string | undefined)
      .catch(() => undefined)

    throw new Error(message ?? 'Ошибка запроса')
  }
  return response.json() as Promise<T>
}

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setAdminToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearAdminToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export async function fetchPublicContent(): Promise<SiteEditableContent> {
  return request<SiteEditableContent>('/api/content')
}

export async function adminLogin(login: string, password: string): Promise<string> {
  const response = await request<{ token: string }>('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, password }),
  })

  return response.token
}

function authHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

export async function fetchAdminContent(token: string): Promise<SiteEditableContent> {
  return request<SiteEditableContent>('/api/admin/content', {
    headers: authHeaders(token),
  })
}

export async function saveAdminContent(token: string, content: SiteEditableContent): Promise<SiteEditableContent> {
  const response = await request<{ ok: boolean; content: SiteEditableContent }>('/api/admin/content', {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(content),
  })

  return response.content
}
