import { motion } from 'framer-motion'
import { COPY, SITE } from '@/constants/site'
import type { SiteEditableContent } from '@/types/content'

const iconSrc = {
  warehouse: SITE.iconWarehouse,
  quality: SITE.iconQuality,
  price: SITE.iconPrice,
} as const

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}

interface FeaturesProps {
  features?: ReadonlyArray<SiteEditableContent['features'][number]>
  title?: SiteEditableContent['featuresTitle']
  lead?: SiteEditableContent['featuresLead']
}

export function Features({
  features = COPY.features,
  title = 'Почему LUFTER',
  lead = 'Надёжность, качество и выгодные условия',
}: FeaturesProps) {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-fg">
            {title}
          </h2>
          <p className="mt-3 text-muted-light text-lg">
            {lead}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 lg:gap-8"
        >
          {features.map((f) => (
            <motion.article
              key={f.title}
              variants={item}
              className="card glass-hover group"
            >
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <img
                  src={iconSrc[f.iconKey]}
                  alt=""
                  className="w-8 h-8 object-contain brightness-0 invert opacity-80"
                />
              </div>
              <h3 className="font-display font-semibold text-xl text-fg mb-2">
                {f.title}
              </h3>
              <p className="text-muted-light leading-relaxed">{f.text}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
