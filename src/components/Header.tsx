import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SITE } from '@/constants/site'
import type { SiteEditableContent } from '@/types/content'

interface HeaderProps {
  onFeedbackClick: () => void
  content: Pick<
    SiteEditableContent,
    | 'headerMenuDiscsLabel'
    | 'headerMenuCrownsLabel'
    | 'headerMenuContactsLabel'
    | 'headerFeedbackButtonLabel'
    | 'mobileMenuAriaLabel'
  >
}

export function Header({ onFeedbackClick, content }: HeaderProps) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 glass border-b border-border">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="app-link-reset shrink-0 flex items-center gap-3 group">
            <img
              src={SITE.logo}
              alt="LUFTER"
              className="h-8 sm:h-10 w-auto object-contain logo-theme group-hover:opacity-100 transition-opacity"
              width={160}
              height={48}
            />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              to={SITE.catalogDiscs}
              className="app-link px-4 py-2 rounded-lg hover:bg-overlay-hover transition-all text-sm font-medium"
            >
              {content.headerMenuDiscsLabel}
            </Link>
            <Link
              to={SITE.catalogCrowns}
              className="app-link px-4 py-2 rounded-lg hover:bg-overlay-hover transition-all text-sm font-medium"
            >
              {content.headerMenuCrownsLabel}
            </Link>
            <a
              href="/#contacts"
              className="app-link px-4 py-2 rounded-lg hover:bg-overlay-hover transition-all text-sm font-medium"
            >
              {content.headerMenuContactsLabel}
            </a>
            <button
              type="button"
              onClick={onFeedbackClick}
              className="ml-4 btn-primary text-sm py-2.5 px-5"
            >
              {content.headerFeedbackButtonLabel}
            </button>
          </nav>

          <button
            type="button"
            className="md:hidden p-2 -mr-2 rounded-lg text-muted-light hover:text-fg hover:bg-overlay-hover"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={content.mobileMenuAriaLabel}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t border-border"
            >
              <nav className="py-4 flex flex-col gap-1">
                <Link
                  to={SITE.catalogDiscs}
                  className="app-link px-4 py-3 rounded-lg hover:bg-overlay-hover"
                  onClick={() => setOpen(false)}
                >
                  {content.headerMenuDiscsLabel}
                </Link>
                <Link
                  to={SITE.catalogCrowns}
                  className="app-link px-4 py-3 rounded-lg hover:bg-overlay-hover"
                  onClick={() => setOpen(false)}
                >
                  {content.headerMenuCrownsLabel}
                </Link>
                <a
                  href="/#contacts"
                  className="app-link px-4 py-3 rounded-lg hover:bg-overlay-hover"
                  onClick={() => setOpen(false)}
                >
                  {content.headerMenuContactsLabel}
                </a>
                <button
                  type="button"
                  onClick={() => {
                    onFeedbackClick()
                    setOpen(false)
                  }}
                  className="mx-4 mt-2 btn-primary text-sm py-3"
                >
                  {content.headerFeedbackButtonLabel}
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
