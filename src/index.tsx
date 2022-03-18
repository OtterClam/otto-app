import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { store } from './store'
import GlobalStyles from './styles/GlobalStyles'
import Routing from './Routing'
import './i18n'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <GlobalStyles />
      <Routing />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
