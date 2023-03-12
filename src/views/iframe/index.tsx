import { useRef, useEffect } from 'react'
import styled from 'styled-components/macro'

const StyledIframe = styled.iframe`
  width: 100%;
  overflow: hidden;
`

interface IFrameViewProps {
  src: string
  scrolling?: 'yes' | 'no'
}

export default function IFrameView({ src, scrolling = 'no' }: IFrameViewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  function handleMessage(event: MessageEvent) {
    if (event.data.height && iframeRef.current) {
      iframeRef.current.style.height = `${event.data.height}px`
    }
  }

  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [src])

  return <StyledIframe ref={iframeRef} src={src} frameBorder="0" scrolling={scrolling} />
}
