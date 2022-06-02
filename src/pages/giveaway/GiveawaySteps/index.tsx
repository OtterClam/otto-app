import Button from 'components/Button'
import { useClaimGiveaway } from 'contracts/functions'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'
import { ContentLarge, Headline } from 'styles/typography'
import ArrowDown from './arrow-down.svg'
import ConnectStep from './ConnectStep'
import DiscordStep from './DiscordStep'
import Draw from './draw.png'
import InvitationCodeStep, { SuccessResponse } from './InvitationCodeStep'
import TwitterStep from './TwitterStep'

const StyledSteps = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const StyledDrawing = styled.img.attrs({ src: Draw })`
  width: 178px;
  height: 115px;
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 1;
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

const StyledArrowDown = styled.img.attrs({ src: ArrowDown })`
  width: 30px;
  height: 15px;
  margin: 10px 0;
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
  const onClaim = () => {
    if (giveawayData) {
      claim({ itemId: giveawayData?.item_id, ...giveawayData })
    }
  }
  return (
    <StyledSteps>
      <StyledDrawing />
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
      <Button width="fit-content" disabled={step !== Steps.Completed} onClick={onClaim}>
        <Headline>{step === Steps.Completed ? t('claim') : t('complete', { count: step })}</Headline>
      </Button>
    </StyledSteps>
  )
}
