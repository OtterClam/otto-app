import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { PropsWithChildren } from 'react'
import styled from 'styled-components'
import { Caption, Note } from 'styles/typography'
import { useRouter } from 'next/router'
import MenuXl from './treasury_menu_xl.png'
import MenuXs from './treasury_menu_xs.png'
import BondIcon from './icon_48_bond.png'
import ClamIcon from './icon_48_clam.png'
import DashboardIcon from './icon_48_dashboard.png'
import PearlIcon from './icon_48_pearl.png'

const menuIcons = {
  bond: BondIcon.src,
  dashboard: DashboardIcon.src,
  lake: PearlIcon.src,
  pond: ClamIcon.src,
}

const StyledContainer = styled.div`
  display: flex;
  width: 100%;

  @media ${({ theme }) => theme.breakpoints.tablet} {
    flex-direction: column;
    width: 95%;
  }
`

const StyledSidebar = styled.nav`
  flex: 0 240px;
  min-width: 240px;
  max-width: 240px;

  @media ${({ theme }) => theme.breakpoints.tablet} {
    flex: 0 84px;
    min-height: 84px;
    max-height: 84px;
    min-width: unset;
    max-width: unset;
  }
`

const StyledMenu = styled.ul`
  margin: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 15px;

  @media ${({ theme }) => theme.breakpoints.tablet} {
    flex-direction: row;
    gap: unset;
  }
`

const StyledMenuItem = styled.li`
  width: 240px;
  height: 65px;

  @media ${({ theme }) => theme.breakpoints.tablet} {
    width: 64px;
    height: 84px;
  }
`

const StyledMenuItemLink = styled.a<{ active?: boolean; itemKey: keyof typeof menuIcons }>`
  display: flex;
  flex-direction: column;
  min-width: 240px;
  max-width: 240px;
  min-height: 65px;
  max-height: 65px;
  box-sizing: border-box;
  padding-left: 72px;
  background: no-repeat 8px center / 48px 48px url(${({ itemKey }) => menuIcons[itemKey]}),
    left center / 240px 195px url(${MenuXl.src});

  ${({ active }) =>
    active &&
    `
    background-position: 8px center, left top;
  `}

  ${({ active }) =>
    !active &&
    `
    &:hover {
      background-position: 8px center, left bottom;
    }
  `}

  @media ${({ theme }) => theme.breakpoints.tablet} {
    min-width: unset;
    max-width: unset;
    min-height: 84px;
    max-height: 84px;
    background: no-repeat 8px 3px / 48px 48px url(${({ itemKey }) => menuIcons[itemKey]}),
      no-repeat left center / 64px 252px url(${MenuXs.src});
    padding-left: 0;

    ${({ active }) =>
      active &&
      `
      background-position: 8px 3px, left top;
    `}

    ${({ active }) =>
      !active &&
      `
      &:hover {
        background-position: 8px 3px, left bottom;
      }
    `}
  }
`

const StyledMenuItemLabel = styled(Caption)`
  display: flex;
  align-items: center;
  flex: 1;
  margin-top: 4px;
  margin-left: 4px;

  @media ${({ theme }) => theme.breakpoints.tablet} {
    margin: 0;
    justify-content: center;
    align-items: end;
    margin-bottom: 20px;
  }
`

const StyledMenuItemDesc = styled(Note)`
  display: flex;
  align-items: center;
  flex: 0 18px;
  min-height: 18px;
  max-height: 18px;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 4px;

  @media ${({ theme }) => theme.breakpoints.tablet} {
    display: none;
  }
`

const StyledContent = styled.div`
  flex: 1;
  padding: 4px;
`

interface MenuItem {
  key: keyof typeof menuIcons
  legacy?: string
  disabled?: boolean
}

const menuItems: MenuItem[] = [
  { key: 'dashboard' },
  { key: 'pond' },
  { key: 'lake', legacy: '/#/pearl-chests' },
  // { key: 'farm', disabled: true },
  { key: 'bond', legacy: '/#/bonds' },
]

const getUrlForMenuItem = (item: MenuItem) =>
  item.legacy ? process.env.NEXT_PUBLIC_DEFI_URL + item.legacy : `/treasury/${item.key}`

export default function TreasuryLayout({ children }: PropsWithChildren<object>) {
  const { t } = useTranslation('', { keyPrefix: 'treasury.layout' })
  const router = useRouter()

  return (
    <StyledContainer>
      <StyledSidebar>
        <StyledMenu>
          {menuItems
            .filter(item => !item.disabled)
            .map(item => (
              <StyledMenuItem key={item.key}>
                <Link href={getUrlForMenuItem(item)}>
                  <StyledMenuItemLink itemKey={item.key} active={getUrlForMenuItem(item) === router.pathname}>
                    <StyledMenuItemLabel>{t(`nav.label.${item.key}`)}</StyledMenuItemLabel>
                    <StyledMenuItemDesc>{t(`nav.desc.${item.key}`)}</StyledMenuItemDesc>
                  </StyledMenuItemLink>
                </Link>
              </StyledMenuItem>
            ))}
        </StyledMenu>
      </StyledSidebar>
      <StyledContent>{children}</StyledContent>
    </StyledContainer>
  )
}
