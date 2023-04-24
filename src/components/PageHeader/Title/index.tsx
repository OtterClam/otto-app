import { PropsWithChildren } from 'react'
import styled from 'styled-components/macro'
import { ContentMedium } from 'styles/typography'
import useGoBack from 'hooks/useGoBack'

const LargeButtonBg = '/images/header/large-button.png'
const SmallButtonBg = '/images/header/small-button.png'
const LargeCenterBg = '/images/header/large-center.png'
const SmallCenterBg = '/images/header/small-center.png'
const LargeRightBg = '/images/header/large-right.png'
const SmallRightBg = '/images/header/small-right.png'

const StyledContainer = styled.div<{ showLeftBg: boolean }>`
  flex: 1;
  display: flex;
  height: 48px;
  align-items: stretch;

  &::before,
  &::after {
    flex: 0 14px;
    content: '';
    display: block;
    background: left / 14px 48px url(${LargeRightBg});
  }

  &::before {
    display: ${props => (props.showLeftBg ? 'block' : 'none')};
    transform: rotate(180deg);
  }

  @media ${({ theme }) => theme.breakpoints.mobile} {
    height: 40px;

    &::after,
    &::before {
      background: left / 14px 40px url(${SmallRightBg});
    }
  }
`

const StyledButton = styled.button<{ show: boolean }>`
  display: ${props => (props.show ? 'block' : 'none')};
  flex: 0 63px;
  background: left / 189px 48px url(${LargeButtonBg});

  &:hover {
    background-position: center;
  }

  &:active {
    background-position: right;
  }

  @media ${({ theme }) => theme.breakpoints.mobile} {
    background: left / 189px 40px url(${SmallButtonBg});
  }
`

const StyledText = styled(ContentMedium)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: left / 1px 48px url(${LargeCenterBg});
  color: ${props => props.theme.colors.white};

  @media ${({ theme }) => theme.breakpoints.mobile} {
    background: left / 1px 40px url(${SmallCenterBg});
  }
`

export default function Title({ children }: PropsWithChildren<object>) {
  const { goBack, historyLength } = useGoBack()

  return (
    <StyledContainer showLeftBg={historyLength <= 1}>
      <StyledButton show={historyLength > 1} onClick={goBack} />
      <StyledText>{children}</StyledText>
    </StyledContainer>
  )
}
