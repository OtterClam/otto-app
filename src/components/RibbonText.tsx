import styled from 'styled-components/macro'
import { ContentSmall } from 'styles/typography'
import ribbon from 'assets/ui/ribbon.png'

const StyledText = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0 20px;
  color: ${props => props.theme.colors.white};
  background: ${props => props.theme.colors.clamPink};
  border-radius: 2px;
  border: 2px ${props => props.theme.colors.otterBlack} solid;
  height: 40px;
`

const StyledContainer = styled.div`
  position: relative;
  z-index: 1;
  height: 53px;

  &:before,
  &:after {
    content: '';
    position: absolute;
    z-index: -1;
    bottom: 0;
    background: center / auto 53px url(${ribbon.src});
    height: 53px;
    width: 40px;
  }

  &:before {
    background-position: left bottom;
    left: -25px;
  }

  &:after {
    background-position: right bottom;
    right: -25px;
  }
`

export interface RibbonTextProps {
  Typography?: React.ComponentType
  className?: string
}

export default function RibbonText({
  children,
  className,
  Typography = ContentSmall,
}: React.PropsWithChildren<RibbonTextProps>) {
  return (
    <StyledContainer className={className}>
      <StyledText>
        <Typography>{children}</Typography>
      </StyledText>
    </StyledContainer>
  )
}
