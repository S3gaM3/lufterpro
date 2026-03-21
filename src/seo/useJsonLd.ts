import { useEffect } from 'react'

export function useJsonLd(id: string, payload: Record<string, unknown>) {
  useEffect(() => {
    let node = document.getElementById(id) as HTMLScriptElement | null
    if (!node) {
      node = document.createElement('script')
      node.id = id
      node.type = 'application/ld+json'
      document.head.appendChild(node)
    }
    node.textContent = JSON.stringify(payload)
    return () => {
      const target = document.getElementById(id)
      target?.remove()
    }
  }, [id, payload])
}
