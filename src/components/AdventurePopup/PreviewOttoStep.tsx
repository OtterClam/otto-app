import AdventureConditionalBoosts from 'components/AdventureConditionalBoosts'
import AdventureRewards from 'components/AdventureRewards'
import Button from 'components/Button'
import OttoAdventureLevel from 'components/OttoAdventureLevel'
import OttoAttributes from 'components/OttoAttributes'
import OttoLevels from 'components/OttoLevels'
import OttoPreviewer from 'components/OttoPreviewer'
import OttoSelector from 'components/OttoSelector'
import { useOtto, withOtto } from 'contexts/Otto'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { Headline } from 'styles/typography'

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const StyledMain = styled.div`
  display: flex;
  gap: 40px;

  @media ${({ theme }) => theme.breakpoints.tablet} {
    flex-direction: column;
  }
`

const StyledLocation = styled.div`
  flex: 1 50%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: stretch;
`

const StyledPreview = styled.div`
  flex: 1 50%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: stretch;
`

export default withOtto(function PreviewOttoStep() {
  const { otto } = useOtto()
  const { t } = useTranslation()

  return (
    <StyledContainer>
      <OttoSelector />

      <StyledMain>
        <StyledPreview>
          <OttoPreviewer otto={otto} />
          <OttoAdventureLevel boost />
          <OttoAttributes otto={otto} />
          <OttoLevels otto={otto} />
        </StyledPreview>

        <StyledLocation>
          <AdventureConditionalBoosts otto={otto} />
          <AdventureRewards />
        </StyledLocation>
      </StyledMain>

      <Button Typography={Headline}>{t('adventurePopup.start')}</Button>
    </StyledContainer>
  )
})
