import { motion } from 'framer-motion'
import { SITE } from '@/constants/site'
import { IconPhone, IconPin } from '@/components/icons/SiteIcons'
import type { SiteEditableContent } from '@/types/content'

interface TopBarProps {
  addressAriaLabel?: SiteEditableContent['topBarAddressAriaLabel']
}

export function TopBar({ addressAriaLabel = 'Открыть адрес на карте' }: TopBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="border-b border-border bg-bg/80 backdrop-blur-md"
    >
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-muted-light">
          <a
            href={SITE.phoneTel}
            className="app-link flex items-center gap-2"
          >
            <IconPhone className="w-4 h-4 text-accent/80" />
            <span>{SITE.phoneDisplay}</span>
          </a>
          <span className="hidden sm:inline text-border">|</span>
          <a
            href={SITE.addressMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="app-link flex items-center gap-2"
            aria-label={addressAriaLabel}
          >
            <IconPin className="w-4 h-4 text-accent/80 shrink-0" />
            <span>{SITE.address}</span>
          </a>
        </div>
      </div>
    </motion.div>
  )
}
