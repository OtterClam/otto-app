import { createGlobalStyle } from 'styled-components'
import cursor from 'assets/cursor.png'

const GlobalStyle = createGlobalStyle`
    :root {
        --bg: white;
        --main: white;
        --sub: grey;
        --primary: #32B2E5;
        --error: red;
    }

    body {
        cursor: url(${cursor}), auto;
    }

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    @font-face {
        font-family: 'Pangolin';
        src: local('Pangolin-Regular'), url('./fonts/pangolin-regular.woff2') format('woff2');;
    }

    @font-face {
        font-family: 'PaytoneOne';
        src: local('PaytoneOne-Regular'), url('./fonts/paytoneone-regular.woff2') format('woff2');
    }

    p {
        color: var(--main);
    }

    button {
        background: none;
        border: none;
        outline: none;
    }

    input {
        border: none;
        outline: none;
    }

    a {
        text-decoration: none;
    }
`

function GlobalStyles(): JSX.Element {
  return <GlobalStyle />
}

export default GlobalStyles
