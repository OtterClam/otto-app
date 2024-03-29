import { TransactionStatus } from '@usedapp/core'
import ItemCell from 'components/ItemCell'
import ItemType from 'components/ItemType'
import PaymentButton from 'components/PaymentButton'
import SectionRope from 'components/SectionRope'
import TreasurySection from 'components/TreasurySection'
import { getOpenSeaItemLink, Token } from 'constant'
import { useBreakpoints } from 'contexts/Breakpoints'
import { useERC1155Approval } from 'contexts/ERC1155Approval'
import { useForge, useSetApprovalForAll } from 'contracts/functions'
import formatDate from 'date-fns/format'
import isAfter from 'date-fns/isAfter'
import isBefore from 'date-fns/isBefore'
import { useTokenInfo } from 'hooks/token-info'
import useContractAddresses from 'hooks/useContractAddresses'
import { ForgeFormula } from 'models/Forge'
import { useTranslation } from 'next-i18next'
import { useCallback, useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import styled from 'styled-components/macro'
import {
  ContentExtraSmall,
  ContentSmall,
  ContentMedium,
  Display3,
  Headline,
  Note,
  RegularInput,
} from 'styles/typography'
import ForgePopup from './ForgePopup'
import { MyItemAmounts } from './type'

const StyledContainer = styled.div<{ leftImage: string; rightImage: string }>`
  padding-top: 50px;
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  background: url(${({ leftImage }) => leftImage}) left top / 20% auto no-repeat,
    url(${({ rightImage }) => rightImage}) right top / 20% auto no-repeat;

  @media ${({ theme }) => theme.breakpoints.tablet} {
    background-position: left 50px, right 50px;
  }
`

const StyledTitle = styled(Display3)`
  text-align: center;
  margin: 0 20% 0 20%;
`

const StyledDesc = styled(ContentMedium)`
  text-align: center;
  a {
    color: ${({ theme }) => theme.colors.crownYellow};
  }
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

const StyledResult = styled(TreasurySection).attrs({ showRope: false })<{ bgImage: string }>`
  flex: 0 300px;
  display: flex;
  gap: 10px;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
  max-width: 300px;
  min-width: 300px;
  background: center / cover url(${({ bgImage }) => bgImage});
  background-color: ${({ theme }) => theme.colors.darkGray400};
  min-height: 300px;
  z-index: 0;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: -1;
  }

  @media ${({ theme }) => theme.breakpoints.tablet} {
    flex: 0 1 318px;
    padding: 10px;
    min-height: 318px;
    max-width: unset;
    min-width: unset;
  }
`

const StyledResultItemPreview = styled(ItemCell).attrs({ size: 180 })`
  width: 180px;
  height: 180px;
`

const StyledResultPreviewImg = styled.img`
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

  @media ${({ theme }) => theme.breakpoints.tablet} {
    padding: 30px 10px;
  }
`

const StyledMaterialPreview = styled(ItemCell).attrs({ size: 100 })`
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

const StyledMaterialSectionTitle = styled(Headline)`
  @media ${({ theme }) => theme.breakpoints.tablet} {
    text-align: center;
  }
`

const StyledForgeAmountTitle = styled(ContentSmall)`
  @media ${({ theme }) => theme.breakpoints.tablet} {
    text-align: center;
  }
`

const StyledInputContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
`

const StyledInput = styled(RegularInput)`
  width: 100px;
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;
  padding: 10px;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;

  ::placeholder {
    color: ${({ theme }) => theme.colors.lightGray400};
    opacity: 1;
  }
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
          const requiredAmount = formula.materialAmounts[index]
          return (itemCounts[material.tokenId] ?? 0) / requiredAmount
        })
      )
    )
  }, [formula, itemCounts])
}

const isProcessing = (state: TransactionStatus) => state.status === 'PendingSignature' || state.status === 'Mining'

enum ForgeItemState {
  WaitingClick,
  WaitingApprove,
  WaitingForge,
}

