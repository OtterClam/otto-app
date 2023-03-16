import GiveawayFloatingButton from 'components/GiveawayFloatingButton'
import OtterClamFloatingButton from 'components/OtterClamFloatingButton'
import MenuButton from 'components/MenuButton'
import MintBanner from 'components/MintBanner'
import { useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import styled from 'styled-components/macro'
import DefaultMetaTags from 'components/DefaultMetaTags'
import AuctionHouseIcon from './icons/auction-house.png'
import ForgeHouseIcon from './icons/forge-house.png'
import LeaderboardIcon from './icons/leaderboard.png'
import MissionsIcon from './icons/missions.png'
import MyItemsIcon from './icons/my-items.png'
import MyOttosIcon from './icons/my-ottos.png'
import MyPortalIcon from './icons/my-portal.png'
import OttoStoreIcon from './icons/otto-store.png'

const StyledPlayPage = styled.div`
  width: 80%;
  display: grid;
  justify-content: space-between;
  row-gap: 20px;
  grid-template-columns: repeat(4, 1fr);
  justify-items: center;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    margin: 0 6px;
    width: 100%;
    grid-template-columns: repeat(2, 1fr);
  }
`

const StyledBanner = styled(MintBanner)`
  grid-column-start: 1;
  grid-column-end: 5;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    grid-column-start: 1;
    grid-column-end: 3;
  }
`

const StyledMenuButton = styled(MenuButton)`
  width: 168px;
  height: 178px;
`

interface Menu {
  title: string
  icon: string
  href?: string
}

const PlayPage = () => {
  const { t } = useTranslation()

  const menus: Menu[] = useMemo(
    () => [
      { title: t('play.menu.my_portals'), icon: MyPortalIcon.src, href: '/my-portals' },
      { title: t('play.menu.my_ottos'), icon: MyOttosIcon.src, href: '/my-ottos' },
      { title: t('play.menu.my_items'), icon: MyItemsIcon.src, href: '/my-items' },
      { title: t('play.menu.otto_store'), icon: OttoStoreIcon.src, href: '/store' },
      { title: t('play.menu.leaderboard'), icon: LeaderboardIcon.src, href: '/leaderboard' },
      { title: t('play.menu.forge_house'), icon: ForgeHouseIcon.src },
      { title: t('play.menu.auction_house'), icon: AuctionHouseIcon.src },
      { title: t('play.menu.missions'), icon: MissionsIcon.src },
    ],
    [t]
  )

  return (
    <StyledPlayPage>
      <DefaultMetaTags />
      <StyledBanner />
      {menus.map(({ title, icon, href }, i) => (
        <Link key={i} href={href || '#'}>
          <a href={href || '#'}>
            <StyledMenuButton title={title} icon={icon} disabled={!href} />
          </a>
        </Link>
      ))}
      <GiveawayFloatingButton />
      <OtterClamFloatingButton />
    </StyledPlayPage>
  )
}

export default PlayPage
