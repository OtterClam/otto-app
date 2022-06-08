import Otto from 'models/Otto'
import { useDispatch } from 'react-redux'
import styled from 'styled-components/macro'
import hell from 'assets/hell.png'
import bg from 'assets/dice-of-destiny-bg.jpg'
import { ContentSmall, Headline } from 'styles/typography'
import Button from 'components/Button'
import { useBreakPoints } from 'hooks/useMediaQuery'
import { showDicePopup } from 'store/uiSlice'
import { useTranslation } from 'react-i18next'
import MarkdownWithHtml from './MarkdownWithHtml'

const StyledContainer = styled.div`
  position: relative;
  background: no-repeat 20px center / 180px 180px url(${hell}), no-repeat center / 870px 867px url(${bg});
  border: 2px solid ${props => props.theme.colors.otterBlack};
  border-radius: 15px;
  padding: 20px 20px 20px 220px;
  overflow: hidden;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    background: no-repeat center 20px / 100px 100px url(${hell}), no-repeat center / 870px 867px url(${bg});
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

const StyledContent = styled(ContentSmall.withComponent('div'))`
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

export function DiceBanner({ otto }: DiceBannerProps) {
  const { isMobile } = useBreakPoints()
  const dispatch = useDispatch()
  const openPopup = () => dispatch(showDicePopup(otto.toJSON()))
  const { t } = useTranslation()

  return (
    <StyledContainer>
      <StyledBadgeContainer>
        <StyledBadge>{t('dice_banner.badge')}</StyledBadge>
      </StyledBadgeContainer>
      <StyledTitle>{t('dice_banner.title')}</StyledTitle>
      <StyledContent>
        <MarkdownWithHtml>{t('dice_banner.description')}</MarkdownWithHtml>
      </StyledContent>
      <StyledButtonContainer>
        <Button padding={isMobile ? undefined : '6px 18px'} Typography={Headline} onClick={openPopup}>
          Give It a Try
        </Button>
      </StyledButtonContainer>
    </StyledContainer>
  )
}
