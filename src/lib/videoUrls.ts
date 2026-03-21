/**
 * Разбор URL из каталога: прямой файл (mp4/webm/ogg) или встраивание YouTube / Vimeo.
 */

export type VideoSource =
  | { kind: 'file'; src: string }
  | { kind: 'youtube'; embedUrl: string }
  | { kind: 'vimeo'; embedUrl: string }

export function parseVideoUrl(url: string): VideoSource | null {
  const trimmed = url.trim()
  if (!trimmed) return null

  if (/^https?:\/\/(www\.)?youtube\.com\/embed\//i.test(trimmed)) {
    const clean = trimmed.split('&')[0]?.split('?')[0] ?? trimmed
    return { kind: 'youtube', embedUrl: clean }
  }

  const ytWatch = trimmed.match(
    /(?:youtube\.com\/watch\?[^#]*v=|youtu\.be\/)([\w-]{11})/i
  )
  if (ytWatch?.[1]) {
    return {
      kind: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${ytWatch[1]}`,
    }
  }

  const vimeo = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/i)
  if (vimeo?.[1]) {
    return {
      kind: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeo[1]}`,
    }
  }

  return { kind: 'file', src: trimmed }
}
