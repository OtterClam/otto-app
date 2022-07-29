import Button from 'components/Button'
import GiveawayFloatingButton from 'components/GiveawayFloatingButton'
import OtterClamFloatingButton from 'components/OtterClamFloatingButton'
import MenuButton from 'components/MenuButton'
import { BUY_CLAM_LINK, DAO_LINK, DISCORD_LINK, TREASURY_LINK, WHITE_PAPER_LINK } from 'constant'
import { useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import styled from 'styled-components/macro'
import { Display3 } from 'styles/typography'
import { useDispatch } from 'react-redux'
import { showWalletPopup } from 'store/uiSlice'
import BuyCLAMIcon from './icons/buy-clam.png'
import DAOIcon from './icons/dao.png'
import JoinDiscordIcon from './icons/join-discord.png'
import PortalLarge from './icons/portal-large.png'
import PortalIcon from './icons/portal.png'
import TreasuryIcon from './icons/treasury.png'
import WhitePaperIcon from './icons/whitepaper.png'

const StyledHomePage = styled.div`
  width: 80%;
  display: grid;
  grid-template: 'left-menu portal right-menu' / 168px auto 168px;

  @media ${({ theme }) => theme.breakpoints.tablet} {
    max-width: 356px;
    width: 100%;
    grid-template:
      'portal    portal'
      'left-menu right-menu' / 168px 168px;
    gap: 0 20px;
  }
`

const StyledMenus = styled.div<{ area: string }>`
  display: flex;
  flex-direction: column;
  gap: 20px;
  grid-area: ${props => props.area};
`

const StyledMenuButton = styled(MenuButton)`
  width: 168px;
  height: 178px;
`

const StyledPortalContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: space-around;
  grid-area: portal;

  @media ${({ theme }) => theme.breakpoints.tablet} {
    max-height: 375px;
  }
`

const StyledPortalImage = styled.img`
  width: 472px;
  height: 472px;

  @media ${({ theme }) => theme.breakpoints.tablet} {
    width: 375px;
    height: 375px;
  }
`

const StyledButton = styled(Button)`
  transform: translate(0, -80px);
`

interface Menu {
  title: string
  icon: string
  href?: string
  internal?: boolean
  action?: () => void
}

const HomePage = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const leftMenus: Menu[] = useMemo(
    () => [
      { title: t('home.menu.mint_portals'), icon: PortalIcon.src, href: '/mint', internal: true },
      { title: t('home.menu.otter_dao'), icon: DAOIcon.src, href: DAO_LINK },
      { title: t('home.menu.join_discord'), icon: JoinDiscordIcon.src, href: DISCORD_LINK },
    ],
    [t]
  )
  const rightMenus: Menu[] = useMemo(
    () => [
      { title: t('home.menu.buy_clam'), icon: BuyCLAMIcon.src, action: () => dispatch(showWalletPopup()) },
      { title: t('home.menu.treasury'), icon: TreasuryIcon.src, href: TREASURY_LINK, internal: true },
      { title: t('home.menu.white_paper'), icon: WhitePaperIcon.src, href: WHITE_PAPER_LINK },
    ],
    [t, dispatch]
  )

  const renderMenus = (menus: Menu[], area: string) => (
    <StyledMenus area={area}>
      {menus.map(({ title, icon, href, internal, action }, i) =>
        action ? (
          <StyledMenuButton title={title} icon={icon} onClick={action} />
        ) : internal ? (
          <Link key={i} href={href || ''} rel="noreferrer">
            <a>
              <StyledMenuButton title={title} icon={icon} disabled={!href} />
            </a>
          </Link>
        ) : (
          <a key={i} href={href || ''} target="_blank" rel="noreferrer">
            <StyledMenuButton title={title} icon={icon} disabled={!href} />
          </a>
        )
      )}
    </StyledMenus>
  )

  const renderPortals = () => (
    <StyledPortalContainer>
      <StyledPortalImage src={PortalLarge.src} />
      <Link href="/play">
        <a>
          <StyledButton primaryColor="white" Typography={Display3}>
            {t('home.play')}
          </StyledButton>
        </a>
      </Link>
    </StyledPortalContainer>
  )

  return (
    <>
      <StyledHomePage>
        {renderMenus(leftMenus, 'left-menu')}
        {renderPortals()}
        {renderMenus(rightMenus, 'right-menu')}
      </StyledHomePage>
      <GiveawayFloatingButton />
      <OtterClamFloatingButton />
    </>
  )
}

export default HomePage
