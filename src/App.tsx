import { Suspense, lazy, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ScrollToTop } from '@/components/ScrollToTop'
import { TopBar } from '@/components/TopBar'
import { Header } from '@/components/Header'
import { FeedbackModal } from '@/components/FeedbackModal'
import { Footer } from '@/components/Footer'
import { useFeedbackForm } from '@/hooks/useFeedbackForm'
import { SeoDefaults } from '@/seo/SeoDefaults'
import { useSiteContent } from '@/hooks/useSiteContent'

const HomePage = lazy(() =>
  import('@/pages/HomePage').then((module) => ({ default: module.HomePage }))
)
const CatalogDiscsPage = lazy(() =>
  import('@/pages/CatalogDiscsPage').then((module) => ({ default: module.CatalogDiscsPage }))
)
const CatalogCrownsPage = lazy(() =>
  import('@/pages/CatalogCrownsPage').then((module) => ({ default: module.CatalogCrownsPage }))
)
const ProductDetailPage = lazy(() =>
  import('@/pages/ProductDetailPage').then((module) => ({ default: module.ProductDetailPage }))
)
const AgreementPage = lazy(() =>
  import('@/pages/AgreementPage').then((module) => ({ default: module.AgreementPage }))
)
const AdminPage = lazy(() =>
  import('@/pages/AdminPage').then((module) => ({ default: module.AdminPage }))
)

function App() {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const content = useSiteContent()

  const feedbackForm = useFeedbackForm(() => {
    setTimeout(() => setIsFeedbackOpen(false), 2000)
  })

  const openFeedback = () => {
    feedbackForm.reset()
    setIsFeedbackOpen(true)
  }

  return (
    <BrowserRouter>
      <SeoDefaults />
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-wall">
        <TopBar addressAriaLabel={content.topBarAddressAriaLabel} />
        <Header onFeedbackClick={openFeedback} content={content} />
        <Suspense fallback={<main className="flex-1 py-24 text-center text-muted-light">Загрузка...</main>}>
          <Routes>
            <Route path="/" element={<HomePage onConsultClick={openFeedback} content={content} />} />
            <Route path="/katalog-diskov" element={<CatalogDiscsPage />} />
            <Route path="/katalog-diskov/:id" element={<ProductDetailPage />} />
            <Route path="/almaznye-koronki" element={<CatalogCrownsPage />} />
            <Route path="/almaznye-koronki/:id" element={<ProductDetailPage />} />
            <Route path="/user/agreement" element={<AgreementPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </Suspense>
        <Footer content={content} />

        <FeedbackModal
          isOpen={isFeedbackOpen}
          onClose={() => setIsFeedbackOpen(false)}
          data={feedbackForm.data}
          errors={feedbackForm.errors}
          isSubmitting={feedbackForm.isSubmitting}
          isSuccess={feedbackForm.isSuccess}
          onFieldChange={feedbackForm.updateField}
          onSubmit={feedbackForm.submit}
          onReset={feedbackForm.reset}
          content={content}
        />
      </div>
    </BrowserRouter>
  )
}

export default App
