import dynamic from 'next/dynamic'
import Button from 'components/Button'
import { useClaimGiveaway } from 'contracts/functions'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { ContentLarge, Headline } from 'styles/typography'
import ArrowDown from './arrow-down.svg'
import ConnectStep from './ConnectStep'
import DiscordStep from './DiscordStep'
import Draw from './draw.png'
import BottomLeftDraw from './draw-bottom-left.jpg'
import BottomRightDraw from './draw-bottom-right.jpg'
import InvitationCodeStep, { SuccessResponse } from './InvitationCodeStep'
import TwitterStep from './TwitterStep'

const GiveawayPopup = dynamic(() => import('../GiveawayPopup'), { ssr: false })

const StyledSteps = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const StyledDrawing = styled.img.attrs({ src: Draw.src })`
  width: 178px;
  height: 115px;
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 1;
  @media ${({ theme }) => theme.breakpoints.mobile} {
    display: none;
  }
`

const StyledBottomLeftDrawing = styled.img.attrs({ src: BottomLeftDraw.src })`
  width: 153px;
  height: 97px;
  position: absolute;
  bottom: 5px;
  left: 5px;
  z-index: 1;
  border-bottom-left-radius: 10px;
`

const StyledBottomRightDrawing = styled.img.attrs({ src: BottomRightDraw.src })`
  width: 151px;
  height: 65px;
  position: absolute;
  bottom: 5px;
  right: 5px;
  z-index: 1;
  border-bottom-right-radius: 10px;
`

const StyledHeadline = styled(ContentLarge).attrs({ as: 'h2' })`
  margin-bottom: 20px;
  z-index: 2;
`

const StyledStepContainer = styled.div`
  width: 100%;
  position: relative;
  z-index: 2;
`

const StyledArrowDown = styled.img.attrs({ src: ArrowDown.src })`
  width: 30px;
  height: 15px;
  margin: 10px 0;
`

const StyledCompleteButton = styled(Button)`
  position: relative;
  z-index: 2;
`

enum Steps {
  ConnectWallet = 0,
  FollowTwitter,
  JoinDiscord,
  InputInvitationCode,
  Completed,
}

export default function GiveawaySteps() {
  const { t } = useTranslation('', { keyPrefix: 'giveaway.steps' })
  const [giveawayData, setGiveawayData] = useState<SuccessResponse | null>(null)
  const [step, setStep] = useState(Steps.ConnectWallet)
  const { claimState, claim, resetClaim } = useClaimGiveaway()
  const stepsRef = useRef<HTMLDivElement>(null)
  const onClaim = () => {
    if (giveawayData) {
      claim({ itemId: giveawayData?.item_id, ...giveawayData })
    }
  }
  useEffect(() => {
    if (claimState.status === 'Exception' || claimState.status === 'Fail') {
      window.alert(claimState.errorMessage)
      resetClaim()
    }
  }, [claimState, resetClaim])
  useEffect(() => {
    if (step === Steps.JoinDiscord || step === Steps.InputInvitationCode) {
      stepsRef.current?.scrollIntoView()
    }
  }, [step])
  return (
    <StyledSteps ref={stepsRef}>
      <StyledDrawing />
      <StyledBottomLeftDrawing />
      <StyledBottomRightDrawing />
      <StyledHeadline>{t('headline')}</StyledHeadline>
      <StyledStepContainer>
        <ConnectStep onComplete={() => setStep(prev => (prev === Steps.ConnectWallet ? Steps.FollowTwitter : prev))} />
      </StyledStepContainer>
      <StyledArrowDown />
      <StyledStepContainer>
        <TwitterStep
          locked={step < Steps.FollowTwitter}
          onComplete={() => setStep(prev => (prev === Steps.FollowTwitter ? Steps.JoinDiscord : prev))}
        />
      </StyledStepContainer>
      <StyledArrowDown />
      <StyledStepContainer>
        <DiscordStep
          locked={step < Steps.JoinDiscord}
          onComplete={() => setStep(prev => (prev === Steps.JoinDiscord ? Steps.InputInvitationCode : prev))}
        />
      </StyledStepContainer>
      <StyledArrowDown />
      <StyledStepContainer>
        <InvitationCodeStep
          locked={step < Steps.InputInvitationCode}
          onComplete={data => {
            setGiveawayData(data)
            setStep(prev => (prev === Steps.InputInvitationCode ? Steps.Completed : prev))
          }}
        />
      </StyledStepContainer>
      <StyledArrowDown />
      <StyledCompleteButton
        Typography={Headline}
        width="fit-content"
        disabled={step !== Steps.Completed}
        onClick={onClaim}
      >
        {step === Steps.Completed ? t('claim') : t('complete', { count: step })}
      </StyledCompleteButton>
      {claimState.status !== 'None' && (
        <GiveawayPopup status={claimState.status === 'Success' ? 'success' : 'loading'} />
      )}
    </StyledSteps>
  )
}
