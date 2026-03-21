import { DISCS } from '@/data/catalog'
import { SITE } from '@/constants/site'
import { CatalogPageLayout } from '@/components/CatalogPageLayout'

export function CatalogDiscsPage() {
  return (
    <CatalogPageLayout
      type="discs"
      title="Каталог алмазных дисков"
      subtitle="Сегментные, сплошные и турбо диски для резки бетона, керамики, гранита"
      breadcrumb="Алмазные диски"
      cardPathBase="/katalog-diskov"
      fallbackImage={SITE.imgDiscs}
      items={DISCS}
      showLineFilter
      seoPath={SITE.catalogDiscs}
    />
  )
}
