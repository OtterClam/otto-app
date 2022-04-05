import axios from 'axios'
import Otto, { RawOtto } from 'models/Otto'
import { useEffect, useMemo, useState } from 'react'
import { OttoMeta, RenderOttoProps } from './types'

interface Props {
  rawOtto: RawOtto
  children: (props: RenderOttoProps) => React.ReactNode
}

export default function OttoContainer({ rawOtto, children }: Props) {
  const [metadata, setMetadata] = useState<OttoMeta | null>(null)
  const otto = useMemo(() => new Otto(rawOtto), [rawOtto])
  useEffect(() => {
    axios
      .get<OttoMeta>(otto.tokenURI)
      .then(res => {
        setMetadata(res.data)
      })
      .catch(err => console.error('fetch otto meta failed', err))
  }, [otto])
  return (
    <>
      {children({
        otto,
        metadata,
      })}
    </>
  )
}
