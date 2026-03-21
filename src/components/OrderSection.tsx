import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { OrderFormData, FormErrors } from '@/types/form'
import { SITE } from '@/constants/site'
import type { SiteEditableContent } from '@/types/content'

interface OrderSectionProps {
  orderData: OrderFormData
  orderErrors: FormErrors
  isOrderSubmitting: boolean
  isOrderSuccess: boolean
  onOrderFieldChange: <K extends keyof OrderFormData>(field: K, value: OrderFormData[K]) => void
  onOrderSubmit: () => void
  content: Pick<
    SiteEditableContent,
    | 'orderTitle'
    | 'orderLead'
    | 'orderSuccessMessage'
    | 'orderPhoneLabel'
    | 'orderNameLabel'
    | 'orderPhonePlaceholder'
    | 'orderNamePlaceholder'
    | 'orderSubmitLabel'
    | 'orderSubmittingLabel'
    | 'orderAgreementLead'
    | 'orderAgreementLinkLabel'
  >
}

const inputClass =
  'w-full bg-overlay border border-border rounded-xl px-4 py-3.5 text-fg placeholder-muted outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all'

export function OrderSection({
  orderData,
  orderErrors,
  isOrderSubmitting,
  isOrderSuccess,
  onOrderFieldChange,
  onOrderSubmit,
  content,
}: OrderSectionProps) {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden" aria-labelledby="order-section-heading">
      {/* Фото склада / фона только для этого блока */}
      <img
        src={SITE.orderSectionBackground}
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/55 to-black/65"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-mesh opacity-25" aria-hidden />

      <div className="relative z-10 max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card max-w-xl mx-auto"
        >
          <h2
            id="order-section-heading"
            className="font-display font-bold text-2xl md:text-3xl text-fg"
          >
            {content.orderTitle}
          </h2>
          <p className="mt-3 text-muted-light">
            {content.orderLead}
          </p>

          {isOrderSuccess ? (
            <motion.p
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-8 text-accent font-semibold text-lg"
            >
              {content.orderSuccessMessage}
            </motion.p>
          ) : (
            <form
              className="mt-8 space-y-5"
              onSubmit={(e) => {
                e.preventDefault()
                onOrderSubmit()
              }}
            >
              <div>
                <label htmlFor="order-phone-os" className="block text-sm font-medium text-muted-light mb-1.5">
                  {content.orderPhoneLabel} <span className="text-accent">*</span>
                </label>
                <input
                  id="order-phone-os"
                  type="tel"
                  placeholder={content.orderPhonePlaceholder}
                  value={orderData.phone}
                  onChange={(e) => onOrderFieldChange('phone', e.target.value)}
                  className={inputClass}
                />
                {orderErrors.phone && (
                  <p className="mt-1.5 text-sm text-red-400">{orderErrors.phone}</p>
                )}
              </div>
              <div>
                <label htmlFor="order-name-os" className="block text-sm font-medium text-muted-light mb-1.5">
                  {content.orderNameLabel}
                </label>
                <input
                  id="order-name-os"
                  type="text"
                  placeholder={content.orderNamePlaceholder}
                  value={orderData.name}
                  onChange={(e) => onOrderFieldChange('name', e.target.value)}
                  className={inputClass}
                />
              </div>
              {orderErrors.form && (
                <p className="mt-1.5 text-sm text-red-400">{orderErrors.form}</p>
              )}
              <button
                type="submit"
                disabled={isOrderSubmitting}
                className="w-full btn-primary py-4 disabled:opacity-50"
              >
                {isOrderSubmitting ? content.orderSubmittingLabel : content.orderSubmitLabel}
              </button>
              <p className="text-xs text-muted text-center">
                {content.orderAgreementLead}{' '}
                <Link to={SITE.agreement} className="app-link underline-hover">
                  {content.orderAgreementLinkLabel}
                </Link>
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
