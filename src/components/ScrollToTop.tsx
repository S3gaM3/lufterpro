import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '')
      // Wait for route render before targeting element by id.
      window.requestAnimationFrame(() => {
        const node = document.getElementById(id)
        if (node) {
          node.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      })
      return
    }

    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}
