import FlatButton, { FlatButtonColor } from 'components/FlatButton'
import TreasurySection from 'components/TreasurySection'
import { useBreakpoints } from 'contexts/Breakpoints'
import useSharedAdventureResult from 'hooks/useSharedAdventureResult'
import { Body } from 'layouts/GameLayout'
import { useTranslation } from 'next-i18next'
import Head from 'next/head'
import { useRef, useState } from 'react'
import styled from 'styled-components/macro'
import AdventureMap from '../../components/AdventureMap'
import OttoList from './OttoList'

const StyledContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  gap: 30px;
`

const StyledMobileContainer = styled.div`
  position: relative;
  width: 100%;
`

const StyledMapSectionMobile = styled.div<{ isSelectedView: boolean }>`
  flex: 1 50%;
  display: ${({ isSelectedView }) => (isSelectedView ? 'block' : 'none')};
`

const StyledMapSection = styled(TreasurySection).attrs({ showRope: false })<{ isSelectedView: boolean }>`
  flex: 1 50%;
`

const StyledListSectionMobile = styled.div<{ isSelectedView: boolean }>`
  display: ${({ isSelectedView }) => (isSelectedView ? 'block' : 'none')};
`

const StyledListSection = styled(TreasurySection).attrs({ showRope: false })<{ isSelectedView: boolean }>`
  position: relative;
  flex: 1 50%;
  background: ${({ theme }) => theme.colors.otterBlack};
`

const StyledSwitcher = styled.div`
  display: flex;
  gap: 5px;
  position: absolute;
  top: 10px;
  right: 30px;
  z-index: 1;
`

const StyledSwitchButton = styled(FlatButton)`
  width: 82px;
`

const StyledDesktopOttoList = styled(OttoList)`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow-y: auto;
`

enum View {
  Map = 'map',
  List = 'list',
}

export default function AdventureView() {
  const [view, setView] = useState(View.Map)
  const { t } = useTranslation('', { keyPrefix: 'adventure' })
  const { isTablet } = useBreakpoints()

  useSharedAdventureResult()

  const head = (
    <Head>
      <title>{t('docTitle')}</title>
      <meta property="og:title" content={t('docTitle')} />
      <meta name="description" content={t('docDesc')} />
      <meta property="og:description" content={t('docDesc')} />
      <meta property="og:image" content="/og.jpg" />
    </Head>
  )

  if (isTablet) {
    return (
      <StyledMobileContainer>
        {head}
        <StyledSwitcher>
          {Object.values(View).map(currView => (
            <StyledSwitchButton
              onClick={() => setView(currView)}
              key={currView}
              color={view === currView ? FlatButtonColor.Yellow : FlatButtonColor.White}
            >
              {t(`viewSwitcher.${currView}`)}
            </StyledSwitchButton>
          ))}
        </StyledSwitcher>

        <StyledMapSectionMobile isSelectedView={view === View.Map}>
          <AdventureMap />
        </StyledMapSectionMobile>

        <StyledListSectionMobile isSelectedView={view === View.List}>
          <OttoList />
        </StyledListSectionMobile>
      </StyledMobileContainer>
    )
  }

  return (
    <Body>
      {head}
      <StyledContainer>
        <StyledMapSection isSelectedView={view === View.Map}>
          <AdventureMap />
        </StyledMapSection>

        <StyledListSection isSelectedView={view === View.List}>
          <StyledDesktopOttoList />
        </StyledListSection>
      </StyledContainer>
    </Body>
  )
}
