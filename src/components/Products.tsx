import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SITE } from '@/constants/site'
import type { SiteEditableContent } from '@/types/content'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

interface ProductsProps {
  title: SiteEditableContent['productsTitle']
  lead: SiteEditableContent['productsLead']
  discsTitle: SiteEditableContent['productsDiscsTitle']
  discsLinkLabel: SiteEditableContent['productsDiscsLinkLabel']
  crownsTitle: SiteEditableContent['productsCrownsTitle']
  crownsLinkLabel: SiteEditableContent['productsCrownsLinkLabel']
}

export function Products({
  title,
  lead,
  discsTitle,
  discsLinkLabel,
  crownsTitle,
  crownsLinkLabel,
}: ProductsProps) {
  return (
    <section className="py-20 lg:py-28 relative">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mb-16"
        >
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-fg">
            {title}
          </h2>
          <p className="mt-4 text-muted-light text-lg max-w-xl">
            {lead}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-2 gap-6 lg:gap-8"
        >
          <motion.article variants={item}>
            <Link
              to="/katalog-diskov"
              className="group block card glass-hover overflow-hidden h-full no-underline"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                <img
                  src={SITE.imgDiscs}
                  alt="Алмазные диски"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-60"
                  aria-hidden
                />
              </div>
              <div className="mt-6">
                <h3 className="font-display font-semibold text-xl lg:text-2xl app-link-face">
                  {discsTitle}
                </h3>
                <span className="inline-flex items-center gap-2 mt-2 text-sm font-medium">
                  <span className="app-link-face">{discsLinkLabel}</span>
                  <svg className="w-4 h-4 text-accent transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </Link>
          </motion.article>

          <motion.article variants={item}>
            <Link
              to="/almaznye-koronki"
              className="group block card glass-hover overflow-hidden h-full no-underline"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                <img
                  src={SITE.imgCrowns}
                  alt="Алмазные коронки"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-60"
                  aria-hidden
                />
              </div>
              <div className="mt-6">
                <h3 className="font-display font-semibold text-xl lg:text-2xl app-link-face">
                  {crownsTitle}
                </h3>
                <span className="inline-flex items-center gap-2 mt-2 text-sm font-medium">
                  <span className="app-link-face">{crownsLinkLabel}</span>
                  <svg className="w-4 h-4 text-accent transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </Link>
          </motion.article>
        </motion.div>
      </div>
    </section>
  )
}
