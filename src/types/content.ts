export type FeatureIconKey = 'warehouse' | 'quality' | 'price'

export interface SiteFeature {
  title: string
  text: string
  iconKey: FeatureIconKey
}

export interface SiteEditableContent {
  topBarAddressAriaLabel: string
  headerMenuDiscsLabel: string
  headerMenuCrownsLabel: string
  headerMenuContactsLabel: string
  headerFeedbackButtonLabel: string
  mobileMenuAriaLabel: string
  heroTitle: string
  heroLead: string
  heroConsultButtonLabel: string
  heroBrochureButtonLabel: string
  productsTitle: string
  productsLead: string
  productsDiscsTitle: string
  productsDiscsLinkLabel: string
  productsCrownsTitle: string
  productsCrownsLinkLabel: string
  orderTitle: string
  orderLead: string
  orderSuccessMessage: string
  orderPhoneLabel: string
  orderNameLabel: string
  orderPhonePlaceholder: string
  orderNamePlaceholder: string
  orderSubmitLabel: string
  orderSubmittingLabel: string
  orderAgreementLead: string
  orderAgreementLinkLabel: string
  aboutTitle: string
  aboutText: string
  aboutImageAlt: string
  featuresTitle: string
  featuresLead: string
  mapTitle: string
  footerContactsTitle: string
  footerFormTitle: string
  footerFormLead: string
  footerSuccessMessage: string
  footerNamePlaceholder: string
  footerPhonePlaceholder: string
  footerConsentPersonalLabel: string
  footerConsentAgreementLead: string
  footerConsentAgreementLinkLabel: string
  footerSubmitLabel: string
  footerSubmittingLabel: string
  footerCopyright: string
  footerContactsLinkLabel: string
  feedbackTitle: string
  feedbackLead: string
  feedbackSuccessTitle: string
  feedbackSuccessMessage: string
  feedbackNamePlaceholder: string
  feedbackPhonePlaceholder: string
  feedbackCommentPlaceholder: string
  feedbackConsentPersonalLabel: string
  feedbackConsentAgreementLead: string
  feedbackConsentAgreementLinkLabel: string
  feedbackSubmitLabel: string
  feedbackSubmittingLabel: string
  features: SiteFeature[]
}
