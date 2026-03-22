/** Базовый URL API. Пустая строка = относительные пути (тот же origin). */
export const API_BASE = (import.meta.env.VITE_API_BASE as string) ?? ''

export function apiUrl(path: string): string {
  const base = API_BASE.replace(/\/$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return base + p
}
