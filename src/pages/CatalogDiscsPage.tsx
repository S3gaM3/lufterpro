import { SITE } from '@/constants/site'
import { CatalogPageLayout } from '@/components/CatalogPageLayout'
import { useProducts } from '@/hooks/useProducts'

export function CatalogDiscsPage() {
  const { discs, isLoading } = useProducts()
  return (
    <CatalogPageLayout
      type="discs"
      title="Каталог алмазных дисков"
      subtitle="Сегментные, сплошные и турбо диски для резки бетона, керамики, гранита"
      breadcrumb="Алмазные диски"
      cardPathBase="/katalog-diskov"
      fallbackImage={SITE.imgDiscs}
      items={discs}
      isLoading={isLoading}
      showLineFilter
      seoPath={SITE.catalogDiscs}
    />
  )
}
