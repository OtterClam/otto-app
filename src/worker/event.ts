import { EventType } from './consts'

export interface WorkerMessage<T> {
  type: EventType
  data: T
}

export type WorkerMessageEvent<T> = MessageEvent<WorkerMessage<T>>
