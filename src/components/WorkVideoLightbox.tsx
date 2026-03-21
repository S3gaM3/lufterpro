import { useEffect, useId } from 'react'
import { createPortal } from 'react-dom'
import { WorkVideoPlayer } from '@/components/WorkVideoPlayer'

interface WorkVideoLightboxProps {
  open: boolean
  onClose: () => void
  videos: string[]
  productName: string
}

export function WorkVideoLightbox({ open, onClose, videos, productName }: WorkVideoLightboxProps) {
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open || !videos.length) return null

  const node = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-[101] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-bg p-4 sm:p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <h2 id={titleId} className="font-display font-semibold text-lg text-fg pr-8">
            Видео работы — {productName}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-muted hover:text-fg hover:bg-surface-elevated transition-colors"
            aria-label="Закрыть"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-6">
          {videos.map((url, i) => (
            <WorkVideoPlayer
              key={`${url}-${i}`}
              url={url}
              title={`${productName} — видео ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )

  return createPortal(node, document.body)
}
