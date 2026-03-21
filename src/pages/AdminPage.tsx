import { useEffect, useState, type FormEvent } from 'react'
import type { SiteEditableContent } from '@/types/content'
import {
  adminLogin,
  clearAdminToken,
  fetchAdminContent,
  getAdminToken,
  saveAdminContent,
  setAdminToken,
} from '@/services/contentApi'

const fieldClass =
  'w-full bg-overlay border border-border rounded-xl px-4 py-3 text-fg placeholder-muted outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all'

const emptyContent = {} as SiteEditableContent

export function AdminPage() {
  const [token, setToken] = useState<string | null>(null)
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [, setContent] = useState<SiteEditableContent>(emptyContent)
  const [contentJson, setContentJson] = useState('')
  const [isBusy, setIsBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const storedToken = getAdminToken()
    if (!storedToken) return

    setToken(storedToken)
    loadContent(storedToken)
  }, [])

  async function loadContent(currentToken: string) {
    setIsBusy(true)
    setError('')
    setSuccess('')

    try {
      const data = await fetchAdminContent(currentToken)
      setContent(data)
      setContentJson(JSON.stringify(data, null, 2))
    } catch (err) {
      clearAdminToken()
      setToken(null)
      setError(err instanceof Error ? err.message : 'Не удалось загрузить данные')
    } finally {
      setIsBusy(false)
    }
  }

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsBusy(true)
    setError('')
    setSuccess('')

    try {
      const nextToken = await adminLogin(login, password)
      setAdminToken(nextToken)
      setToken(nextToken)
      setPassword('')
      await loadContent(nextToken)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка входа')
    } finally {
      setIsBusy(false)
    }
  }

  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!token) return

    setIsBusy(true)
    setError('')
    setSuccess('')

    try {
      const parsed = JSON.parse(contentJson) as SiteEditableContent
      const saved = await saveAdminContent(token, parsed)
      setContent(saved)
      setContentJson(JSON.stringify(saved, null, 2))
      setSuccess('Контент сохранен.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения')
    } finally {
      setIsBusy(false)
    }
  }

  if (!token) {
    return (
      <main className="flex-1 py-16">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card">
            <h1 className="font-display font-bold text-3xl text-fg mb-2">Вход в админку</h1>
            <p className="text-muted-light mb-6">Авторизуйтесь, чтобы менять контент главной страницы.</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="text"
                placeholder="Логин"
                className={fieldClass}
                value={login}
                onChange={(e) => setLogin(e.target.value)}
              />
              <input
                type="password"
                placeholder="Пароль"
                className={fieldClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button type="submit" className="w-full btn-primary" disabled={isBusy}>
                {isBusy ? 'Вход...' : 'Войти'}
              </button>
            </form>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display font-bold text-3xl text-fg">Панель администратора</h1>
            <p className="text-muted-light">Редактируйте весь контент главной страницы в JSON-формате.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              clearAdminToken()
              setToken(null)
            }}
            className="btn-secondary"
          >
            Выйти
          </button>
        </div>

        <form onSubmit={handleSave} className="card space-y-6">
          <div>
            <label className="block text-sm text-muted-light mb-2">Контент страницы (JSON)</label>
            <textarea
              rows={28}
              className={`${fieldClass} resize-y font-mono text-sm`}
              value={contentJson}
              onChange={(e) => setContentJson(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
          {success && <p className="text-sm text-green-400">{success}</p>}

          <button type="submit" className="btn-primary" disabled={isBusy}>
            {isBusy ? 'Сохранение...' : 'Сохранить'}
          </button>
        </form>
      </div>
    </main>
  )
}
