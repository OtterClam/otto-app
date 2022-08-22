import { useTransactions } from '@usedapp/core'
import Fullscreen from 'components/Fullscreen'
import OpenItemView from 'components/OpenItem/OpenItemView'
import { OttoBuyTransactionState } from 'contracts/functions'
import { useTranslation } from 'next-i18next'
import React from 'react'
import styled from 'styled-components/macro'
import { ContentLarge } from 'styles/typography'
import NutrientAnimation from 'views/my-items/use-item/NutrientAnimation'

const StyledProcessingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
  background-color: ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;
`

const StyledProcessingText = styled(ContentLarge).attrs({ as: 'p' })`
  text-align: center;
  white-space: pre;
  color: ${({ theme }) => theme.colors.white};
`

function Forging() {
  const { t } = useTranslation('', { keyPrefix: 'foundry.forge' })
  return (
    <Fullscreen show>
      <StyledProcessingContainer>
        <NutrientAnimation />
        <StyledProcessingText>{t('processing')}</StyledProcessingText>
      </StyledProcessingContainer>
    </Fullscreen>
  )
}

interface Props {
  state: OttoBuyTransactionState
  onClose: () => void
}

export default function ForgePopup({ state, onClose }: Props) {
  if (state.state === 'None') {
    return null
  }
  if (state.state === 'Success') {
    return <OpenItemView items={state.receivedItems || []} onClose={onClose} />
  }
  return <Forging />
}
