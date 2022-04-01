interface RenderPortalProps {
  portal: Portal
  state: PortalState
  progress: number
  duration: string
  metadata: PortalMeta | null
}

interface PortalMeta {
  name: string
  image: string
  description: string
}
