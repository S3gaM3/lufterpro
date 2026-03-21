import { CROWNS } from '@/data/catalog'
import { SITE } from '@/constants/site'
import { CatalogPageLayout } from '@/components/CatalogPageLayout'

export function CatalogCrownsPage() {
  return (
    <CatalogPageLayout
      type="crowns"
      title="Каталог алмазных коронок"
      subtitle="Для сверления отверстий в бетоне, кирпиче, природном камне"
      breadcrumb="Алмазные коронки"
      cardPathBase="/almaznye-koronki"
      fallbackImage={SITE.imgCrowns}
      items={CROWNS}
      seoPath={SITE.catalogCrowns}
    />
  )
}
