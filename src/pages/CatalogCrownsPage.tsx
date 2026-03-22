import { SITE } from '@/constants/site'
import { CatalogPageLayout } from '@/components/CatalogPageLayout'
import { useProducts } from '@/hooks/useProducts'

export function CatalogCrownsPage() {
  const { crowns, isLoading } = useProducts()
  return (
    <CatalogPageLayout
      type="crowns"
      title="Каталог алмазных коронок"
      subtitle="Для сверления отверстий в бетоне, кирпиче, природном камне"
      breadcrumb="Алмазные коронки"
      cardPathBase="/almaznye-koronki"
      fallbackImage={SITE.imgCrowns}
      items={crowns}
      isLoading={isLoading}
      seoPath={SITE.catalogCrowns}
    />
  )
}
