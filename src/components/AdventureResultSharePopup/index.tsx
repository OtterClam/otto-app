import AdventureFullscreen from 'components/AdventureFullscreen'
import CopyButton from 'components/CopyButton'
import { AdventureUIActionType, useAdventureUIState } from 'contexts/AdventureUIState'
import { AdventureResult } from 'models/AdventureResult'
import { useTranslation } from 'next-i18next'
import { useCallback } from 'react'
import styled from 'styled-components'
import { Caption, ContentMedium, Note } from 'styles/typography'

const StyledPopup = styled(AdventureFullscreen)`
  width: auto !important;
  background: ${({ theme }) => theme.colors.white} !important;
`

const StyledContainer = styled.div`
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
`

const StyledTitle = styled(ContentMedium)`
  text-align: center;
  margin: 10px 0 12px;
`

const StyledImage = styled.div<{ src: string }>`
  position: relative;
  border-radius: 10px;
  background: center / cover url(${({ src }) => src});

  &::before {
    content: '';
    display: block;
    padding-bottom: 52.2033898%;
  }
`

const StyledUrl = styled(Caption).attrs({ as: 'div' })`
  display: flex;
  gap: 5px;
  background: ${({ theme }) => theme.colors.lightGray200} !important;
  align-items: center;
  border-radius: 10px;
  padding: 5px 5px 5px 10px;
`

const StyledUrlText = styled.span`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

export default function AdventureResultSharePopup({
  result,
  tx,
  ottoId,
  locationId,
}: {
  result: AdventureResult
  tx: string
  ottoId: string
  locationId: string
}) {
  const { t } = useTranslation('', { keyPrefix: 'adventureSharePopup' })
  const {
    dispatch,
    state: { showSharePopup },
  } = useAdventureUIState()

  const url = `${location.origin}/?adventure_tx=${tx}&otto=${ottoId}&location=${locationId}`
  const close = useCallback(() => {
    dispatch({ type: AdventureUIActionType.CloseSharePopup })
  }, [])

  return (
    <StyledPopup width="auto" show={showSharePopup} onRequestClose={close}>
      <StyledContainer>
        <StyledTitle>{t('title')}</StyledTitle>
        <StyledImage src={result.image} />
        <StyledUrl>
          <StyledUrlText>{url}</StyledUrlText>
          <CopyButton padding="0 12px 0 12px" primaryColor="white" Typography={ContentMedium} value={url} />{' '}
        </StyledUrl>
        <Note>{t('desc')}</Note>
      </StyledContainer>
    </StyledPopup>
  )
}
