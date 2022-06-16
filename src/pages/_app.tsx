import { Provider } from 'react-redux'
import App from 'App'
import { store } from 'store'
import GlobalStyles from 'styles/GlobalStyles'
import 'i18n'
import { AppProps } from 'next/app'

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

export default AppWrapper
