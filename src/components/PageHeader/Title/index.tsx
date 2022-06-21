import { PropsWithChildren } from 'react'
import styled from 'styled-components/macro'
import { ContentMedium } from 'styles/typography'
import LargeButtonBg from './large-button.png'
import SmallButtonBg from './small-button.png'
import LargeCenterBg from './large-center.png'
import SmallCenterBg from './small-center.png'
import LargeRightBg from './large-right.png'
import SmallRightBg from './small-right.png'

const StyledContainer = styled.div`
  flex: 1;
  display: flex;
  height: 48px;
  align-items: stretch;

  &::after {
    flex: 0 14px;
    content: '';
    display: block;
    background: left / 14px 48px url(${LargeRightBg.src});
  }

  @media ${({ theme }) => theme.breakpoints.mobile} {
    height: 40px;

    &::after {
      background: left / 14px 40px url(${SmallRightBg.src});
    }
  }
`

const StyledButton = styled.button`
  flex: 0 63px;
  background: left / 189px 48px url(${LargeButtonBg.src});

  &:hover {
    background-position: center;
  }

  &:active {
    background-position: right;
  }

  @media ${({ theme }) => theme.breakpoints.mobile} {
    background: left / 189px 40px url(${SmallButtonBg.src});
  }
`

const StyledText = styled(ContentMedium)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: left / 1px 48px url(${LargeCenterBg.src});
  color: ${props => props.theme.colors.white};

  @media ${({ theme }) => theme.breakpoints.mobile} {
    background: left / 1px 40px url(${SmallCenterBg.src});
  }
`

export default function Title({ children }: PropsWithChildren<object>) {
  return (
    <StyledContainer>
      <StyledButton />
      <StyledText>{children}</StyledText>
    </StyledContainer>
  )
}
