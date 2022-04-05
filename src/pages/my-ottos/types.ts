import Otto from 'models/Otto'

export interface OttoMeta {
  name: string
  image: string
  description: string
}

export interface RenderOttoProps {
  otto: Otto
  metadata: OttoMeta | null
}
