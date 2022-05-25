import GiveawayPage from 'pages/giveaway/GiveawayPage'
import HomePage from 'pages/home/HomePage'
import LeaderboardPage from 'pages/leaderboard/LeaderboardPage'
import MintPage from 'pages/mint/MintPage'
import MyItemsPage from 'pages/my-items/MyItemsPage'
import MyPortalsPage from 'pages/my-portals/MyPortalsPage'
import PortalPage from 'pages/my-portals/PortalPage'
import MyOttosPage from 'pages/otto/MyOttosPage/MyOttosPage'
import OttoPage from 'pages/otto/OttoPage'
import PlayPage from 'pages/play/PlayPage'
import StorePage from 'pages/store/StorePage'
import TwitterCallback from 'pages/TwitterCallback'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'

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
          <Route path="my-ottos">
            <Route index element={<MyOttosPage />} />
            <Route path=":ottoId" element={<OttoPage />} />
          </Route>
          <Route path="ottos/:ottoId" element={<OttoPage />} />
          <Route path="my-items">
            <Route index element={<MyItemsPage />} />
          </Route>
          <Route path="store">
            <Route index element={<StorePage />} />
          </Route>
          <Route path="leaderboard">
            <Route index element={<LeaderboardPage />} />
          </Route>
          <Route path="giveaway">
            <Route index element={<GiveawayPage />} />
          </Route>
          <Route path="twitter-callback" element={<TwitterCallback />} />
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Routing
