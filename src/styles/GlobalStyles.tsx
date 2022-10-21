import { createGlobalStyle } from 'styled-components/macro'

const GlobalStyle = createGlobalStyle`
    :root {
      --real-vh: 100vh;
      --header-height: 68px;
      --header-margin: 20px;
      --footer-height: 50px;
      --body-height: calc(var(--real-vh) - var(--header-height) - var(--header-margin) - var(--footer-height) - env(safe-area-inset-bottom) - 2px);
      --game-menu-height: 40px; 
      --game-body-height: calc(var(--real-vh) - var(--header-height) - var(--header-margin) - var(--game-menu-height) - env(safe-area-inset-bottom) - 2px);

      --z-index-header: 1000;
      --z-index-popup: 2000;
      --z-index-overlay: 1999;
      --z-index-side-menu: 2001;
      --z-index-dropdown: 2002;

      @media ${({ theme }) => theme.breakpoints.desktop} {
        --game-body-height: calc(var(--real-vh) - var(--header-height) - var(--game-menu-height) - env(safe-area-inset-bottom));
      }

      @media ${({ theme }) => theme.breakpoints.tablet} {
        --game-body-height: calc(var(--real-vh) - var(--header-height) - var(--game-menu-height) - env(safe-area-inset-bottom));
      }

      @media ${({ theme }) => theme.breakpoints.smallTablet} {
        --game-menu-height: 30px; 
      }

      @media ${({ theme }) => theme.breakpoints.mobile} {
        --header-height: 100px;
        --header-margin: 10px;
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
