import MintPage from 'pages/mint/MintPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import HomePage from './pages/home/HomePage'
import NotFoundPage from './pages/not-found/NotFoundPage'

const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="mint" element={<MintPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Routing
