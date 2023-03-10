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
    <StyledIframe ref={iframeRef} src={props.src} frameBorder="0" />
  );
}

export default function WhitepaperView() {
  return (
    <AutoHeightIframe src="https://docs.ottopia.app/ottopia" />
  );
}
