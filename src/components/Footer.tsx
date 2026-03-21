import { motion } from 'framer-motion'
import { SITE } from '@/constants/site'
import { IconPhone, IconPin } from '@/components/icons/SiteIcons'
import { useFooterLeadForm } from '@/hooks/useFooterLeadForm'
import { Link } from 'react-router-dom'
import type { SiteEditableContent } from '@/types/content'

const inputClass =
  'w-full bg-overlay border border-border rounded-xl px-4 py-3 text-fg placeholder-muted outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all'

interface FooterProps {
  content: Pick<
    SiteEditableContent,
    | 'footerContactsTitle'
    | 'footerFormTitle'
    | 'footerFormLead'
    | 'footerSuccessMessage'
    | 'footerNamePlaceholder'
    | 'footerPhonePlaceholder'
    | 'footerConsentPersonalLabel'
    | 'footerConsentAgreementLead'
    | 'footerConsentAgreementLinkLabel'
    | 'footerSubmitLabel'
    | 'footerSubmittingLabel'
    | 'footerCopyright'
    | 'footerContactsLinkLabel'
    | 'topBarAddressAriaLabel'
  >
}

export function Footer({ content }: FooterProps) {
  const { data, errors, isSubmitting, isSuccess, updateField, submit } = useFooterLeadForm()

  return (
    <footer id="contacts" className="relative mt-20">
      <div className="border-t border-border" />
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display font-bold text-2xl md:text-3xl text-fg mb-8">
              {content.footerContactsTitle}
            </h2>
            <div className="space-y-6">
              <a
                href={SITE.phoneTel}
                className="app-link flex items-center gap-4 text-lg"
              >
                <IconPhone className="w-6 h-6 text-accent shrink-0" />
                {SITE.phoneDisplay}
              </a>
              <a
                href={SITE.addressMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="app-link flex items-start gap-4"
                aria-label={content.topBarAddressAriaLabel}
              >
                <IconPin className="w-6 h-6 text-accent shrink-0 mt-0.5" />
                <span>{SITE.address}</span>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-display font-bold text-xl md:text-2xl text-fg mb-2">
              {content.footerFormTitle}
            </h3>
            <p className="text-muted-light mb-8">{content.footerFormLead}</p>

            {isSuccess ? (
              <p className="text-accent font-semibold">{content.footerSuccessMessage}</p>
            ) : (
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault()
                  submit()
                }}
              >
                <div>
                  <input
                    type="text"
                    placeholder={content.footerNamePlaceholder}
                    value={data.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className={inputClass}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder={content.footerPhonePlaceholder}
                    value={data.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className={inputClass}
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
                </div>
                <label className="flex items-start gap-3 cursor-pointer text-sm text-muted-light">
                  <input
                    type="checkbox"
                    checked={data.consentPersonal}
                    onChange={(e) => updateField('consentPersonal', e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-border bg-overlay text-accent"
                  />
                  <span>{content.footerConsentPersonalLabel}</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer text-sm text-muted-light">
                  <input
                    type="checkbox"
                    checked={data.consentAgreement}
                    onChange={(e) => updateField('consentAgreement', e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-border bg-overlay text-accent"
                  />
                  <span>
                    {content.footerConsentAgreementLead}{' '}
                    <Link to={SITE.agreement} className="app-link underline-hover">
                      {content.footerConsentAgreementLinkLabel}
                    </Link>
                  </span>
                </label>
                {(errors.consentPersonal || errors.consentAgreement) && (
                  <p className="text-sm text-red-400">{errors.consentPersonal || errors.consentAgreement}</p>
                )}
                {errors.form && <p className="text-sm text-red-400">{errors.form}</p>}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary py-3.5 px-6 disabled:opacity-50"
                >
                  {isSubmitting ? content.footerSubmittingLabel : content.footerSubmitLabel}
                </button>
              </form>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted"
        >
          <p>{content.footerCopyright}</p>
          <a href="/#contacts" className="app-link">
            {content.footerContactsLinkLabel}
          </a>
        </motion.div>
      </div>
    </footer>
  )
}
