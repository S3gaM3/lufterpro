import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { FeedbackFormData, FormErrors } from '@/types/form'
import { SITE } from '@/constants/site'
import type { SiteEditableContent } from '@/types/content'

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  data: FeedbackFormData
  errors: FormErrors
  isSubmitting: boolean
  isSuccess: boolean
  onFieldChange: <K extends keyof FeedbackFormData>(field: K, value: FeedbackFormData[K]) => void
  onSubmit: () => void
  onReset: () => void
  content: Pick<
    SiteEditableContent,
    | 'feedbackTitle'
    | 'feedbackLead'
    | 'feedbackSuccessTitle'
    | 'feedbackSuccessMessage'
    | 'feedbackNamePlaceholder'
    | 'feedbackPhonePlaceholder'
    | 'feedbackCommentPlaceholder'
    | 'feedbackConsentPersonalLabel'
    | 'feedbackConsentAgreementLead'
    | 'feedbackConsentAgreementLinkLabel'
    | 'feedbackSubmitLabel'
    | 'feedbackSubmittingLabel'
  >
}

const fieldClass =
  'w-full bg-overlay border border-border rounded-xl px-4 py-3 text-fg placeholder-muted outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all'

export function FeedbackModal({
  isOpen,
  onClose,
  data,
  errors,
  isSubmitting,
  isSuccess,
  onFieldChange,
  onSubmit,
  onReset,
  content,
}: FeedbackModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleClose = () => {
    onClose()
    if (isSuccess) onReset()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={handleClose}
          aria-hidden
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25 }}
          className="relative w-full max-w-lg glass rounded-2xl shadow-glow overflow-hidden"
        >
          <div className="p-6 lg:p-8">
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-5 right-5 p-2 rounded-lg text-muted hover:text-fg hover:bg-overlay-hover transition-colors"
              aria-label="Закрыть"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {isSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="font-display font-bold text-xl text-fg mb-2">{content.feedbackSuccessTitle}</h2>
                <p className="text-muted-light">{content.feedbackSuccessMessage}</p>
              </div>
            ) : (
              <>
                <h2 className="font-display font-bold text-xl md:text-2xl text-fg mb-2">
                  {content.feedbackTitle}
                </h2>
                <p className="text-muted-light text-sm mb-6">
                  {content.feedbackLead}
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    onSubmit()
                  }}
                  className="space-y-4"
                >
                  <div>
                    <input
                      type="text"
                      placeholder={content.feedbackNamePlaceholder}
                      value={data.name}
                      onChange={(e) => onFieldChange('name', e.target.value)}
                      className={fieldClass}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder={content.feedbackPhonePlaceholder}
                      value={data.phone}
                      onChange={(e) => onFieldChange('phone', e.target.value)}
                      className={fieldClass}
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
                  </div>
                  <div>
                    <textarea
                      placeholder={content.feedbackCommentPlaceholder}
                      value={data.comment}
                      onChange={(e) => onFieldChange('comment', e.target.value)}
                      rows={3}
                      className={`${fieldClass} resize-none min-h-[80px]`}
                    />
                    {errors.comment && <p className="mt-1 text-sm text-red-400">{errors.comment}</p>}
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer text-sm text-muted-light">
                      <input
                        type="checkbox"
                        checked={data.consentPersonal}
                        onChange={(e) => onFieldChange('consentPersonal', e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-border bg-overlay text-accent"
                      />
                      <span>{content.feedbackConsentPersonalLabel}</span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer text-sm text-muted-light">
                      <input
                        type="checkbox"
                        checked={data.consentAgreement}
                        onChange={(e) => onFieldChange('consentAgreement', e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-border bg-overlay text-accent"
                      />
                      <span>
                        {content.feedbackConsentAgreementLead}{' '}
                        <a href={SITE.agreement} className="app-link underline-hover">
                          {content.feedbackConsentAgreementLinkLabel}
                        </a>
                      </span>
                    </label>
                  </div>
                  {(errors.consentPersonal || errors.consentAgreement) && (
                    <p className="text-sm text-red-400">{errors.consentPersonal || errors.consentAgreement}</p>
                  )}
                  {errors.form && <p className="text-sm text-red-400">{errors.form}</p>}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary py-4 mt-2 disabled:opacity-50"
                  >
                    {isSubmitting ? content.feedbackSubmittingLabel : content.feedbackSubmitLabel}
                  </button>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
