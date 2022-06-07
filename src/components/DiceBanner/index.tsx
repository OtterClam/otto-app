import Otto from 'models/Otto'
import styled from 'styled-components/macro'
import bg from 'assets/dice-of-destiny-bg.jpg'
import { ContentSmall, Headline } from 'styles/typography'
import Button from 'components/Button'
import hell from './hell.png'

const StyledContainer = styled.div`
  position: relative;
  background: no-repeat 20px center / 180px 180px url(${hell}), no-repeat center / 870px 867px url(${bg});
  border: 2px solid ${props => props.theme.colors.otterBlack};
  border-radius: 15px;
  padding: 20px 20px 20px 220px;
  overflow: hidden;
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
  }
`

const StyledContent = styled(ContentSmall.withComponent('p'))`
  display: block;
  font-size: 16px !important;
  color: ${props => props.theme.colors.white};
  margin-bottom: 10px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    font-size: 14px !important;
  }
`

export interface DiceBannerProps {
  otto: Otto
}

export function DiceBanner({ otto }: DiceBannerProps) {
  return (
    <StyledContainer>
      <StyledBadgeContainer>
        <StyledBadge>Special Offer</StyledBadge>
      </StyledBadgeContainer>
      <StyledTitle>Roll a Dice of Destiny!</StyledTitle>
      <StyledContent>
        The Dice of Destiny gives a chance to temporarily boost up your BRS for the current epoch in Rarity Competition,
        but there’s possibility that you will lose some BRS as well.
      </StyledContent>
      <StyledContent>
        The Dice of Destiny has blessed you with BRS +20 The dice effect will clear and reset on June 8 at 0:00 (UTC+0)
      </StyledContent>
      <div>
        <Button padding="6px 18px" Typography={Headline}>
          Give It a Try
        </Button>
      </div>
    </StyledContainer>
  )
}
