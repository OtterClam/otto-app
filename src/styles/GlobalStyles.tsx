import { createGlobalStyle } from 'styled-components/macro'

const GlobalStyle = createGlobalStyle`
    :root {
      --real-vh: 100vh;
      --header-height: 68px;
      --footer-height: 50px;
      --body-height: calc(var(--real-vh) - var(--header-height) - var(--footer-height) - env(safe-area-inset-bottom));

      --z-index-header: 1000;
      --z-index-popup: 2000;
      --z-index-side-menu: 2001;
      --z-index-dropdown: 2002;

      @media ${({ theme }) => theme.breakpoints.mobile} {
        --header-height: 100px;
      }
    }

    body {
      color: ${({ theme }) => theme.colors.otterBlack};
    }

    button {
        color: ${({ theme }) => theme.colors.otterBlack};
    }
`

function GlobalStyles(): JSX.Element {
  return <GlobalStyle />
}

export default GlobalStyles
