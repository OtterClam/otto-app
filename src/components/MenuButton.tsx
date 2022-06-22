import styled from 'styled-components/macro'
import { ContentMedium } from 'styles/typography'
import { ottoClick as audio } from 'constant'

interface ButtonProps {
  padding?: string
}

const StyledButton = styled.button<ButtonProps>`
  position: relative;
  border: 4px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.lightGray400};
  color: ${({ theme }) => theme.colors.otterBlack};

  &:before,
  &:after {
    content: '';
    display: block;
    position: absolute;
    background-color: ${({ theme }) => theme.colors.otterBlack};
    border-radius: 3px;
    width: 6px;
    height: 6px;
    box-shadow: 0 130px 0 0 ${({ theme }) => theme.colors.otterBlack};
  }
  &:before {
    left: 14px;
    top: 14px;
  }
  &:after {
    right: 14px;
    top: 14px;
  }

  :hover {
    background-color: ${({ theme }) => theme.colors.darkGray100};
  }

  :active {
    border: 4px solid transparent;
    background-color: transparent;
  }

  :disabled {
    border: 4px solid ${({ theme }) => theme.colors.otterBlack};
    background-color: ${({ theme }) => theme.colors.darkGray300};
  }
`

interface InnerButtonProps {
  padding?: string
}

const StyledInnerButton = styled.div<InnerButtonProps>`
  width: 100%;
  height: calc(100% - 6px);
  background-color: ${({ theme }) => theme.colors.lightGray200};
  padding: 6px;
  margin: 0 0 6px 0;
  outline: 4px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 16px;

  ${StyledButton}:hover & {
    background-color: ${({ theme }) => theme.colors.lightGray400};
  }

  ${StyledButton}:active:not([disabled]) & {
    translate: 0 6px;
  }

  ${StyledButton}:disabled & {
    background-color: ${({ theme }) => theme.colors.darkGray200};
  }
`

const StyledContainer = styled.div<InnerButtonProps>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;

  ${StyledButton}:hover &,
  ${StyledButton}:active & {
    background-color: ${({ theme }) => theme.colors.lightGray200};
  }

  ${StyledButton}:disabled & {
    background-color: ${({ theme }) => theme.colors.darkGray200};
  }
`

const StyledImg = styled.img`
  width: 110px;
  height: 96px;
`

interface Props {
  padding?: string
  title: string
  icon: string
  className?: string
  disabled?: boolean
}

export default function MenuButton({ padding, title, icon, className, disabled }: Props) {
  return (
    <StyledButton className={className} disabled={disabled} onClick={() => audio.play()}>
      <StyledInnerButton padding={padding}>
        <StyledContainer>
          <StyledImg src={icon} alt={title} />
          <ContentMedium>{title}</ContentMedium>
        </StyledContainer>
      </StyledInnerButton>
    </StyledButton>
  )
}
