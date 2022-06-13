import Fullscreen from 'components/Fullscreen'
import { useDispatch, useSelector } from 'react-redux'
import bg from 'assets/dice-of-destiny-bg.jpg'
import hell from 'assets/hell.png'
import DiceLoading from 'components/DiceLoading'
import styled, { useTheme } from 'styled-components/macro'
import { hideDicePopup, selectOttoInTheHell } from 'store/uiSlice'
import { ContentLarge, ContentExtraSmall, Display3, Headline, ContentSmall, ContentMedium } from 'styles/typography'
import CloseButton from 'components/CloseButton'
import { FC } from 'react'
import { DiceRoller, State, useDiceRoller } from 'hooks/useDiceRoller'
import { Token } from 'constant'
import useContractAddresses from 'hooks/useContractAddresses'
import good from 'assets/dice-result-good.png'
import bad from 'assets/dice-result-bad.png'
import question from 'assets/dice-result-question.png'
import { EventType } from 'models/Dice'
import Otto from 'models/Otto'
import { numberWithDirection, numberWithSign } from 'helpers/number'
import PaymentButton from 'components/PaymentButton'
import RibbonText from 'components/RibbonText'
import { useTranslation } from 'react-i18next'
import { Question } from 'components/Question'
import Button from 'components/Button'
import MarkdownWithHtml from 'components/MarkdownWithHtml'
import skull from 'assets/skull.png'
import rankingBadge from 'assets/ranking.png'
import StyledRichContent from './RichContent'

const StyledHellImage = styled.div`
  background: no-repeat center center / 180px 180px url(${hell});
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
`

const StyledResultEffect = styled.span`
  display: flex;
  align-items: center;
`

const StyledRankingBadge = styled.span`
  display: inline-block;
  width: 24px;
  height: 24px;
  background: center / cover url(${rankingBadge});
  margin-right: 5px;
`

const StyledRibbonText = styled(RibbonText)`
  margin-top: -162px;
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
  box-shadow: 0px 0px 0px 6px ${props => props.theme.colors.crownYellow} inset;
`

interface StateProps {
  otto: Otto
  diceRoller: DiceRoller
}

function IntroState({ diceRoller, otto }: StateProps) {
  const { OTTOPIA_STORE } = useContractAddresses()
  const { t } = useTranslation()

  return (
    <StyledIntroStateContainer>
      <StyledHellImage />
      <StyledIntroTitle>{t('dice_popup.intro.title')}</StyledIntroTitle>
      <ContentExtraSmall>
        <StyledRichContent>
          <MarkdownWithHtml>{t('dice_popup.intro.description')}</MarkdownWithHtml>
        </StyledRichContent>
      </ContentExtraSmall>
      <StyledSkullImage src={skull} />
      <StyledIntroCallToAction>{t('dice_popup.intro.call_to_action')}</StyledIntroCallToAction>
      <PaymentButton
        padding="6px 12px 3px"
        spenderAddress={OTTOPIA_STORE}
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

function ProcessingState() {
  const { t } = useTranslation()

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
  const eventIndex = diceRoller.state === State.FirstResult ? 0 : 1
  const event = diceRoller.dice?.events[eventIndex] ?? { event: '', type: EventType.Good }
  const bg = {
    [EventType.Good]: good,
    [EventType.Bad]: bad,
    [EventType.Question]: question,
  }[event.type]
  const ranking =
    // current ranking + effect of the previous event
    otto.ranking + (eventIndex === 1 ? diceRoller.dice?.events[0].effects?.ranking ?? 0 : 0)

  const answerQuestion = (optionIndex: number) => diceRoller.answerQuestion(eventIndex, optionIndex)

  return (
    <StyledResultStateContainer>
      <Headline>
        <StyledResultTitleInner>{t('dice_popup.result.title', { index: eventIndex + 1 })}</StyledResultTitleInner>
        {event.response && event.answer && (
          <>
            <StyledResultTitleInner>
              {t('dice_popup.result.answer', { answer: (event.options ?? [])[event.answer] })}
            </StyledResultTitleInner>
            <StyledResultTitleInner>{event.response}</StyledResultTitleInner>
          </>
        )}
        <StyledResultTitleInner>{event.event}</StyledResultTitleInner>
      </Headline>
      <StyledResultImage background={bg} />
      {event.effects && (
        <StyledRibbonText Typography={ContentExtraSmall}>BRS {numberWithSign(event.effects.brs)}</StyledRibbonText>
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
              Next
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
      background={`no-repeat center center / cover url(${bg}), ${theme.colors.otterBlack}`}
    >
      <StyledFullscreenContainer>
        {diceRoller.state !== State.Processing}
        <StyledCloseButton color="white" onClose={close} />
        <StyledContainer>{otto && <StateView otto={otto} diceRoller={diceRoller} />}</StyledContainer>
      </StyledFullscreenContainer>
    </Fullscreen>
  )
}
