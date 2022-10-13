import FlatButton, { FlatButtonColor } from 'components/FlatButton'
import TreasurySection from 'components/TreasurySection'
import { useAdventureLocations } from 'contexts/AdventureLocations'
import { useBreakpoints } from 'contexts/Breakpoints'
import usePreloadImages from 'hooks/usePreloadImage'
import { Body } from 'layouts/GameLayout'
import { useTranslation } from 'next-i18next'
import { useMemo, useState } from 'react'
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

const usePreloadLocationImages = () => {
  const { locations } = useAdventureLocations()

  const images = useMemo(() => {
    const images: string[] = []
    locations.forEach(location => {
      images.push(location.image)
      images.push(location.bgImage)
      images.push(location.bgImageBlack)
    })
    return images
  }, [locations])

  usePreloadImages(images)
}

export default function AdventureView() {
  const [view, setView] = useState(View.Map)
  const { t } = useTranslation('', { keyPrefix: 'adventure' })
  const { isTablet } = useBreakpoints()

  usePreloadLocationImages()

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
          <AdventureMap />
        </StyledMapSection>

        <StyledListSection isSelectedView={view === View.List}>
          <OttoList />
        </StyledListSection>
      </StyledContainer>
    </Body>
  )
}