export default function ForgeItem({ formula, itemAmounts: itemCounts, refetchMyItems }: ForgeItemProps) {
  const { FISH } = useTokenInfo()
  const { FOUNDRY } = useContractAddresses()
  const { t } = useTranslation('')
  const startTime = formatDate(formula.startTime, TIME_FORMAT)
  const endTime = formatDate(formula.endTime, TIME_FORMAT)
  const timeZone = formatDate(new Date(), 'z')
  const { isTablet } = useBreakpoints()
  const { forgeState, forge, resetForge } = useForge()
  const [numFusion, setNumFusion] = useState(1)
  const availableCount = useAvailableCount(formula, itemCounts)
  const now = new Date()
  const disabled =
    availableCount < numFusion || isBefore(now, formula.startTime) || isAfter(now, formula.endTime) || numFusion <= 0
  const { isApprovedForAll, updateApprovalStatus, erc1155, operator: forgeContractAddress } = useERC1155Approval() || {}
  const { state: setApprovalState, send: sendSetApprovalCall } = useSetApprovalForAll(erc1155?.address || '')
  const approving = isProcessing(setApprovalState)
  const [forgeItemState, setForgeItemState] = useState(ForgeItemState.WaitingClick)
  const forging = isProcessing(forgeState.status)
  const processing = approving || forging

  const callForge = useCallback(() => {
    if (!isApprovedForAll && forgeContractAddress && forgeItemState !== ForgeItemState.WaitingApprove) {
      setForgeItemState(ForgeItemState.WaitingApprove)
      sendSetApprovalCall(forgeContractAddress, true, {})
      return
    }
    if (forgeItemState !== ForgeItemState.WaitingForge) {
      setForgeItemState(ForgeItemState.WaitingForge)
      forge(formula.id, numFusion)
    }
  }, [isApprovedForAll, forgeContractAddress, forge, formula.id, sendSetApprovalCall, numFusion, forgeItemState])

  useEffect(() => {
    if (setApprovalState.status === 'Success') {
      updateApprovalStatus?.()
    }
  }, [setApprovalState, updateApprovalStatus])

  useEffect(() => {
    if (forgeItemState === ForgeItemState.WaitingApprove && isApprovedForAll) {
      callForge()
    }
  }, [forgeItemState, isApprovedForAll, callForge])

  useEffect(() => {
    if (forgeState.state === 'Exception' || forgeState.state === 'Fail') {
      window.alert(forgeState.status.errorMessage)
      resetForge()
      setForgeItemState(ForgeItemState.WaitingClick)
    } else if (forgeState.state === 'Success') {
      setForgeItemState(ForgeItemState.WaitingClick)
    }
    // TODO: On forge success refetch items but after API has picked up tx
  }, [forgeState, resetForge])

  return (
    <StyledContainer leftImage={formula.leftImage} rightImage={formula.rightImage}>
      <StyledTitle>{formula.title}</StyledTitle>
      <StyledDesc>
        <ReactMarkdown>{formula.description}</ReactMarkdown>
      </StyledDesc>
      <StyledDetails>
        <StyledResult bgImage={formula.bgImage}>
          <Headline>{t('foundry.result.title')}</Headline>
          {formula.result && (
            <>
              <StyledResultItemPreview metadata={formula.result} showDetailsPopup />
              <ContentMedium>{formula.result.name}</ContentMedium>
              <StyledItemType type={formula.result.type} />
            </>
          )}
          {!formula.result && (
            <>
              <StyledResultPreviewImg src={formula.resultImage} />
              <ContentMedium>{formula.resultText}</ContentMedium>
            </>
          )}
        </StyledResult>
        <StyledSectionRope vertical={!isTablet} />
        <StyledMaterials showRope={false}>
          <StyledMaterialSectionTitle>{t('foundry.materials.title')}</StyledMaterialSectionTitle>
          <StyledMaterialList>
            {formula.materials.map((material, index) => (
              <StyledMaterialListItem key={index}>
                <a href={getOpenSeaItemLink(material.tokenId)} target="_blank" rel="noreferrer">
                  <StyledMaterialPreview metadata={material} />
                </a>
                <StyledMaterialName>{material.name}</StyledMaterialName>
                <StyledCount>
                  {itemCounts[material.tokenId] ?? 0} / {formula.materialAmounts[index]}
                </StyledCount>
              </StyledMaterialListItem>
            ))}
          </StyledMaterialList>
          <StyledInputContainer>
            <StyledForgeAmountTitle>{t('my_items.transfer.amount')}:</StyledForgeAmountTitle>
            <StyledInput
              disabled={processing}
              type="number"
              min={1}
              value={numFusion}
              onChange={e => setNumFusion(Number(e.target.value))}
            />
          </StyledInputContainer>
          <PaymentButton
            spenderAddress={FOUNDRY}
            token={FISH}
            amount={formula.fish.mul(numFusion)}
            loading={processing}
            disabled={disabled}
            padding="5px 0"
            Typography={Headline}
            showSymbol
            onSuccess={callForge}
            onClick={callForge}
          >
            {t(
              isBefore(now, formula.startTime)
                ? 'foundry.comingSoon'
                : availableCount < numFusion
                ? 'foundry.forgeButton_insufficient'
                : isApprovedForAll
                ? 'foundry.forgeButton'
                : 'foundry.approve'
            )}
          </PaymentButton>
          <StyledAvailableTime>{t('foundry.forgeAvailableTime', { startTime, endTime, timeZone })}</StyledAvailableTime>
        </StyledMaterials>
      </StyledDetails>
      <ForgePopup state={forgeState} onClose={() => resetForge()} />
    </StyledContainer>
  )
}
