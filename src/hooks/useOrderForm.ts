import { useState, useCallback } from 'react'
import { FormSubmitError, type FormErrors, type OrderFormData } from '@/types/form'
import { submitOrderForm } from '@/services/formService'
import { hasErrors, validatePhone } from '@/lib/formValidation'

/** На оригинале обязателен только телефон (имя — необязательно). */
function validateOrderForm(data: OrderFormData): FormErrors {
  const errors: FormErrors = {}
  errors.phone = validatePhone(data.phone)
  return errors
}

export function useOrderForm(onSuccess?: () => void) {
  const [data, setData] = useState<OrderFormData>({ name: '', phone: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const updateField = useCallback(<K extends keyof OrderFormData>(
    field: K,
    value: OrderFormData[K]
  ) => {
    setData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }, [errors])

  const submit = useCallback(async () => {
    const formErrors = validateOrderForm(data)
    if (hasErrors(formErrors)) {
      setErrors(formErrors)
      return
    }
    setIsSubmitting(true)
    setErrors({})
    try {
      await submitOrderForm(data)
      setIsSuccess(true)
      setData({ name: '', phone: '' })
      onSuccess?.()
    } catch (error) {
      const fallback = 'Ошибка отправки. Попробуйте позже.'
      const message = error instanceof FormSubmitError ? error.message : fallback
      setErrors({ form: message || fallback })
    } finally {
      setIsSubmitting(false)
    }
  }, [data, onSuccess])

  return { data, errors, isSubmitting, isSuccess, updateField, submit }
}
