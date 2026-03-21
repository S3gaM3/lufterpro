import {
  FormSubmitError,
  type FeedbackFormData,
  type FooterLeadFormData,
  type OrderFormData,
} from '@/types/form'

async function emulateRequest(payload: unknown): Promise<void> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))
    void payload
  } catch {
    throw new FormSubmitError('Ошибка сети при отправке формы', 'NETWORK')
  }
}

export async function submitFeedbackForm(data: FeedbackFormData): Promise<void> {
  return emulateRequest(data)
}

export async function submitOrderForm(data: OrderFormData): Promise<void> {
  return emulateRequest(data)
}

export async function submitFooterLeadForm(data: FooterLeadFormData): Promise<void> {
  return emulateRequest(data)
}
