import { useEffect } from 'react'
import { SITE } from '@/constants/site'

type MetaName = 'description' | 'robots' | 'twitter:title' | 'twitter:description' | 'twitter:card'
type MetaProperty = 'og:title' | 'og:description' | 'og:type' | 'og:url' | 'og:image'

interface PageSeoInput {
  title: string
  description: string
  path: string
  image?: string
  robots?: string
  type?: 'website' | 'article' | 'product'
}

function upsertMetaName(name: MetaName, content: string) {
  let meta = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('name', name)
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', content)
}

function upsertMetaProperty(property: MetaProperty, content: string) {
  let meta = document.head.querySelector<HTMLMetaElement>(`meta[property="${property}"]`)
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('property', property)
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', content)
}

function upsertCanonical(url: string) {
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    document.head.appendChild(canonical)
  }
  canonical.setAttribute('href', url)
}

export function usePageSeo({
  title,
  description,
  path,
  image = `${SITE.baseUrl}${SITE.logo}`,
  robots = 'index,follow',
  type = 'website',
}: PageSeoInput) {
  useEffect(() => {
    const canonicalUrl = `${SITE.baseUrl}${path}`
    document.title = title
    upsertCanonical(canonicalUrl)
    upsertMetaName('description', description)
    upsertMetaName('robots', robots)
    upsertMetaName('twitter:card', 'summary_large_image')
    upsertMetaName('twitter:title', title)
    upsertMetaName('twitter:description', description)
    upsertMetaProperty('og:title', title)
    upsertMetaProperty('og:description', description)
    upsertMetaProperty('og:type', type)
    upsertMetaProperty('og:url', canonicalUrl)
    upsertMetaProperty('og:image', image.startsWith('http') ? image : `${SITE.baseUrl}${image}`)
  }, [description, image, path, robots, title, type])
}
