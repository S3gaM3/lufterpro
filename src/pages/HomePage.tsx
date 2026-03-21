import { Hero } from '@/components/Hero'
import { Products } from '@/components/Products'
import { OrderSection } from '@/components/OrderSection'
import { AboutUs } from '@/components/AboutUs'
import { Features } from '@/components/Features'
import { MapSection } from '@/components/MapSection'
import { useOrderForm } from '@/hooks/useOrderForm'
import { usePageSeo } from '@/seo/usePageSeo'
import type { SiteEditableContent } from '@/types/content'

interface HomePageProps {
  onConsultClick: () => void
  content: SiteEditableContent
}

export function HomePage({ onConsultClick, content }: HomePageProps) {
  const orderForm = useOrderForm()
  usePageSeo({
    title: 'Профессиональный инструмент LUFTER в Москве',
    description:
      'Алмазные диски и коронки LUFTER: каталог профессионального инструмента, консультация и заказ в Москве.',
    path: '/',
  })

  return (
    <main className="flex-1">
      <Hero
        onConsultClick={onConsultClick}
        heroTitle={content.heroTitle}
        heroLead={content.heroLead}
        consultButtonLabel={content.heroConsultButtonLabel}
        brochureButtonLabel={content.heroBrochureButtonLabel}
      />
      <Products
        title={content.productsTitle}
        lead={content.productsLead}
        discsTitle={content.productsDiscsTitle}
        discsLinkLabel={content.productsDiscsLinkLabel}
        crownsTitle={content.productsCrownsTitle}
        crownsLinkLabel={content.productsCrownsLinkLabel}
      />
      <OrderSection
        orderData={orderForm.data}
        orderErrors={orderForm.errors}
        isOrderSubmitting={orderForm.isSubmitting}
        isOrderSuccess={orderForm.isSuccess}
        onOrderFieldChange={orderForm.updateField}
        onOrderSubmit={orderForm.submit}
        content={content}
      />
      <AboutUs aboutTitle={content.aboutTitle} aboutText={content.aboutText} aboutImageAlt={content.aboutImageAlt} />
      <Features features={content.features} title={content.featuresTitle} lead={content.featuresLead} />
      <MapSection title={content.mapTitle} />
    </main>
  )
}
