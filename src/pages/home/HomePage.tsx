import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import Layout from 'Layout'
import MenuButton from 'components/MenuButton'
import { BUY_CLAM_LINK, DAO_LINK, DISCORD_LINK, TREASURY_LINK, WHITE_PAPER_LINK } from 'constant'
import { useMemo } from 'react'
import Button from 'components/Button'
import { Display3 } from 'styles/typography'
import { Link } from 'react-router-dom'
import { useMediaQuery } from 'hooks/useMediaQuery'
import { breakpoints } from 'styles/breakpoints'
import PortalIcon from './portal_disabled.png'
import BuyCLAMIcon from './buy-clam.png'
import DAOIcon from './dao.png'
import JoinDiscordIcon from './join-discord.png'
import TreasuryIcon from './treasury.png'
import WhitePaperIcon from './whitepaper.png'
import PortalLarge from './portal-large.png'

const StyledHomePage = styled.div`
  width: 80%;
  display: flex;
  align-items: center;
  justify-content: space-around;
`

const StyledMobileHomePage = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const StyledMobileMenuContainers = styled.div`
  display: flex;
  gap: 20px;
`

const StyledMenus = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
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

  @media ${({ theme }) => theme.breakpoints.mobile} {
    max-height: 375px;
  }
`

const StyledPortalImage = styled.img`
  width: 472px;
  height: 472px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 375px;
    height: 375px;
  }
`

const StyledButton = styled(Button)`
  translate: 0 -80px;
`

interface Menu {
  title: string
  icon: string
  href?: string
}

const HomePage = () => {
  const { t } = useTranslation()
  const isMobile = useMediaQuery(breakpoints.mobile)

  const leftMenus: Menu[] = useMemo(
    () => [
      { title: t('home.menu.my_portals'), icon: PortalIcon },
      { title: t('home.menu.otter_dao'), icon: DAOIcon, href: DAO_LINK },
      { title: t('home.menu.join_discord'), icon: JoinDiscordIcon, href: DISCORD_LINK },
    ],
    [t]
  )
  const rightMenus: Menu[] = useMemo(
    () => [
      { title: t('home.menu.buy_clam'), icon: BuyCLAMIcon, href: BUY_CLAM_LINK },
      { title: t('home.menu.treasury'), icon: TreasuryIcon, href: TREASURY_LINK },
      { title: t('home.menu.white_paper'), icon: WhitePaperIcon, href: WHITE_PAPER_LINK },
    ],
    [t]
  )

  const renderMenus = (menus: Menu[]) => (
    <StyledMenus>
      {menus.map(({ title, icon, href }, i) => (
        <a href={href} target="_blank" rel="noreferrer">
          <StyledMenuButton key={i} title={title} icon={icon} disabled={!href} />
        </a>
      ))}
    </StyledMenus>
  )

  const renderPortals = () => (
    <StyledPortalContainer>
      <StyledPortalImage src={PortalLarge} />
      <Link to="/mint">
        <StyledButton primaryColor="white">
          <Display3>{t('home.mint_portal')}</Display3>
        </StyledButton>
      </Link>
    </StyledPortalContainer>
  )

  return (
    <Layout title={t('home.title')} noBorder>
      {isMobile && (
        <StyledMobileHomePage>
          {renderPortals()}
          <StyledMobileMenuContainers>
            {renderMenus(leftMenus)}
            {renderMenus(rightMenus)}
          </StyledMobileMenuContainers>
        </StyledMobileHomePage>
      )}
      {!isMobile && (
        <StyledHomePage>
          {renderMenus(leftMenus)}
          {renderPortals()}
          {renderMenus(rightMenus)}
        </StyledHomePage>
      )}
    </Layout>
  )
}

export default HomePage
