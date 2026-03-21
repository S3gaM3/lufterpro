import type { FormErrors } from '@/types/form'

const PHONE_REGEX = /^[\d\s\-+()]{10,}$/

export function validateRequired(value: string, message = 'Это поле обязательно для заполнения'): string | undefined {
  return value.trim() ? undefined : message
}

export function validatePhone(value: string): string | undefined {
  if (!value.trim()) {
    return 'Это поле обязательно для заполнения'
  }
  if (!PHONE_REGEX.test(value.replace(/\s/g, ''))) {
    return 'Неверный формат телефона'
  }
  return undefined
}

export function hasErrors(errors: FormErrors): boolean {
  return Object.values(errors).some(Boolean)
}
