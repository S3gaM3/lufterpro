import { useState, useCallback } from 'react'
import { FormSubmitError, type FooterLeadFormData, type FormErrors } from '@/types/form'
import { submitFooterLeadForm } from '@/services/formService'
import { hasErrors, validatePhone, validateRequired } from '@/lib/formValidation'

function validate(data: FooterLeadFormData): FormErrors {
  const errors: FormErrors = {}
  errors.name = validateRequired(data.name)
  errors.phone = validatePhone(data.phone)
  if (!data.consentPersonal) errors.consentPersonal = 'Необходимо согласие'
  if (!data.consentAgreement) errors.consentAgreement = 'Необходимо согласие'
  return errors
}

export function useFooterLeadForm() {
  const [data, setData] = useState<FooterLeadFormData>({
    name: '',
    phone: '',
    consentPersonal: false,
    consentAgreement: false,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const updateField = useCallback(<K extends keyof FooterLeadFormData>(
    field: K,
    value: FooterLeadFormData[K]
  ) => {
    setData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }, [errors])

  const submit = useCallback(async () => {
    const formErrors = validate(data)
    if (hasErrors(formErrors)) {
      setErrors(formErrors)
      return
    }
    setIsSubmitting(true)
    setErrors({})
    try {
      await submitFooterLeadForm(data)
      setIsSuccess(true)
      setData({ name: '', phone: '', consentPersonal: false, consentAgreement: false })
    } catch (error) {
      const fallback = 'Ошибка отправки. Попробуйте позже.'
      const message = error instanceof FormSubmitError ? error.message : fallback
      setErrors({ form: message || fallback })
    } finally {
      setIsSubmitting(false)
    }
  }, [data])

  return { data, errors, isSubmitting, isSuccess, updateField, submit }
}
