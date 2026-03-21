export interface FeedbackFormData {
  name: string
  phone: string
  comment: string
  consentPersonal: boolean
  consentAgreement: boolean
}

export interface OrderFormData {
  name: string
  phone: string
}

/** Форма в подвале: без комментария */
export interface FooterLeadFormData {
  name: string
  phone: string
  consentPersonal: boolean
  consentAgreement: boolean
}

export interface FormErrors {
  name?: string
  phone?: string
  comment?: string
  consentPersonal?: string
  consentAgreement?: string
  form?: string
}

export class FormSubmitError extends Error {
  readonly code: 'NETWORK' | 'UNKNOWN'

  constructor(message: string, code: 'NETWORK' | 'UNKNOWN' = 'UNKNOWN') {
    super(message)
    this.name = 'FormSubmitError'
    this.code = code
  }
}
