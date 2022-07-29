import bg from 'assets/dice-of-destiny-bg.jpg'
import bad from 'assets/dice-result-bad.png'
import good from 'assets/dice-result-good.png'
import question from 'assets/dice-result-question.png'
import hell from 'assets/hell.png'
import rankingBadge from 'assets/ranking.png'
import skull from 'assets/skull.png'
import Button from 'components/Button'
import CloseButton from 'components/CloseButton'
import DiceLoading from 'components/DiceLoading'
import Fullscreen from 'components/Fullscreen'
import MarkdownWithHtml from 'components/MarkdownWithHtml'
import PaymentButton from 'components/PaymentButton'
import { Question } from 'components/Question'
import RibbonText from 'components/RibbonText'
import { Token } from 'constant'
import { numberWithDirection, numberWithSign } from 'helpers/number'
import useAudio from 'hooks/useAudio'
import useContractAddresses from 'hooks/useContractAddresses'
import { DiceRoller, State, useDiceRoller } from 'hooks/useDiceRoller'
import { EventType } from 'models/Dice'
import Otto from 'models/Otto'
import { FC, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { hideDicePopup, selectOttoInTheHell } from 'store/uiSlice'
import styled, { keyframes, useTheme } from 'styled-components/macro'
import { ContentExtraSmall, ContentLarge, ContentMedium, ContentSmall, Display3, Headline } from 'styles/typography'
import StyledRichContent from './RichContent'

const rollingDiceAudioSrc = '/audio/rolling_dice.mp3'
const rolledAudioSrc = '/audio/rolled.mp3'

const zoomInUp = keyframes`
  from {
    opacity: 0;
    transform: scale3d(0.1, 0.1, 0.1) translate3d(0, 1000px, 0);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }

  60% {
    opacity: 1;
    transform: scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0);
    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
  }
`

const StyledHellImage = styled.div`
  background: no-repeat center center / 180px 180px url(${hell.src});
  height: 180px;
  width: 180px;
`

const StyledContainer = styled.div`
  padding: 35px 75px;
  color: ${props => props.theme.colors.white};
  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding: 25px 45px;
  }
`

const StyledIntroStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`

const StyledIntroTitle = styled(Display3)`
  display: block;
  text-align: center;
  margin-bottom: 20px;
`

const StyledIntroCallToAction = styled(ContentMedium.withComponent('p'))`
  margin: 20px 0 20px;
`

const StyledSkullImage = styled.img`
  width: 36px;
  height: 36px;
`

const StyledCloseButton = styled(CloseButton)`
  position: absolute;
  top: 20px;
  right: 20px;
`

const StyledProcessingContent = styled(ContentLarge)`
  text-align: center;
`

const StyledProcessingContentInner = styled(MarkdownWithHtml)`
  text-align: center;
`

const StyledProcessingStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 94px 0 146px;
`

const StyledResultStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`

const StyledResultTitleInner = styled(MarkdownWithHtml)`
  text-align: center;
`

interface StyledResultImageProps {
  background: string
}

const StyledResultImage = styled.div<StyledResultImageProps>`
  width: 420px;
  height: 420px;
  background: no-repeat center / cover url(${props => props.background});
  animation: ${zoomInUp} 1.5s;
`

const StyledResultEffect = styled.span`
  display: flex;
  align-items: center;
`

const StyledRankingBadge = styled.span`
  display: inline-block;
  width: 24px;
  height: 24px;
  background: center / cover url(${rankingBadge.src});
  margin-right: 5px;
`

const StyledRibbonText = styled(RibbonText)`
  margin-top: -162px;
  animation: ${zoomInUp} 2s;
`

const StyledIntroDesc = styled(StyledRichContent)`
  strong {
    color: ${props => props.theme.colors.crownYellow};
  }

  a {
    color: ${props => props.theme.colors.seaweedGreen};
  }
`

interface StyledEventEffectProps {
  image: string
}

const StyledEventEffect = styled.div<StyledEventEffectProps>`
  display: flex;
  align-items: center;
  margin-top: 66px;

  &:before {
    flex: 0 64px;
    display: block;
    content: '';
    background: center / cover url(${props => props.image});
    width: 64px;
    height: 64px;
    border: 2px ${props => props.theme.colors.otterBlack} solid;
    box-sizing: border-box;
    border-radius: 2px;
    margin-right: 10px;

    @media ${({ theme }) => theme.breakpoints.mobile} {
      margin: 0 0 10px;
    }
  }

  @media ${({ theme }) => theme.breakpoints.mobile} {
    flex-direction: column;
  }
`

interface StyledEventEffectContentProps {
  eventType: string
}

const StyledEventEffectContent = styled(ContentExtraSmall)<StyledEventEffectContentProps>`
  display: flex;
  flex-direction: column;
  text-align: left;

  strong {
    ${props => props.eventType === 'good' && `color: ${props.theme.colors.seaweedGreen}`}
    ${props => props.eventType === 'bad' && `color: ${props.theme.colors.clamPink}`}
  }

  @media ${({ theme }) => theme.breakpoints.mobile} {
    text-align: center;
  }
`

const StyledEventDesc = styled(ContentSmall)`
  margin: 20px 0 10px;
`

const StyledQuestionContent = styled(MarkdownWithHtml)`
  text-align: center;
  margin-bottom: 20px;
`

const StyledFullscreenContainer = styled.div`
  border-radius: 10px;
`

interface StateProps {
  otto: Otto
  diceRoller: DiceRoller
}

function IntroState({ diceRoller, otto }: StateProps) {
  const { OTTO_HELL_DICE_ROLLER } = useContractAddresses()
  const { t } = useTranslation()

  return (
    <StyledIntroStateContainer>
      <StyledHellImage />
      <StyledIntroTitle>{t('dice_popup.intro.title')}</StyledIntroTitle>
      <ContentExtraSmall>
        <StyledIntroDesc>
          <MarkdownWithHtml>{t('dice_popup.intro.description')}</MarkdownWithHtml>
        </StyledIntroDesc>
      </ContentExtraSmall>
      <StyledSkullImage src={skull.src} />
      <StyledIntroCallToAction>{t('dice_popup.intro.call_to_action')}</StyledIntroCallToAction>
      <PaymentButton
        padding="6px 12px 3px"
        spenderAddress={OTTO_HELL_DICE_ROLLER}
        Typography={Headline}
        token={Token.Clam}
        disabled={!diceRoller.product?.price || diceRoller.loading}
        amount={diceRoller.product?.price ?? '0'}
        onClick={diceRoller.rollTheDice}
      >
        {t('dice_popup.intro.start_button')}
      </PaymentButton>
    </StyledIntroStateContainer>
  )
}

function ProcessingState({ diceRoller, otto }: StateProps) {
  const { t } = useTranslation()
  const rollingDiceAudio = useAudio(rollingDiceAudioSrc)

  useEffect(() => {
    rollingDiceAudio.audio.loop = true
    rollingDiceAudio.audio.play()
    return () => rollingDiceAudio.audio.pause()
  }, [rollingDiceAudio])

  return (
    <StyledProcessingStateContainer>
      <DiceLoading />
      <StyledProcessingContent>
        <StyledProcessingContentInner>{t('dice_popup.processing.content')}</StyledProcessingContentInner>
      </StyledProcessingContent>
    </StyledProcessingStateContainer>
  )
}

function ResultState({ diceRoller, otto }: StateProps) {
  const { t } = useTranslation()
  const { OTTOPIA_STORE } = useContractAddresses()
  const rolledAudio = useAudio(rolledAudioSrc)
  const eventIndex = diceRoller.state === State.FirstResult ? 0 : 1
  const event = diceRoller.dice?.events[eventIndex] ?? { event: '', image: '', type: EventType.Good }
  const bg = {
    [EventType.Good]: good.src,
    [EventType.Bad]: bad.src,
    [EventType.Question]: question.src,
  }[event.type]
  const ranking =
    // current ranking + effect of the previous event
    otto.ranking + (eventIndex === 1 ? diceRoller.dice?.events[0].effects?.ranking ?? 0 : 0) * -1

  const answerQuestion = (optionIndex: number) => diceRoller.answerQuestion(eventIndex, optionIndex)

  useEffect(() => {
    if (diceRoller.state === State.FirstResult) {
      rolledAudio.audio.play()
    }
  }, [diceRoller.state, rolledAudio])

  return (
    <StyledResultStateContainer>
      <Headline>
        <StyledResultTitleInner>{t('dice_popup.result.title', { index: eventIndex + 1 })}</StyledResultTitleInner>
        {event.response && event.answer !== undefined && (
          <>
            <StyledResultTitleInner>
              {t('dice_popup.result.answer', { answer: (event.options ?? [])[event.answer] })}
            </StyledResultTitleInner>
            <StyledResultTitleInner>{event.response}</StyledResultTitleInner>
          </>
        )}
        {!event.response && <StyledResultTitleInner>{event.event}</StyledResultTitleInner>}
      </Headline>
      <StyledResultImage key={diceRoller.state} background={event.response ? bg : event.image} />
      {event.effects && (
        <StyledRibbonText key={diceRoller.state} Typography={ContentExtraSmall}>
          BRS {numberWithSign(event.effects.brs)}
        </StyledRibbonText>
      )}
      {event.type !== EventType.Question && event.effects && (
        <>
          <StyledEventEffect image={otto.image}>
            <StyledEventEffectContent eventType={event.type}>
              <MarkdownWithHtml>
                {t('dice_popup.result.result.rarity_score', {
                  score: otto.baseRarityScore,
                  effect: numberWithSign(event.effects.brs),
                })}
              </MarkdownWithHtml>
              <StyledResultEffect>
                <StyledRankingBadge />
                <MarkdownWithHtml>
                  {t('dice_popup.result.result.ranking', {
                    ranking,
                    effect: numberWithDirection(event.effects.ranking),
                  })}
                </MarkdownWithHtml>
              </StyledResultEffect>
            </StyledEventEffectContent>
          </StyledEventEffect>
          <StyledEventDesc>
            <MarkdownWithHtml>{t(`dice_popup.result.description.${event.type}`)}</MarkdownWithHtml>
          </StyledEventDesc>
          {diceRoller.state === State.FirstResult && (
            <Button padding="6px 48px" Typography={Headline} onClick={diceRoller.nextEvent}>
              {t('dice_popup.result.next_button')}
            </Button>
          )}
          {diceRoller.state === State.SecondResult && (
            <PaymentButton
              padding="6px 12px 3px"
              spenderAddress={OTTOPIA_STORE}
              Typography={Headline}
              token={Token.Clam}
              disabled={!diceRoller.product?.price}
              amount={diceRoller.product?.price ?? '0'}
              onClick={diceRoller.rollTheDice}
            >
              {t('dice_popup.play_again_button')}
            </PaymentButton>
          )}
        </>
      )}
      {event.type === EventType.Question && (
        <Question options={event.options ?? []} onChange={answerQuestion}>
          <ContentLarge>
            <StyledQuestionContent>{event.question ?? ''}</StyledQuestionContent>
          </ContentLarge>
        </Question>
      )}
    </StyledResultStateContainer>
  )
}

const stateView: { [key: string]: FC<StateProps> } = {
  [State.Intro]: IntroState,
  [State.Processing]: ProcessingState,
  [State.FirstResult]: ResultState,
  [State.SecondResult]: ResultState,
}

export function DicePopup() {
  const theme = useTheme()
  const otto = useSelector(selectOttoInTheHell)
  const diceRoller = useDiceRoller(otto)
  const StateView = stateView[diceRoller.state]
  const dispatch = useDispatch()
  const close = () => {
    diceRoller.reset()
    dispatch(hideDicePopup())
  }

  return (
    <Fullscreen
      show={Boolean(otto)}
      background={`no-repeat center center / cover url(${bg.src}), ${theme.colors.otterBlack}`}
    >
      <StyledFullscreenContainer>
        {diceRoller.state !== State.Processing && <StyledCloseButton color="white" onClose={close} />}
        <StyledContainer>
          {otto && <StateView key={diceRoller.state} otto={otto} diceRoller={diceRoller} />}
        </StyledContainer>
      </StyledFullscreenContainer>
    </Fullscreen>
  )
}
