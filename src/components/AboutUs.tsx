import { motion } from 'framer-motion'
import { COPY, SITE } from '@/constants/site'
import type { SiteEditableContent } from '@/types/content'

interface AboutUsProps {
  aboutTitle?: SiteEditableContent['aboutTitle']
  aboutText?: SiteEditableContent['aboutText']
  aboutImageAlt?: SiteEditableContent['aboutImageAlt']
}

export function AboutUs({
  aboutTitle = COPY.aboutTitle,
  aboutText = COPY.aboutText,
  aboutImageAlt = 'LUFTER — производство и инструмент',
}: AboutUsProps) {
  const blocks = aboutText.split('\n').filter(Boolean)

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col"
          >
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-fg leading-tight">
              {aboutTitle}
            </h2>
            <div className="mt-8 space-y-6 text-muted-light text-lg leading-relaxed">
              {blocks.map((block, i) => (
                <p key={i}>{block.trim()}</p>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative min-h-[280px] lg:min-h-[360px] rounded-2xl overflow-hidden border border-border bg-surface-elevated"
          >
            <img
              src={SITE.aboutPhoto}
              alt={aboutImageAlt}
              className="absolute inset-0 w-full h-full object-cover object-center"
              loading="lazy"
              decoding="async"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-bg/40 via-transparent to-transparent pointer-events-none"
              aria-hidden
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
