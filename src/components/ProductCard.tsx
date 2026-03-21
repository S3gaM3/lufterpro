import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { CatalogItem } from '@/data/catalog'
import { WorkVideoLightbox } from '@/components/WorkVideoLightbox'

interface ProductCardProps {
  product: CatalogItem
  to: string
  fallbackImage: string
}

function IconPlay({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width="24"
      height="24"
      aria-hidden
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

export function ProductCard({ product, to, fallbackImage }: ProductCardProps) {
  const [videoOpen, setVideoOpen] = useState(false)
  const videos = product.workVideos
  const hasVideos = Boolean(videos?.length)

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group overflow-hidden h-full flex flex-col rounded-2xl border border-border bg-black p-6 lg:p-8 transition-all duration-300 hover:border-border-hover"
    >
      <div className="relative aspect-square bg-black rounded-xl mb-5 overflow-hidden shrink-0">
        <Link
          to={to}
          className="app-link-reset absolute inset-0 flex items-center justify-center p-6 group/img outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xl"
        >
          <img
            src={product.image ?? fallbackImage}
            alt=""
            loading="lazy"
            decoding="async"
            className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover/img:scale-105"
          />
        </Link>
        {hasVideos && (
          <>
            <span className="absolute top-2 left-2 z-10 rounded-md bg-black/70 text-fg text-xs font-medium px-2 py-1 backdrop-blur-sm pointer-events-none">
              Видео работы
            </span>
            <button
              type="button"
              onClick={() => setVideoOpen(true)}
              className="absolute bottom-2 right-2 z-10 flex items-center gap-1.5 rounded-full bg-accent text-white pl-3 pr-3 py-2 text-sm font-semibold shadow-lg hover:brightness-110 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/50"
              aria-label={`Видео работы: ${product.name}`}
            >
              <IconPlay className="w-4 h-4 shrink-0" />
              Смотреть
            </button>
          </>
        )}
      </div>

      <Link to={to} className="flex flex-col flex-1 min-h-0 px-1 no-underline">
        <span className="text-xs text-muted">{product.sku}</span>
        <h2 className="font-display font-semibold text-lg app-link-face mt-1">
          {product.name}
        </h2>
        {product.description && (
          <p className="text-sm text-muted-light mt-2 line-clamp-2">{product.description}</p>
        )}
        <span className="mt-auto pt-4 app-link-face font-semibold text-sm group-hover:underline inline-block">
          Подробнее →
        </span>
      </Link>

      {hasVideos && videos && (
        <WorkVideoLightbox
          open={videoOpen}
          onClose={() => setVideoOpen(false)}
          videos={videos}
          productName={product.name}
        />
      )}
    </motion.article>
  )
}
