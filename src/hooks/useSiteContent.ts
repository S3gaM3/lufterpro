import { useEffect, useState } from 'react'
import { COPY } from '@/constants/site'
import { fetchPublicContent } from '@/services/contentApi'
import type { SiteEditableContent } from '@/types/content'

const fallbackContent: SiteEditableContent = {
  topBarAddressAriaLabel: 'Открыть адрес на карте',
  headerMenuDiscsLabel: 'Диски',
  headerMenuCrownsLabel: 'Коронки',
  headerMenuContactsLabel: 'Контакты',
  headerFeedbackButtonLabel: 'Обратная связь',
  mobileMenuAriaLabel: 'Меню',
  heroTitle: COPY.heroTitle,
  heroLead: COPY.heroLead,
  heroConsultButtonLabel: 'Получить консультацию',
  heroBrochureButtonLabel: 'Скачать брошюру',
  productsTitle: 'Предлагаем Вам',
  productsLead: 'Алмазные диски и коронки LUFTER для профессионалов',
  productsDiscsTitle: 'Алмазные диски',
  productsDiscsLinkLabel: 'Каталог дисков',
  productsCrownsTitle: 'Алмазные коронки',
  productsCrownsLinkLabel: 'Каталог коронок',
  orderTitle: 'Оформить заказ',
  orderLead: 'Наши операторы свяжутся с Вами в течение пяти минут',
  orderSuccessMessage: 'Спасибо! Форма отправлена',
  orderPhoneLabel: 'Телефон',
  orderNameLabel: 'Ваше имя',
  orderPhonePlaceholder: '+7 (___) ___-__-__',
  orderNamePlaceholder: 'Как к вам обращаться',
  orderSubmitLabel: 'Отправить заявку',
  orderSubmittingLabel: 'Отправка...',
  orderAgreementLead: 'Нажимая кнопку, вы соглашаетесь с',
  orderAgreementLinkLabel: 'политикой конфиденциальности',
  aboutTitle: COPY.aboutTitle,
  aboutText: COPY.aboutText,
  aboutImageAlt: 'LUFTER — производство и инструмент',
  featuresTitle: 'Почему LUFTER',
  featuresLead: 'Надёжность, качество и выгодные условия',
  mapTitle: 'LUFTER — Москва, Варшавское шоссе, 148',
  footerContactsTitle: 'Контакты',
  footerFormTitle: 'Остались вопросы?',
  footerFormLead: 'Отправьте заявку — мы перезвоним',
  footerSuccessMessage: 'Спасибо! Форма отправлена',
  footerNamePlaceholder: 'Ваше имя *',
  footerPhonePlaceholder: 'Телефон *',
  footerConsentPersonalLabel: 'Согласен на обработку персональных данных *',
  footerConsentAgreementLead: 'Ознакомлен с',
  footerConsentAgreementLinkLabel: 'соглашением',
  footerSubmitLabel: 'Отправить заявку',
  footerSubmittingLabel: 'Отправка...',
  footerCopyright: '© 2024–2026 ООО «ВЕРТЕКС ИНСТРУМЕНТ»',
  footerContactsLinkLabel: 'Контакты',
  feedbackTitle: 'Обратная связь',
  feedbackLead: 'Оставьте заявку — наши специалисты перезвонят вам',
  feedbackSuccessTitle: 'Спасибо!',
  feedbackSuccessMessage: 'Форма отправлена. Мы свяжемся с вами скоро.',
  feedbackNamePlaceholder: 'Ваше имя *',
  feedbackPhonePlaceholder: 'Телефон *',
  feedbackCommentPlaceholder: 'Комментарий *',
  feedbackConsentPersonalLabel: 'Согласен на обработку персональных данных *',
  feedbackConsentAgreementLead: 'Ознакомлен с',
  feedbackConsentAgreementLinkLabel: 'соглашением',
  feedbackSubmitLabel: 'Отправить заявку',
  feedbackSubmittingLabel: 'Отправка...',
  features: [...COPY.features],
}

export function useSiteContent() {
  const [content, setContent] = useState<SiteEditableContent>(fallbackContent)

  useEffect(() => {
    let active = true

    fetchPublicContent()
      .then((data) => {
        if (active) {
          setContent(data)
        }
      })
      .catch(() => {
        // Если API недоступен, оставляем существующие локальные константы.
      })

    return () => {
      active = false
    }
  }, [])

  return content
}
