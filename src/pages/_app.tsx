import 'styles/main.scss'
import { Provider } from 'react-redux'
import App from 'App'
import { store } from 'store'
import GlobalStyles from 'styles/GlobalStyles'
import { AppProps } from 'next/app'
import { appWithTranslation, I18n, useTranslation } from 'next-i18next'
import { NextPage } from 'next'
import { ReactElement, ReactNode } from 'react'

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement, i18n: I18n) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function AppWrapper({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? (page => page)
  const { i18n } = useTranslation()

  return (
    <Provider store={store}>
      <App>
        <GlobalStyles />
        {getLayout(<Component {...pageProps} />, i18n)}
      </App>
    </Provider>
  )
}

export default appWithTranslation(AppWrapper)
