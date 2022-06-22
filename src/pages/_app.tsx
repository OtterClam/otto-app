import { Provider } from 'react-redux'
import App from 'App'
import { store } from 'store'
import GlobalStyles from 'styles/GlobalStyles'
import { AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next'

function AppWrapper({ Component }: AppProps) {
  return (
    <Provider store={store}>
      <GlobalStyles />
      <App>
        <Component />
      </App>
    </Provider>
  )
}

export default appWithTranslation(AppWrapper)
