import { useRef, useEffect } from 'react';
import styled from 'styled-components/macro';

const StyledIframe = styled.iframe`
  width: 100%;
`;

function AutoHeightIframe(props: {src: string}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  function handleMessage(event: MessageEvent) {
    if (event.data.height && iframeRef.current) {
      iframeRef.current.style.height = event.data.height + 'px';
    }
  }

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [props.src]);

  return (
    <StyledIframe ref={iframeRef} src={props.src} frameBorder="0" scrolling="no" />
  );
}

export default function PalaceView() {
  return (
    <AutoHeightIframe src="https://v2-embednotion.com/64952dfd28ee4aee85a1c837af30f71d" />
  );
}
