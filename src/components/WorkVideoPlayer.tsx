import { parseVideoUrl } from '@/lib/videoUrls'

interface WorkVideoPlayerProps {
  url: string
  title: string
  className?: string
}

/**
 * Один ролик: HTML5 video или iframe (YouTube / Vimeo).
 */
export function WorkVideoPlayer({ url, title, className = '' }: WorkVideoPlayerProps) {
  const parsed = parseVideoUrl(url)
  if (!parsed) return null

  const frameClass = `w-full aspect-video rounded-xl border border-border bg-black ${className}`

  if (parsed.kind === 'youtube' || parsed.kind === 'vimeo') {
    return (
      <iframe
        src={parsed.embedUrl}
        title={title}
        className={frameClass}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
      />
    )
  }

  return (
    <video
      src={parsed.src}
      controls
      playsInline
      preload="metadata"
      className={`w-full max-h-[70vh] rounded-xl border border-border bg-black ${className}`}
    >
      Ваш браузер не поддерживает воспроизведение этого видео.
    </video>
  )
}
