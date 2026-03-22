import { useEffect, useState, type FormEvent } from 'react'
import type { SiteEditableContent, SiteFeature } from '@/types/content'
import type { CatalogItem } from '@/data/catalog'
import { DISCS, CROWNS } from '@/data/catalog'
import {
  adminLogin,
  adminLogout,
  fetchAdminContent,
  resetRateLimit,
  saveAdminContent,
} from '@/services/contentApi'
import {
  fetchAdminProducts,
  saveProducts,
  uploadFile,
  exportData,
  importData,
  type ProductsData,
} from '@/services/productsApi'

const fieldClass =
  'w-full bg-overlay border border-border rounded-xl px-4 py-3 text-fg placeholder-muted outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all'
const labelClass = 'block text-sm text-muted-light mb-2'
const sectionClass = 'rounded-xl border border-border p-6 space-y-4 bg-overlay'

const emptyContent: SiteEditableContent = {
  topBarAddressAriaLabel: '',
  headerMenuDiscsLabel: '',
  headerMenuCrownsLabel: '',
  headerMenuContactsLabel: '',
  headerFeedbackButtonLabel: '',
  mobileMenuAriaLabel: '',
  heroTitle: '',
  heroLead: '',
  heroConsultButtonLabel: '',
  heroBrochureButtonLabel: '',
  productsTitle: '',
  productsLead: '',
  productsDiscsTitle: '',
  productsDiscsLinkLabel: '',
  productsCrownsTitle: '',
  productsCrownsLinkLabel: '',
  orderTitle: '',
  orderLead: '',
  orderSuccessMessage: '',
  orderPhoneLabel: '',
  orderNameLabel: '',
  orderPhonePlaceholder: '',
  orderNamePlaceholder: '',
  orderSubmitLabel: '',
  orderSubmittingLabel: '',
  orderAgreementLead: '',
  orderAgreementLinkLabel: '',
  aboutTitle: '',
  aboutText: '',
  aboutImageAlt: '',
  featuresTitle: '',
  featuresLead: '',
  mapTitle: '',
  footerContactsTitle: '',
  footerFormTitle: '',
  footerFormLead: '',
  footerSuccessMessage: '',
  footerNamePlaceholder: '',
  footerPhonePlaceholder: '',
  footerConsentPersonalLabel: '',
  footerConsentAgreementLead: '',
  footerConsentAgreementLinkLabel: '',
  footerSubmitLabel: '',
  footerSubmittingLabel: '',
  footerCopyright: '',
  footerContactsLinkLabel: '',
  feedbackTitle: '',
  feedbackLead: '',
  feedbackSuccessTitle: '',
  feedbackSuccessMessage: '',
  feedbackNamePlaceholder: '',
  feedbackPhonePlaceholder: '',
  feedbackCommentPlaceholder: '',
  feedbackConsentPersonalLabel: '',
  feedbackConsentAgreementLead: '',
  feedbackConsentAgreementLinkLabel: '',
  feedbackSubmitLabel: '',
  feedbackSubmittingLabel: '',
  features: [
    { title: '', text: '', iconKey: 'warehouse' },
    { title: '', text: '', iconKey: 'quality' },
    { title: '', text: '', iconKey: 'price' },
  ],
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
  rows = 3,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  multiline?: boolean
  rows?: number
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {multiline ? (
        <textarea
          rows={rows}
          className={`${fieldClass} resize-y`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type="text"
          className={fieldClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <section className={sectionClass}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left font-display font-semibold text-lg text-fg"
      >
        {title}
        <span className="text-muted-light">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="space-y-4 pt-2">{children}</div>}
    </section>
  )
}

const emptyProduct: CatalogItem = {
  id: '',
  sku: '',
  name: '',
  description: '',
  image: '',
}

function ProductForm({
  item,
  onChange,
  onUpload,
  onCancel,
  onDelete,
  isNew,
}: {
  item: CatalogItem
  onChange: (item: CatalogItem) => void
  onUpload: (file: File) => Promise<{ url: string }>
  onCancel: () => void
  onDelete?: () => void
  isNew?: boolean
}) {
  const [uploading, setUploading] = useState(false)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const { url } = await onUpload(file)
      onChange({ ...item, image: url })
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }
  return (
    <div className={`${sectionClass} space-y-4`}>
      <div className="flex justify-between items-center">
        <span className="font-medium text-fg">{isNew ? 'Новый товар' : item.name || '(без названия)'}</span>
        <div className="flex gap-2">
          {onDelete && !isNew && (
            <button type="button" onClick={onDelete} className="btn-secondary text-sm text-red-400">
              Удалить
            </button>
          )}
          <button type="button" onClick={onCancel} className="btn-secondary text-sm">
            {isNew ? 'Отмена' : 'Закрыть'}
          </button>
        </div>
      </div>
      <Field label="ID" value={item.id} onChange={(v) => onChange({ ...item, id: v })} />
      <Field label="SKU" value={item.sku ?? ''} onChange={(v) => onChange({ ...item, sku: v })} />
      <Field label="Название" value={item.name} onChange={(v) => onChange({ ...item, name: v })} />
      <Field label="Краткое описание" value={item.description ?? ''} onChange={(v) => onChange({ ...item, description: v })} multiline rows={2} />
      <Field label="Расширенное описание" value={item.fullDescription ?? ''} onChange={(v) => onChange({ ...item, fullDescription: v })} multiline rows={4} />
      <Field label="Цена" value={item.price ?? ''} onChange={(v) => onChange({ ...item, price: v })} />
      <Field
        label="Видео работы (URL через запятую)"
        value={(item.workVideos ?? []).join(', ')}
        onChange={(v) => onChange({ ...item, workVideos: v ? v.split(',').map((s) => s.trim()).filter(Boolean) : [] })}
      />
      <div>
        <label className={labelClass}>Изображение</label>
        <div className="flex gap-2 items-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="text-sm"
          />
          {uploading && <span className="text-muted-light text-sm">Загрузка...</span>}
        </div>
        <Field label="URL изображения" value={item.image ?? ''} onChange={(v) => onChange({ ...item, image: v })} />
      </div>
    </div>
  )
}

function ProductsTab({
  products,
  onProductsChange,
  onSave,
  isBusy,
  error,
  success,
  onUpload,
}: {
  products: ProductsData
  onProductsChange: (p: ProductsData) => void
  onSave: () => Promise<void>
  isBusy: boolean
  error: string
  success: string
  onUpload: (file: File) => Promise<{ url: string }>
}) {
  const [category, setCategory] = useState<'discs' | 'crowns'>('discs')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | 'new' | null>(null)
  const [draft, setDraft] = useState<CatalogItem | null>(null)

  const items = products[category]
  const filtered = search.trim()
    ? items.filter(
        (i) =>
          i.name?.toLowerCase().includes(search.toLowerCase()) ||
          i.id?.toLowerCase().includes(search.toLowerCase()) ||
          i.sku?.toLowerCase().includes(search.toLowerCase())
      )
    : items

  const handleSelect = (item: CatalogItem | null) => {
    if (item) {
      setDraft({ ...item })
      setSelectedId(item.id)
    } else {
      setDraft({ ...emptyProduct })
      setSelectedId('new')
    }
  }

  const handleApply = () => {
    if (!draft || !draft.id || !draft.name) return
    if (selectedId === 'new') {
      onProductsChange({ ...products, [category]: [...items, draft] })
    } else {
      onProductsChange({
        ...products,
        [category]: items.map((i) => (i.id === draft.id ? draft : i)),
      })
    }
    setSelectedId(null)
    setDraft(null)
  }

  const handleDelete = () => {
    if (!selectedId || selectedId === 'new' || !confirm('Удалить товар?')) return
    onProductsChange({ ...products, [category]: items.filter((i) => i.id !== selectedId) })
    setSelectedId(null)
    setDraft(null)
  }

  return (
    <section className={sectionClass}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => { setCategory('discs'); setSelectedId(null); setDraft(null) }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${category === 'discs' ? 'bg-accent text-white' : 'bg-surface text-muted-light hover:bg-overlay'}`}
          >
            Диски ({products.discs.length})
          </button>
          <button
            type="button"
            onClick={() => { setCategory('crowns'); setSelectedId(null); setDraft(null) }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${category === 'crowns' ? 'bg-accent text-white' : 'bg-surface text-muted-light hover:bg-overlay'}`}
          >
            Коронки ({products.crowns.length})
          </button>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => handleSelect(null)} className="btn-secondary text-sm">
            + Новый товар
          </button>
          <button type="button" onClick={onSave} disabled={isBusy} className="btn-primary text-sm">
            {isBusy ? 'Сохранение...' : 'Сохранить всё'}
          </button>
        </div>
      </div>
      {error && <p className="text-sm text-red-400 mb-2">{error}</p>}
      {success && <p className="text-sm text-green-400 mb-2">{success}</p>}

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <input
            type="search"
            placeholder="Поиск по названию, ID, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${fieldClass} mb-3`}
          />
          <div className="space-y-1 max-h-[420px] overflow-y-auto pr-1">
            {filtered.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedId === item.id
                    ? 'bg-accent/10 border-accent'
                    : 'bg-surface border-border hover:border-muted'
                }`}
              >
                <span className="text-sm text-muted-light">{item.sku || item.id}</span>
                <p className="truncate font-medium text-fg">{item.name || '(без названия)'}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-[200px]">
          {draft && selectedId ? (
            <>
              <ProductForm
                item={draft}
                onChange={setDraft}
                onUpload={onUpload}
                onCancel={() => { setSelectedId(null); setDraft(null) }}
                onDelete={selectedId !== 'new' ? handleDelete : undefined}
                isNew={selectedId === 'new'}
              />
              <button
                type="button"
                onClick={handleApply}
                disabled={!draft.id || !draft.name || isBusy}
                className="btn-primary mt-4"
              >
                {selectedId === 'new' ? 'Добавить' : 'Применить'}
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-16 text-muted-light">
              <p className="text-center">Выберите товар слева или нажмите «Новый товар»</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function ExportImportTab({
  onExport,
  onImport,
  onSeedFromCatalog,
  isBusy,
  error,
  success,
}: {
  onExport: () => Promise<Blob>
  onImport: (data: { content?: unknown; products?: ProductsData }) => Promise<void>
  onSeedFromCatalog: () => Promise<void>
  isBusy: boolean
  error: string
  success: string
}) {
  const [importJson, setImportJson] = useState('')
  const [importing, setImporting] = useState(false)

  const handleExport = async () => {
    try {
      const blob = await onExport()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `newlufter-backup-${Date.now()}.json`
      a.click()
      URL.revokeObjectURL(a.href)
    } catch {
      /* error shown via parent */
    }
  }
  const handleImport = async () => {
    let data: unknown
    try {
      data = JSON.parse(importJson)
    } catch {
      setImportJson('Ошибка: неверный JSON')
      return
    }
    if (!data || typeof data !== 'object') return
    const obj = data as Record<string, unknown>
    setImporting(true)
    try {
      await onImport({
        content: obj.content,
        products: obj.products as ProductsData | undefined,
      })
      setImportJson('')
    } finally {
      setImporting(false)
    }
  }

  return (
    <section className={sectionClass}>
      <h2 className="font-display font-semibold text-lg text-fg mb-4">Выгрузка и загрузка данных</h2>
      {error && <p className="text-sm text-red-400 mb-2">{error}</p>}
      {success && <p className="text-sm text-green-400 mb-2">{success}</p>}
      <div className="space-y-6">
        <div>
          <h3 className="font-medium text-fg mb-2">Экспорт</h3>
          <p className="text-muted-light text-sm mb-2">Скачать полный бэкап: контент сайта + товары.</p>
          <button type="button" onClick={handleExport} disabled={isBusy} className="btn-primary">
            Скачать бэкап
          </button>
        </div>
        <div>
          <h3 className="font-medium text-fg mb-2">Импорт</h3>
          <p className="text-muted-light text-sm mb-2">Вставьте JSON бэкапа или файла с content/products.</p>
          <textarea
            value={importJson}
            onChange={(e) => setImportJson(e.target.value)}
            placeholder='{"content": {...}, "products": {"discs": [...], "crowns": [...]}}'
            className={`${fieldClass} font-mono text-sm min-h-[120px]`}
          />
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={handleImport}
              disabled={!importJson.trim() || isBusy || importing}
              className="btn-primary"
            >
              {importing ? 'Импорт...' : 'Импортировать'}
            </button>
          </div>
        </div>
        <div>
          <h3 className="font-medium text-fg mb-2">Импорт встроенного каталога</h3>
          <p className="text-muted-light text-sm mb-2">
            Загрузить диски и коронки из статического каталога (72 диска, 4 коронки) в хранилище.
          </p>
          <button type="button" onClick={onSeedFromCatalog} disabled={isBusy} className="btn-secondary">
            Импортировать встроенный каталог
          </button>
        </div>
      </div>
    </section>
  )
}

export function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [content, setContent] = useState<SiteEditableContent>(emptyContent)
  const [isBusy, setIsBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState(0)
  const [resetMsg, setResetMsg] = useState('')
  const [products, setProducts] = useState<ProductsData>({ discs: [], crowns: [] })

  const tabs = [
    'Шапка и меню',
    'Hero',
    'Предлагаем Вам',
    'Оформление заказа',
    'О нас',
    'Преимущества',
    'Карта',
    'Подвал',
    'Обратная связь',
    'Товары',
    'Выгрузка/Загрузка',
  ]

  useEffect(() => {
    checkAuthAndLoad()
  }, [])

  useEffect(() => {
    if (isAuthenticated && activeTab === 9) {
      loadProducts()
    }
  }, [isAuthenticated, activeTab])

  async function checkAuthAndLoad() {
    try {
      const data = await fetchAdminContent()
      setIsAuthenticated(true)
      setContent(data)
    } catch {
      setIsAuthenticated(false)
    }
  }

  async function loadContent() {
    setIsBusy(true)
    setError('')
    setSuccess('')
    try {
      const data = await fetchAdminContent()
      setContent(data)
    } catch (err) {
      setIsAuthenticated(false)
      setError(err instanceof Error ? err.message : 'Не удалось загрузить данные')
    } finally {
      setIsBusy(false)
    }
  }

  async function loadProducts() {
    try {
      const data = await fetchAdminProducts()
      setProducts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить товары')
    }
  }

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsBusy(true)
    setError('')
    setSuccess('')
    try {
      await adminLogin(login, password)
      setPassword('')
      await loadContent()
      setIsAuthenticated(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка входа')
    } finally {
      setIsBusy(false)
    }
  }

  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsBusy(true)
    setError('')
    setSuccess('')
    try {
      const saved = await saveAdminContent(content)
      setContent(saved)
      setSuccess('Контент сохранён.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения')
    } finally {
      setIsBusy(false)
    }
  }

  async function handleLogout() {
    try {
      await adminLogout()
    } catch {
      /* ignore */
    }
    setIsAuthenticated(false)
  }

  function update<K extends keyof SiteEditableContent>(key: K, value: SiteEditableContent[K]) {
    setContent((prev) => ({ ...prev, [key]: value }))
  }

  function updateFeature(index: number, field: keyof SiteFeature, value: string) {
    setContent((prev) => {
      const next = [...prev.features]
      next[index] = { ...next[index], [field]: value }
      return { ...prev, features: next }
    })
  }

  if (isAuthenticated === null) {
    return (
      <main className="flex-1 py-16">
        <div className="max-w-md mx-auto px-4 text-center text-muted-light">Проверка доступа...</div>
      </main>
    )
  }

  if (!isAuthenticated) {
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
              {import.meta.env.VITE_RATE_LIMIT_RESET_SECRET && (
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await resetRateLimit()
                      setResetMsg('Лимит сброшен. Попробуйте войти снова.')
                      setError('')
                    } catch (e) {
                      setResetMsg('')
                      setError(e instanceof Error ? e.message : 'Не удалось сбросить')
                    }
                  }}
                  className="w-full btn-secondary mt-2 text-sm"
                >
                  Сбросить лимит попыток
                </button>
              )}
              {resetMsg && <p className="text-sm text-green-400">{resetMsg}</p>}
            </form>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display font-bold text-2xl text-fg">Панель администратора</h1>
            <p className="text-muted-light text-sm">Редактируйте разделы и сохраняйте изменения.</p>
          </div>
          <button type="button" onClick={handleLogout} className="btn-secondary text-sm">
            Выйти
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex flex-wrap gap-2 border-b border-border pb-3">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(i)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === i ? 'bg-accent text-white' : 'bg-overlay hover:bg-overlay-hover text-muted-light'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 0 && (
            <Section title="Шапка и меню">
              <Field label="Текст кнопки «Диски»" value={content.headerMenuDiscsLabel} onChange={(v) => update('headerMenuDiscsLabel', v)} />
              <Field label="Текст кнопки «Коронки»" value={content.headerMenuCrownsLabel} onChange={(v) => update('headerMenuCrownsLabel', v)} />
              <Field label="Текст кнопки «Контакты»" value={content.headerMenuContactsLabel} onChange={(v) => update('headerMenuContactsLabel', v)} />
              <Field label="Текст кнопки «Обратная связь»" value={content.headerFeedbackButtonLabel} onChange={(v) => update('headerFeedbackButtonLabel', v)} />
              <Field label="Подпись кнопки мобильного меню (aria-label)" value={content.mobileMenuAriaLabel} onChange={(v) => update('mobileMenuAriaLabel', v)} />
              <Field label="Подпись ссылки адреса на карте (aria-label)" value={content.topBarAddressAriaLabel} onChange={(v) => update('topBarAddressAriaLabel', v)} />
            </Section>
          )}

          {activeTab === 1 && (
            <Section title="Hero — главный блок">
              <Field label="Заголовок" value={content.heroTitle} onChange={(v) => update('heroTitle', v)} />
              <Field label="Текст под заголовком" value={content.heroLead} onChange={(v) => update('heroLead', v)} multiline rows={5} />
              <Field label="Текст кнопки «Получить консультацию»" value={content.heroConsultButtonLabel} onChange={(v) => update('heroConsultButtonLabel', v)} />
              <Field label="Текст кнопки «Скачать брошюру»" value={content.heroBrochureButtonLabel} onChange={(v) => update('heroBrochureButtonLabel', v)} />
            </Section>
          )}

          {activeTab === 2 && (
            <Section title="Предлагаем Вам — категории">
              <Field label="Заголовок секции" value={content.productsTitle} onChange={(v) => update('productsTitle', v)} />
              <Field label="Подзаголовок" value={content.productsLead} onChange={(v) => update('productsLead', v)} />
              <Field label="Заголовок карточки «Диски»" value={content.productsDiscsTitle} onChange={(v) => update('productsDiscsTitle', v)} />
              <Field label="Подпись ссылки «Каталог дисков»" value={content.productsDiscsLinkLabel} onChange={(v) => update('productsDiscsLinkLabel', v)} />
              <Field label="Заголовок карточки «Коронки»" value={content.productsCrownsTitle} onChange={(v) => update('productsCrownsTitle', v)} />
              <Field label="Подпись ссылки «Каталог коронок»" value={content.productsCrownsLinkLabel} onChange={(v) => update('productsCrownsLinkLabel', v)} />
            </Section>
          )}

          {activeTab === 3 && (
            <Section title="Оформление заказа">
              <Field label="Заголовок" value={content.orderTitle} onChange={(v) => update('orderTitle', v)} />
              <Field label="Описание" value={content.orderLead} onChange={(v) => update('orderLead', v)} />
              <Field label="Сообщение об успешной отправке" value={content.orderSuccessMessage} onChange={(v) => update('orderSuccessMessage', v)} />
              <Field label="Подпись поля «Телефон»" value={content.orderPhoneLabel} onChange={(v) => update('orderPhoneLabel', v)} />
              <Field label="Подпись поля «Имя»" value={content.orderNameLabel} onChange={(v) => update('orderNameLabel', v)} />
              <Field label="Placeholder телефона" value={content.orderPhonePlaceholder} onChange={(v) => update('orderPhonePlaceholder', v)} />
              <Field label="Placeholder имени" value={content.orderNamePlaceholder} onChange={(v) => update('orderNamePlaceholder', v)} />
              <Field label="Текст кнопки «Отправить»" value={content.orderSubmitLabel} onChange={(v) => update('orderSubmitLabel', v)} />
              <Field label="Текст во время отправки" value={content.orderSubmittingLabel} onChange={(v) => update('orderSubmittingLabel', v)} />
              <Field label="Текст перед ссылкой на соглашение" value={content.orderAgreementLead} onChange={(v) => update('orderAgreementLead', v)} />
              <Field label="Текст ссылки на соглашение" value={content.orderAgreementLinkLabel} onChange={(v) => update('orderAgreementLinkLabel', v)} />
            </Section>
          )}

          {activeTab === 4 && (
            <Section title="О нас">
              <Field label="Заголовок" value={content.aboutTitle} onChange={(v) => update('aboutTitle', v)} />
              <Field label="Текст (абзацы через новую строку)" value={content.aboutText} onChange={(v) => update('aboutText', v)} multiline rows={8} />
              <Field label="Подпись фото (alt)" value={content.aboutImageAlt} onChange={(v) => update('aboutImageAlt', v)} />
            </Section>
          )}

          {activeTab === 5 && (
            <Section title="Преимущества (Почему LUFTER)">
              <Field label="Заголовок секции" value={content.featuresTitle} onChange={(v) => update('featuresTitle', v)} />
              <Field label="Подзаголовок" value={content.featuresLead} onChange={(v) => update('featuresLead', v)} />
              {content.features.map((f, i) => (
                <div key={i} className="rounded-lg border border-border p-4 space-y-3 bg-surface">
                  <p className="text-fg font-medium">Карточка {i + 1}</p>
                  <Field label="Заголовок" value={f.title} onChange={(v) => updateFeature(i, 'title', v)} />
                  <Field label="Описание" value={f.text} onChange={(v) => updateFeature(i, 'text', v)} multiline rows={2} />
                  <div>
                    <label className={labelClass}>Иконка</label>
                    <select
                      className={fieldClass}
                      value={f.iconKey}
                      onChange={(e) => updateFeature(i, 'iconKey', e.target.value as SiteFeature['iconKey'])}
                    >
                      <option value="warehouse">Склад (warehouse)</option>
                      <option value="quality">Качество (quality)</option>
                      <option value="price">Цена (price)</option>
                    </select>
                  </div>
                </div>
              ))}
            </Section>
          )}

          {activeTab === 6 && (
            <Section title="Карта">
              <Field label="Подпись iframe карты (title)" value={content.mapTitle} onChange={(v) => update('mapTitle', v)} />
            </Section>
          )}

          {activeTab === 7 && (
            <Section title="Подвал">
              <Field label="Заголовок «Контакты»" value={content.footerContactsTitle} onChange={(v) => update('footerContactsTitle', v)} />
              <Field label="Заголовок формы «Остались вопросы?»" value={content.footerFormTitle} onChange={(v) => update('footerFormTitle', v)} />
              <Field label="Подзаголовок формы" value={content.footerFormLead} onChange={(v) => update('footerFormLead', v)} />
              <Field label="Сообщение об успешной отправке" value={content.footerSuccessMessage} onChange={(v) => update('footerSuccessMessage', v)} />
              <Field label="Placeholder имени" value={content.footerNamePlaceholder} onChange={(v) => update('footerNamePlaceholder', v)} />
              <Field label="Placeholder телефона" value={content.footerPhonePlaceholder} onChange={(v) => update('footerPhonePlaceholder', v)} />
              <Field label="Текст «Согласен на обработку...»" value={content.footerConsentPersonalLabel} onChange={(v) => update('footerConsentPersonalLabel', v)} />
              <Field label="Текст «Ознакомлен с» перед ссылкой" value={content.footerConsentAgreementLead} onChange={(v) => update('footerConsentAgreementLead', v)} />
              <Field label="Текст ссылки на соглашение" value={content.footerConsentAgreementLinkLabel} onChange={(v) => update('footerConsentAgreementLinkLabel', v)} />
              <Field label="Текст кнопки «Отправить»" value={content.footerSubmitLabel} onChange={(v) => update('footerSubmitLabel', v)} />
              <Field label="Текст во время отправки" value={content.footerSubmittingLabel} onChange={(v) => update('footerSubmittingLabel', v)} />
              <Field label="Копирайт (© 2024–2026 ...)" value={content.footerCopyright} onChange={(v) => update('footerCopyright', v)} />
              <Field label="Текст ссылки «Контакты»" value={content.footerContactsLinkLabel} onChange={(v) => update('footerContactsLinkLabel', v)} />
            </Section>
          )}

          {activeTab === 8 && (
            <Section title="Модалка «Обратная связь»">
              <Field label="Заголовок" value={content.feedbackTitle} onChange={(v) => update('feedbackTitle', v)} />
              <Field label="Подзаголовок" value={content.feedbackLead} onChange={(v) => update('feedbackLead', v)} />
              <Field label="Заголовок при успехе" value={content.feedbackSuccessTitle} onChange={(v) => update('feedbackSuccessTitle', v)} />
              <Field label="Сообщение при успехе" value={content.feedbackSuccessMessage} onChange={(v) => update('feedbackSuccessMessage', v)} />
              <Field label="Placeholder имени" value={content.feedbackNamePlaceholder} onChange={(v) => update('feedbackNamePlaceholder', v)} />
              <Field label="Placeholder телефона" value={content.feedbackPhonePlaceholder} onChange={(v) => update('feedbackPhonePlaceholder', v)} />
              <Field label="Placeholder комментария" value={content.feedbackCommentPlaceholder} onChange={(v) => update('feedbackCommentPlaceholder', v)} />
              <Field label="Текст «Согласен на обработку...»" value={content.feedbackConsentPersonalLabel} onChange={(v) => update('feedbackConsentPersonalLabel', v)} />
              <Field label="Текст «Ознакомлен с» перед ссылкой" value={content.feedbackConsentAgreementLead} onChange={(v) => update('feedbackConsentAgreementLead', v)} />
              <Field label="Текст ссылки на соглашение" value={content.feedbackConsentAgreementLinkLabel} onChange={(v) => update('feedbackConsentAgreementLinkLabel', v)} />
              <Field label="Текст кнопки «Отправить»" value={content.feedbackSubmitLabel} onChange={(v) => update('feedbackSubmitLabel', v)} />
              <Field label="Текст во время отправки" value={content.feedbackSubmittingLabel} onChange={(v) => update('feedbackSubmittingLabel', v)} />
            </Section>
          )}

          {activeTab < 9 && (
            <>
              {error && <p className="text-sm text-red-400">{error}</p>}
              {success && <p className="text-sm text-green-400">{success}</p>}
              <button type="submit" className="btn-primary" disabled={isBusy}>
                {isBusy ? 'Сохранение...' : 'Сохранить'}
              </button>
            </>
          )}
        </form>

        {activeTab === 9 && (
          <ProductsTab
            products={products}
            onProductsChange={setProducts}
            onSave={async () => {
              setIsBusy(true)
              setError('')
              setSuccess('')
              try {
                await saveProducts(products)
                setSuccess('Товары сохранены.')
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Ошибка сохранения')
              } finally {
                setIsBusy(false)
              }
            }}
            isBusy={isBusy}
            error={error}
            success={success}
            onUpload={uploadFile}
          />
        )}
        {activeTab === 10 && (
          <ExportImportTab
            onExport={exportData}
            onImport={importData}
            onSeedFromCatalog={async () => {
              setIsBusy(true)
              setError('')
              setSuccess('')
              try {
                await importData({ products: { discs: DISCS, crowns: CROWNS } })
                setSuccess('Каталог импортирован из встроенных данных.')
                loadProducts()
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Ошибка импорта')
              } finally {
                setIsBusy(false)
              }
            }}
            isBusy={isBusy}
            error={error}
            success={success}
          />
        )}
      </div>
    </main>
  )
}
