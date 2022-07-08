import 'styles/modules.css'
import { Provider } from 'react-redux'
import App from 'App'
import { store } from 'store'
import GlobalStyles from 'styles/GlobalStyles'
import { AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next'
import { NextPage } from 'next'
import { ReactElement, ReactNode } from 'react'

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function AppWrapper({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? (page => page)

  return (
    <Provider store={store}>
      <App>
        <GlobalStyles />
        {getLayout(<Component {...pageProps} />)}
      </App>
    </Provider>
  )
}

export default appWithTranslation(AppWrapper)
