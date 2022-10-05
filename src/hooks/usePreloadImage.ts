import { useCallback } from 'react'
import useBrowserLayoutEffect from './useBrowserLayoutEffect'

export default function usePreloadImages(images: string[]) {
  const preload = useImagePreloader()

  useBrowserLayoutEffect(() => {
    const links = images.map(preload)
    return () => {
      links.forEach(link => {
        link.remove()
      })
    }
  }, [images])
}

export const useImagePreloader = () => {
  return useCallback((image: string): HTMLLinkElement => {
    const link = document.createElement('link')
    link.as = 'image'
    link.rel = 'preload'
    link.href = image
    document.head.appendChild(link)
    return link
  }, [])
}
