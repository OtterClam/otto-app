import { useCallback } from 'react'
import useBrowserLayoutEffect from './useBrowserLayoutEffect'

export default function usePreloadImages(images: string[], prioritized?: boolean) {
  const preload = useImagePreloader()

  useBrowserLayoutEffect(() => {
    const links = images.map(image => preload(image, prioritized))
    return () => {
      links.forEach(link => {
        link.remove()
      })
    }
  }, [images, prioritized])
}

export const useImagePreloader = () => {
  return useCallback((image: string, prioritized?: boolean): HTMLLinkElement => {
    const link = document.createElement('link')
    link.as = 'image'
    link.rel = prioritized ? 'preload' : 'prefetch'
    link.href = image
    document.head.appendChild(link)
    return link
  }, [])
}
