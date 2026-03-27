const NBSP = '\u00A0'

/**
 * Prevents hanging Russian prepositions at line end
 * by replacing the space after them with a non-breaking one.
 */
export function preventHangingPrepositions(text: string): string {
  return text.replace(
    /(^|[\s([{"'«„])((?:[Вв]|[Кк]|[Сс]|[Уу]|[Оо]|[Ии]|[Аа])|(?:[Вв]о|[Кк]о|[Сс]о|[Оо]б|[Оо]т|[Дд]о|[Ии]з|[Нн]а|[Пп]о|[Зз]а))\s+/g,
    (_, prefix: string, prep: string) => `${prefix}${prep}${NBSP}`,
  )
}

export function typographText<T>(value: T): T {
  if (typeof value === 'string') {
    return preventHangingPrepositions(value) as T
  }
  if (Array.isArray(value)) {
    return value.map((item) => typographText(item)) as T
  }
  if (value && typeof value === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, nested] of Object.entries(value)) {
      result[key] = typographText(nested)
    }
    return result as T
  }
  return value
}
