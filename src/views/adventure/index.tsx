import FlatButton, { FlatButtonColor } from 'components/FlatButton'
import TreasurySection from 'components/TreasurySection'
import { useAdventureLocations } from 'contexts/AdventureLocations'
import { useBreakpoints } from 'contexts/Breakpoints'
import useBrowserLayoutEffect from 'hooks/useBrowserLayoutEffect'
import { Body } from 'layouts/GameLayout'
import { useTranslation } from 'next-i18next'
import { useMemo, useRef, useState } from 'react'
import styled from 'styled-components/macro'
import AdventureMap from '../../components/AdventureMap'
import OttoList from './OttoList'

const StyledContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  gap: 30px;
`

const StyledMapSectionMobile = styled.div<{ isSelectedView: boolean }>`
  flex: 1 50%;
  display: ${({ isSelectedView }) => (isSelectedView ? 'block' : 'none')};
`

const StyledMapSection = styled(TreasurySection).attrs({ showRope: false })<{ isSelectedView: boolean }>`
  flex: 1 50%;
`

const StyledListSectionMobile = styled.div<{ isSelectedView: boolean }>`
  flex: 1 50%;
  display: ${({ isSelectedView }) => (isSelectedView ? 'block' : 'none')};
`

const StyledListSection = styled(TreasurySection).attrs({ showRope: false })<{ isSelectedView: boolean }>`
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

enum View {
  Map = 'map',
  List = 'list',
}

export default function AdventureView() {
  const map = useRef<HTMLDivElement>(null)
  const [view, setView] = useState(View.Map)
  const { t } = useTranslation('', { keyPrefix: 'adventure' })
  const { isTablet } = useBreakpoints()
  const [maxHeight, setMaxHeight] = useState(0)

  useBrowserLayoutEffect(() => {
    if (!map.current) {
      return
    }
    const rect = map.current.getBoundingClientRect()
    setMaxHeight(rect.height)
  }, [map.current])

  if (isTablet) {
    return (
      <StyledContainer>
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
      </StyledContainer>
    )
  }

  return (
    <Body>
      <StyledContainer>
        <StyledMapSection isSelectedView={view === View.Map}>
          <AdventureMap ref={map} />
        </StyledMapSection>

        <StyledListSection isSelectedView={view === View.List}>
          <OttoList maxHeight={maxHeight} />
        </StyledListSection>
      </StyledContainer>
    </Body>
  )
}
