import Portal, { PortalState } from 'models/Portal'

export interface RenderPortalProps {
  portal: Portal
  state: PortalState
  progress: number
  duration: string
  metadata: PortalMeta | null
}

export interface PortalMeta {
  name: string
  image: string
  description: string
}
