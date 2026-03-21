import { motion } from 'framer-motion'
import { COPY, SITE } from '@/constants/site'
import type { SiteEditableContent } from '@/types/content'

interface HeroProps {
  onConsultClick: () => void
  heroTitle?: SiteEditableContent['heroTitle']
  heroLead?: SiteEditableContent['heroLead']
  consultButtonLabel?: SiteEditableContent['heroConsultButtonLabel']
  brochureButtonLabel?: SiteEditableContent['heroBrochureButtonLabel']
}

export function Hero({
  onConsultClick,
  heroTitle = COPY.heroTitle,
  heroLead = COPY.heroLead,
  consultButtonLabel = 'Получить консультацию',
  brochureButtonLabel = 'Скачать брошюру',
}: HeroProps) {
  const paragraphs = heroLead.split('\n').filter(Boolean)

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Баннер lyufter_fon: рабочий с болгаркой, искры, логотип LUFTER */}
      <picture className="absolute inset-0 z-0">
        <source media="(max-width: 639px)" srcSet={SITE.heroBannerMobile} />
        <img
          src={SITE.heroBanner}
          alt=""
          aria-hidden
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover"
        />
      </picture>
      {/* Края баннера в цвет фона страницы (#020202) — без резкого перехода */}
      <div className="hero-edge-fade" aria-hidden />
      {/* Затемнение в тон страницы: текст слева, логотип справа читается */}
      <div className="hero-readability-shade" aria-hidden />
      <div
        className="absolute inset-0 z-[3] bg-gradient-mesh opacity-30"
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-fg leading-[1.1] tracking-tight drop-shadow-lg"
          >
            {heroTitle}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 text-fg/85 text-lg md:text-xl leading-relaxed max-w-xl space-y-4 drop-shadow-md"
          >
            {paragraphs.map((p, i) => (
              <p key={i}>{p.trim()}</p>
            ))}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 flex flex-wrap gap-4"
          >
            <button type="button" onClick={onConsultClick} className="btn-primary">
              {consultButtonLabel}
            </button>
            <a
              href={SITE.brochure}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              {brochureButtonLabel}
            </a>
          </motion.div>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"
        aria-hidden
      />
    </section>
  )
}
