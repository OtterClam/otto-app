import { EventType } from './consts'

export const broadcast = <T>(type: EventType, data: T) => {
  console.log(`[worker] send message: ${JSON.stringify({ type, data })}`)
  clients.matchAll({ includeUncontrolled: true }).then(clientList => {
    clientList.forEach(client => {
      client.postMessage({
        type,
        data,
      })
    })
  })
}
