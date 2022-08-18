import { TransactionStatus } from '@usedapp/core'
import Button from 'components/Button'
import ItemCell from 'components/ItemCell'
import ItemType from 'components/ItemType'
import SectionRope from 'components/SectionRope'
import TreasurySection from 'components/TreasurySection'
import { useBreakpoints } from 'contexts/Breakpoints'
import { useERC1155Approval } from 'contexts/ERC1155Approval'
import { useForge, useSetApprovalForAll } from 'contracts/functions'
import formatDate from 'date-fns/format'
import isAfter from 'date-fns/isAfter'
import isBefore from 'date-fns/isBefore'
import { ForgeFormula } from 'models/Forge'
import { useTranslation } from 'next-i18next'
import { useCallback, useEffect, useMemo } from 'react'
import styled from 'styled-components/macro'
import { ContentExtraSmall, ContentMedium, Display3, Headline, Note } from 'styles/typography'
import ForgePopup from './ForgePopup'
import { MyItemAmounts } from './type'

const StyledContainer = styled.div`
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
`

const StyledTitle = styled(Display3)`
  text-align: center;
`

const StyledDesc = styled(ContentMedium)`
  text-align: center;
`

const StyledDetails = styled.div`
  display: flex;
  position: relative;
  z-index: 0;
  width: 100%;

  @media ${({ theme }) => theme.breakpoints.tablet} {
    flex-direction: column;
  }
`

const StyledResult = styled(TreasurySection).attrs({ showRope: false })`
  flex: 0 300px;
  display: flex;
  gap: 10px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 300px;
  min-width: 300px;
  background: ${({ theme }) => theme.colors.darkGray400};
  min-height: 300px;

  @media ${({ theme }) => theme.breakpoints.tablet} {
    flex: 0 1 318px;
    padding: 10px;
    min-height: 318px;
    max-width: unset;
    min-width: unset;
  }
`

const StyledResultItemPreview = styled(ItemCell)`
  width: 180px;
  height: 180px;
`

const StyledItemType = styled(ItemType)`
  color: ${({ theme }) => theme.colors.crownYellow};

  &::before {
    width: 24px;
    height: 24px;
  }
`

const StyledMaterials = styled(TreasurySection)`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: ${({ theme }) => theme.colors.darkGray400};
  padding: 34px 74px;
`

const StyledMaterialPreview = styled(ItemCell)`
  width: 100px;
  height: 100px;
`

const StyledMaterialList = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
`

const StyledMaterialListItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
`

const StyledMaterialName = styled(Note)`
  color: ${({ theme }) => theme.colors.white};
`

const StyledCount = styled(Note)`
  background: ${({ theme }) => theme.colors.otterBlack};
  border-radius: 14px;
  padding: 5px 10px;
`

const StyledAvailableTime = styled(ContentExtraSmall)`
  text-align: center;
`

const StyledSectionRope = styled(SectionRope)`
  position: relative;
  z-index: -1;
`

export interface ForgeItemProps {
  formula: ForgeFormula
  itemAmounts: MyItemAmounts
  refetchMyItems: () => void
}

const TIME_FORMAT = 'LLL dd H:mm a'

const useAvailableCount = (formula: ForgeFormula, itemCounts: MyItemAmounts): number => {
  return useMemo(() => {
    return Math.floor(
      Math.min(
        ...formula.materials.map((material, index) => {
          const requiredAmount = formula.amounts[index]
          return (itemCounts[material.id] ?? 0) / requiredAmount
        })
      )
    )
  }, [formula, itemCounts])
}

const isProcessing = (state: TransactionStatus) => state.status === 'PendingSignature' || state.status === 'Mining'

export default function ForgeItem({ formula, itemAmounts: itemCounts, refetchMyItems }: ForgeItemProps) {
  const { t } = useTranslation('', { keyPrefix: 'foundry' })
  const startTime = formatDate(formula.startTime, TIME_FORMAT)
  const endTime = formatDate(formula.endTime, TIME_FORMAT)
  const timeZone = formatDate(new Date(), 'z')
  const { isTablet } = useBreakpoints()
  const { forgeState, forge, resetForge } = useForge()
  const availableCount = useAvailableCount(formula, itemCounts)
  const now = new Date()
  const disabled = availableCount === 0 || isBefore(now, formula.startTime) || isAfter(now, formula.endTime)
  const { isApprovedForAll, updateApprovalStatus, erc1155, operator: forgeContractAddress } = useERC1155Approval() || {}
  const { state: setApprovalState, send: sendSetApprovalCall } = useSetApprovalForAll(erc1155?.address || '')
  const approving = isProcessing(setApprovalState)
  const forging = isProcessing(forgeState.status)
  const processing = approving || forging

  const callForge = useCallback(() => {
    if (!isApprovedForAll && forgeContractAddress) {
      sendSetApprovalCall(forgeContractAddress, true, {})
      return
    }
    forge(formula.id, 1)
  }, [isApprovedForAll, forgeContractAddress, forge, formula.id, sendSetApprovalCall])

  useEffect(() => {
    if (setApprovalState.status === 'Success') {
      updateApprovalStatus?.()
    }
  }, [setApprovalState, updateApprovalStatus])

  useEffect(() => {
    if (forgeState.state === 'Exception' || forgeState.state === 'Fail') {
      window.alert(forgeState.status.errorMessage)
      resetForge()
    }
  }, [forgeState, resetForge])

  return (
    <StyledContainer>
      <StyledTitle>{formula.title}</StyledTitle>
      <StyledDesc>{formula.description}</StyledDesc>
      <StyledDetails>
        <StyledResult>
          <Headline>{t('result.title')}</Headline>
          <StyledResultItemPreview item={formula.result} />
          <ContentMedium>{formula.result.name}</ContentMedium>
          <StyledItemType type={formula.result.type} />
        </StyledResult>
        <StyledSectionRope vertical={!isTablet} />
        <StyledMaterials showRope={false}>
          <Headline>{t('materials.title')}</Headline>
          <StyledMaterialList>
            {formula.materials.map((material, index) => (
              <StyledMaterialListItem key={index}>
                <StyledMaterialPreview item={material} />
                <StyledMaterialName>{material.name}</StyledMaterialName>
                <StyledCount>
                  {itemCounts[material.id] ?? 0} / {formula.amounts[index]}
                </StyledCount>
              </StyledMaterialListItem>
            ))}
          </StyledMaterialList>
          <Button loading={processing} height="60px" disabled={disabled} Typography={Headline} onClick={callForge}>
            {t(isBefore(now, formula.startTime) ? 'comingSoon' : isApprovedForAll ? 'forgeButton' : 'approve')}
          </Button>
          <StyledAvailableTime>{t('forgeAvailableTime', { startTime, endTime, timeZone })}</StyledAvailableTime>
        </StyledMaterials>
      </StyledDetails>
      <ForgePopup state={forgeState} onClose={() => resetForge()} />
    </StyledContainer>
  )
}
