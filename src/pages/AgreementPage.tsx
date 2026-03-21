import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePageSeo } from '@/seo/usePageSeo'

export function AgreementPage() {
  usePageSeo({
    title: 'Пользовательское соглашение | LUFTER',
    description: 'Условия использования сайта LUFTER и правила обработки персональных данных.',
    path: '/user/agreement',
  })

  return (
    <main className="flex-1 py-16 lg:py-24">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-10 flex items-center gap-2 text-sm text-muted-light"
        >
          <Link to="/" className="app-link">
            Главная
          </Link>
          <span>/</span>
          <span className="text-fg">Пользовательское соглашение</span>
        </motion.nav>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display font-bold text-2xl md:text-3xl text-fg mb-8">
            Пользовательское соглашение
          </h1>

          <div className="prose prose-invert max-w-none space-y-6 text-muted-light leading-relaxed">
            <p>
              Настоящее соглашение регулирует отношения между пользователем сайта и ООО «ВЕРТЕКС ИНСТРУМЕНТ»
              в отношении использования сервисов и контента сайта.
            </p>
            <p>
              Используя сайт, вы подтверждаете согласие с условиями настоящего соглашения.
            </p>
            <h2 className="font-display font-semibold text-fg text-lg mt-10 mb-4">1. Общие положения</h2>
            <p>Сайт предназначен для информирования о продукции LUFTER и приёма заявок.</p>
            <h2 className="font-display font-semibold text-fg text-lg mt-10 mb-4">2. Обработка данных</h2>
            <p>
              Отправляя заявку, вы даёте согласие на обработку персональных данных в целях связи с вами.
            </p>
            <h2 className="font-display font-semibold text-fg text-lg mt-10 mb-4">3. Контакты</h2>
            <p>
              <a href="tel:88005005851" className="app-link underline-hover">
                8(800)500-58-51
              </a>
              ,{' '}
              г. Москва, Варшавское шоссе, дом 148.
            </p>
          </div>
        </motion.article>
      </div>
    </main>
  )
}
