import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useMemo } from 'react'
import type { CatalogItem } from '@/data/catalog'
import { useCatalogFilters, type CatalogType } from '@/hooks/useCatalogFilters'
import { CatalogToolbar } from '@/components/CatalogToolbar'
import { ProductCard } from '@/components/ProductCard'
import { usePageSeo } from '@/seo/usePageSeo'
import { useJsonLd } from '@/seo/useJsonLd'
import { SITE } from '@/constants/site'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
}

interface CatalogPageLayoutProps {
  type: CatalogType
  title: string
  subtitle: string
  breadcrumb: string
  cardPathBase: string
  fallbackImage: string
  items: CatalogItem[]
  showLineFilter?: boolean
  seoPath: string
}

export function CatalogPageLayout({
  type,
  title,
  subtitle,
  breadcrumb,
  cardPathBase,
  fallbackImage,
  items,
  showLineFilter = false,
  seoPath,
}: CatalogPageLayoutProps) {
  const { state, updateFilter, paginated, totalPages, filtered, lines, diameters, resetFilters } =
    useCatalogFilters(items, type)

  usePageSeo({
    title: `${title} | LUFTER`,
    description: subtitle,
    path: seoPath,
  })
  const breadcrumbJsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: SITE.baseUrl },
        { '@type': 'ListItem', position: 2, name: breadcrumb, item: `${SITE.baseUrl}${seoPath}` },
      ],
    }),
    [breadcrumb, seoPath]
  )
  useJsonLd(`breadcrumb-${type}`, breadcrumbJsonLd)

  return (
    <main className="flex-1 py-16 lg:py-24">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-10 flex items-center gap-2 text-sm text-muted-light"
        >
          <Link to="/" className="app-link">
            Главная
          </Link>
          <span>/</span>
          <span className="text-fg">{breadcrumb}</span>
        </motion.nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-fg">{title}</h1>
          <p className="mt-4 text-muted-light text-lg max-w-2xl">{subtitle}</p>
        </motion.div>

        <CatalogToolbar
          state={state}
          onSearchChange={(v) => updateFilter('search', v)}
          onLineChange={(v) => updateFilter('line', v)}
          onDiameterChange={(v) => updateFilter('diameter', v)}
          onPageChange={(p) => updateFilter('page', p)}
          totalPages={totalPages}
          totalItems={filtered.length}
          lines={lines}
          diameters={diameters}
          showLineFilter={showLineFilter}
          onReset={resetFilters}
        />

        {paginated.length > 0 ? (
          <motion.div variants={container} initial="hidden" animate="show" className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginated.map((product) => (
              <motion.div key={product.id} variants={item}>
                <ProductCard
                  product={product}
                  to={`${cardPathBase}/${product.id}`}
                  fallbackImage={fallbackImage}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-muted-light">По вашему запросу ничего не найдено.</p>
            <button type="button" onClick={resetFilters} className="app-link mt-4 underline-hover">
              Сбросить фильтры
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
