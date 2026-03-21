import { motion } from 'framer-motion'
import { SITE } from '@/constants/site'
import type { SiteEditableContent } from '@/types/content'

interface MapSectionProps {
  title?: SiteEditableContent['mapTitle']
}

export function MapSection({ title = 'LUFTER — Москва, Варшавское шоссе, 148' }: MapSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-0 px-4 sm:px-6 lg:px-8"
    >
      <div className="relative w-full aspect-[21/9] min-h-[280px] md:min-h-[360px] lg:min-h-[420px] overflow-hidden rounded-2xl max-w-site mx-auto border border-border bg-surface-elevated">
        {/*
          iframe с absolute inset-0: иначе height:100% у iframe часто даёт 0px внутри блока с aspect-ratio.
          Без оверлея поверх — карта нормально перетаскивается и зумится.
        */}
        <iframe
          title={title}
          src={SITE.mapEmbed}
          className="absolute inset-0 h-full w-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </motion.section>
  )
}
