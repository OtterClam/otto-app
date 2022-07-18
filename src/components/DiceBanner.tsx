import Otto from 'models/Otto'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'
import hell from 'assets/hell.png'
import bg from 'assets/dice-of-destiny-bg.jpg'
import { ContentSmall, Headline } from 'styles/typography'
import Button from 'components/Button'
import useApi from 'hooks/useApi'
import { useBreakpoints } from 'contexts/useBreakpoints'
import { selectOttoInTheHell, showDicePopup } from 'store/uiSlice'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'
import { Dice, EventEffects } from 'models/Dice'
import { setError } from 'store/errorSlice'
import useRarityEpoch from 'hooks/useRarityEpoch'
import { numberWithSign } from 'helpers/number'
import { useIsMyOttos } from 'MyOttosProvider'
import MarkdownWithHtml from './MarkdownWithHtml'
import StyledRichContent from './RichContent'

const StyledContainer = styled.div`
  position: relative;
  background: no-repeat 20px center / 180px 180px url(${hell.src}), no-repeat center / 870px 867px url(${bg.src});
  border: 2px solid ${props => props.theme.colors.otterBlack};
  border-radius: 15px;
  padding: 20px 20px 20px 220px;
  overflow: hidden;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    background: no-repeat center 20px / 100px 100px url(${hell.src}), no-repeat center / 870px 867px url(${bg.src});
    padding: 130px 20px 20px;
  }
`

const StyledBadgeContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 80px;
  height: 80px;
`

const StyledBadge = styled(ContentSmall)`
  position: absolute;
  top: calc(50% - 16px);
  left: calc(50% - 76px);
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 152px;
  height: 32px;
  font-size: 16px;
  background: ${props => props.theme.colors.clamPink};
  border: 2px solid ${props => props.theme.colors.otterBlack};
  transform: rotate(-45deg);

  @media ${({ theme }) => theme.breakpoints.mobile} {
    font-size: 16px;
  }
`

const StyledTitle = styled(Headline)`
  display: block;
  font-size: 24px !important;
  color: ${props => props.theme.colors.white};
  margin-bottom: 10px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    font-size: 20px !important;
    text-align: center;
  }
`

const StyledContent = styled(ContentSmall.withComponent(StyledRichContent))`
  display: block;
  font-size: 16px !important;
  color: ${props => props.theme.colors.white};
  margin-bottom: 10px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    font-size: 14px !important;
  }
`

const StyledButtonContainer = styled.div`
  @media ${({ theme }) => theme.breakpoints.mobile} {
    text-align: center;
  }
`

export interface DiceBannerProps {
  otto: Otto
}

const useAllDice = (ottoId: string) => {
  const ottoInTheHell = useSelector(selectOttoInTheHell)
  const api = useApi()
  const { i18n } = useTranslation()
  const [diceList, setDiceList] = useState<Dice[]>([])
  const dispatch = useDispatch()

  useEffect(() => {
    if (!ottoId) {
      return
    }
    api
      .getAllDice(ottoId, i18n.resolvedLanguage)
      .then(diceList => setDiceList(diceList))
      .catch(err => dispatch(setError(err)))
  }, [api, ottoId, i18n.resolvedLanguage, ottoInTheHell])

  return diceList
}

export function DiceBanner({ otto }: DiceBannerProps) {
  const { isMobile } = useBreakpoints()
  const dispatch = useDispatch()
  const openPopup = () => dispatch(showDicePopup(otto.toJSON()))
  const { t } = useTranslation()
  const dices = useAllDice(otto.tokenId)
  const { epochEnd } = useRarityEpoch()
  const isMyOtto = useIsMyOttos(otto.tokenId)
  const effects = dices
    .map(dice => dice.events)
    .reduce(
      (effects, events) =>
        events.reduce((effects, event) => {
          effects.brs += event.effects?.brs ?? 0
          effects.ranking += event.effects?.ranking ?? 0
          return effects
        }, effects),
      { brs: 0, ranking: 0 } as EventEffects
    )

  return (
    <StyledContainer>
      {isMyOtto && (
        <StyledBadgeContainer>
          <StyledBadge>{t('dice_banner.badge')}</StyledBadge>
        </StyledBadgeContainer>
      )}
      <StyledTitle>{t('dice_banner.title')}</StyledTitle>
      <StyledContent>
        {isMyOtto && <MarkdownWithHtml>{t('dice_banner.description')}</MarkdownWithHtml>}
        <ul>
          {dices.length > 0 && (
            <li>
              <MarkdownWithHtml>{t('dice_banner.times', { times: dices.length })}</MarkdownWithHtml>
            </li>
          )}
          {effects.brs > 0 && (
            <li>
              <MarkdownWithHtml>
                {t('dice_banner.effects_blessed', { brs: numberWithSign(effects.brs) })}
              </MarkdownWithHtml>
            </li>
          )}
          {effects.brs < 0 && (
            <li>
              <MarkdownWithHtml>
                {t('dice_banner.effects_cursed', { brs: numberWithSign(effects.brs) })}
              </MarkdownWithHtml>
            </li>
          )}
          <li>
            <MarkdownWithHtml>
              {t('dice_banner.endTime', { time: new Date(epochEnd).toLocaleString() })}
            </MarkdownWithHtml>
          </li>
        </ul>
      </StyledContent>
      {isMyOtto && (
        <StyledButtonContainer>
          <Button padding={isMobile ? undefined : '6px 18px'} Typography={Headline} onClick={openPopup}>
            {t('dice_banner.button')}
          </Button>
        </StyledButtonContainer>
      )}
    </StyledContainer>
  )
}
