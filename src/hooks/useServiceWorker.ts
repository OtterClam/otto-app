import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'

export enum ServiceWorkerStatus {
  Unknown,
  Installing,
  Activating,
}

export default function useServiceWorker() {
  const { t } = useTranslation()
  const [enabled] = useState(
    () => typeof window !== 'undefined' && 'serviceWorker' in navigator && window.workbox !== undefined
  )

  const [activated, setActivated] = useState(false)

  useEffect(() => {
    window.workbox.active.then(() => {
      console.log('service worker activated')
      setActivated(true)
    })
  }, [])

  useEffect(() => {
    if (!enabled) {
      console.debug('The execution environment does not support service worker')
      return
    }

    const { workbox } = window

    workbox.addEventListener('installing', () => {
      console.log('install service worker...')
    })

    workbox.addEventListener('installed', () => {
      console.log('service worker installed')
    })

    workbox.addEventListener('waiting', () => {
      const result = window.confirm(t('new_version'))
      if (result) {
        workbox.addEventListener('controlling', () => {
          window.location.reload()
        })
        workbox.messageSkipWaiting()
      }
    })
  }, [enabled])

  return {
    activated,
    enabled,
  }
}
