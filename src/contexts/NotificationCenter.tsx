import axios from 'axios'
import { IS_SERVER } from 'constant'
import useApi from 'hooks/useApi'
import { Notification } from 'models/Notification'
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react'

const NotificationCenterContext = createContext<Notification[]>([])

const INTERVAL = 5000

export function useNotifications() {
  return useContext(NotificationCenterContext)
}

export default function NotificationCenterProvider({ children }: PropsWithChildren<object>) {
  const [notifications, setNotifications] = useState<Map<string, Notification>>(() => new Map())
  const api = useApi()

  const value = useMemo(() => Array.from(notifications).map(([, val]) => val), [notifications])

  useEffect(() => {
    if (IS_SERVER) {
      return
    }

    let timer: number

    const checkUpdate = () => {
      console.log(`[notification-center] fetch update`)
      return api
        .getNotifications()
        .then(result => {
          setNotifications(oldNotifications => {
            const newNotifications = new Map<string, Notification>()

            result.forEach(notification => {
              if (!notifications.has(notification.key)) {
                newNotifications.set(notification.key, notification)
              }
            })

            if (!newNotifications.size) {
              return oldNotifications
            }

            return new Map([...Array.from(newNotifications), ...Array.from(oldNotifications)].slice(0, 10))
          })
        })
        .catch(err => {
          console.warn('failed to fetch notifications', err)
        })
    }

    const tick = () => {
      timer = setTimeout(() => {
        checkUpdate().then(tick)
      }, INTERVAL) as any
    }

    tick()

    return () => {
      clearTimeout(timer)
    }
  }, [api])

  return <NotificationCenterContext.Provider value={value}>{children}</NotificationCenterContext.Provider>
}
