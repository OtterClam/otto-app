import MintPage from 'pages/mint/MintPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MyPortalsPage from 'pages/my-portals/MyPortalsPage'
import PortalPage from 'pages/my-portals/PortalPage'
import PlayPage from 'pages/play/PlayPage'
import App from './App'
import HomePage from './pages/home/HomePage'
import NotFoundPage from './pages/not-found/NotFoundPage'

const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="play" element={<PlayPage />} />
          <Route path="mint" element={<MintPage />} />
          <Route path="my-portals">
            <Route index element={<MyPortalsPage />} />
            <Route path=":portalId" element={<PortalPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Routing
