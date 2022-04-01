import axios from 'axios'
import { formatDuration, intervalToDuration } from 'date-fns'
import Portal, { RawPortal } from 'models/Portal'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  rawPortal: RawPortal
  children: (props: RenderPortalProps) => React.ReactNode
}

export default function PortalContainer({ rawPortal, children }: Props) {
  const [now, setNow] = useState(Date.now())
  const [metadata, setMetadata] = useState<PortalMeta | null>(null)
  const portal = useMemo(() => new Portal(rawPortal), [rawPortal])
  const state = useMemo(() => portal.state(now), [portal, now])
  const progress = useMemo(() => portal.openProgress(now), [portal, now])
  const duration = useMemo(() => {
    return formatDuration(
      intervalToDuration({
        start: now,
        end: portal.canOpenAt,
      })
    )
  }, [portal, now])
  useEffect(() => {
    axios.get<PortalMeta>(portal.tokenURI).then(res => {
      setMetadata(res.data)
    })
  }, [portal])
  useEffect(() => {
    setTimeout(() => setNow(Date.now()), 1000)
  }, [now])
  return (
    <>
      {children({
        portal,
        state,
        progress,
        duration,
        metadata,
      })}
    </>
  )
}
