import { useState, useCallback } from 'react'
import { FormSubmitError, type FeedbackFormData, type FormErrors } from '@/types/form'
import { submitFeedbackForm } from '@/services/formService'
import { hasErrors, validatePhone, validateRequired } from '@/lib/formValidation'

function validateFeedbackForm(data: FeedbackFormData): FormErrors {
  const errors: FormErrors = {}
  errors.name = validateRequired(data.name)
  errors.phone = validatePhone(data.phone)
  errors.comment = validateRequired(data.comment)
  if (!data.consentPersonal) errors.consentPersonal = 'Необходимо согласие'
  if (!data.consentAgreement) errors.consentAgreement = 'Необходимо согласие'
  return errors
}

export function useFeedbackForm(onSuccess?: () => void) {
  const [data, setData] = useState<FeedbackFormData>({
    name: '',
    phone: '',
    comment: '',
    consentPersonal: false,
    consentAgreement: false,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const updateField = useCallback(<K extends keyof FeedbackFormData>(
    field: K,
    value: FeedbackFormData[K]
  ) => {
    setData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }, [errors])

  const submit = useCallback(async () => {
    const formErrors = validateFeedbackForm(data)
    if (hasErrors(formErrors)) {
      setErrors(formErrors)
      return
    }
    setIsSubmitting(true)
    setErrors({})
    try {
      await submitFeedbackForm(data)
      setIsSuccess(true)
      setData({ name: '', phone: '', comment: '', consentPersonal: false, consentAgreement: false })
      onSuccess?.()
    } catch (error) {
      const fallback = 'Ошибка отправки. Попробуйте позже.'
      const message = error instanceof FormSubmitError ? error.message : fallback
      setErrors({ form: message || fallback })
    } finally {
      setIsSubmitting(false)
    }
  }, [data, onSuccess])

  const reset = useCallback(() => {
    setData({ name: '', phone: '', comment: '', consentPersonal: false, consentAgreement: false })
    setErrors({})
    setIsSuccess(false)
  }, [])

  return { data, errors, isSubmitting, isSuccess, updateField, submit, reset }
}
