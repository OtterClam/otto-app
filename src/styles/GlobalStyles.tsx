import { createGlobalStyle } from 'styled-components/macro'
import cursorDefault from 'assets/cursor-default.png'
import cursorPointer from 'assets/cursor-pointer.png'

const GlobalStyle = createGlobalStyle`
    body {
        cursor: url(${cursorDefault}), auto;
    }

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    button {
        background: none;
        border: none;
        outline: none;
        cursor: url(${cursorPointer}) 7 0 ,auto;

        :disabled {
            cursor: url(${cursorDefault}), auto;
        }
    }

    input {
        border: none;
        outline: none;
    }

    a {
        color: unset;
        text-decoration: none;
        cursor: url(${cursorPointer}) 7 0 ,auto;
    }

    @font-face {
        font-family: 'Pangolin';
        src: url('/fonts/Pangolin-Regular.ttf') ;
    }

    @font-face {
        font-family: 'PaytoneOne';
        src: url('/fonts/paytoneone-regular.woff2') format('woff2');
    }

    @font-face {
        font-family: naikaifont;
        src: url(https://cdn.jsdelivr.net/gh/max32002/naikaifont@1.0/webfont/NaikaiFont-Regular-Lite.woff2) format("woff2")
        , url(https://cdn.jsdelivr.net/gh/max32002/naikaifont@1.0/webfont/NaikaiFont-Regular-Lite.woff) format("woff");
    }
`

function GlobalStyles(): JSX.Element {
  return <GlobalStyle />
}

export default GlobalStyles
