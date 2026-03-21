import { useEffect } from 'react'
import { SITE } from '@/constants/site'

const JSON_LD_ID = 'site-jsonld'

export function SeoDefaults() {
  useEffect(() => {
    let node = document.getElementById(JSON_LD_ID) as HTMLScriptElement | null
    if (!node) {
      node = document.createElement('script')
      node.id = JSON_LD_ID
      node.type = 'application/ld+json'
      document.head.appendChild(node)
    }
    node.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          name: 'LUFTER',
          url: SITE.baseUrl,
          telephone: SITE.phoneDisplay,
          address: {
            '@type': 'PostalAddress',
            streetAddress: SITE.address,
            addressLocality: 'Москва',
            addressCountry: 'RU',
          },
        },
        {
          '@type': 'WebSite',
          name: 'LUFTER',
          url: SITE.baseUrl,
          inLanguage: 'ru-RU',
        },
      ],
    })
  }, [])

  return null
}
