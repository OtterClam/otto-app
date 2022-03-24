import { useEthers } from '@usedapp/core'
import { ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { Display3 } from 'styles/typography'
import { selectError } from '../store/errorSlice'

export type ButtonColor = 'blue' | 'white'

interface ButtonProps {
  primaryColor: ButtonColor
  padding?: string
}

const StyledButton = styled.button<ButtonProps>`
  display: inline-block;
  border: 4px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;
  background-color: ${({ theme, primaryColor }) =>
    primaryColor === 'blue' ? theme.colors.otterBlue : theme.colors.lightGray200};

  :hover {
    background-color: ${({ theme, primaryColor }) =>
      primaryColor === 'blue' ? theme.colors.otterBlueHover : theme.colors.lightGray100};
  }

  :active {
    border: 4px solid transparent;
    background-color: transparent;
  }

  :disabled {
    background-color: ${({ theme }) => theme.colors.darkGray300};
  }
`

interface InnerButtonProps {
  primaryColor: ButtonColor
  padding?: string
  disabled?: boolean
}

const StyledInnerButton = styled.div<InnerButtonProps>`
  width: 100%;
  color: ${({ theme, primaryColor }) => (primaryColor === 'blue' ? '#fff' : theme.colors.otterBlack)};
  background-color: ${({ theme, primaryColor, disabled }) =>
    disabled ? theme.colors.darkGray200 : primaryColor === 'blue' ? theme.colors.otterBlue : '#fff'};
  padding: ${({ padding }) => padding || '0 45px'};
  /* margin: -4px -4px 6px -4px; */
  margin: 0 0 6px 0;
  outline: 4px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 8px;

  :hover {
    background-color: ${({ theme, primaryColor, disabled }) =>
      disabled
        ? theme.colors.darkGray200
        : primaryColor === 'blue'
        ? theme.colors.otterBlueHover
        : theme.colors.lightGray100};
  }

  :active {
    translate: 0 6px;
  }
`

interface Props {
  click?: () => void
  primaryColor?: ButtonColor
  isWeb3?: boolean
  disabled?: boolean
  loading?: boolean
  children?: ReactNode
  padding?: string
  className?: string
}

const audio = new Audio('https://ottopia.app/ottoclick.mp3')

const Button = ({ children, className, click, primaryColor = 'blue', isWeb3, disabled, loading, padding }: Props) => {
  const { account, activateBrowserWallet } = useEthers()
  const error = useSelector(selectError)
  const [pending, setPending] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    if (error || loading) setPending(false)
  }, [error, loading])

  return (
    <StyledButton
      className={className}
      primaryColor={primaryColor}
      disabled={disabled || loading || pending}
      onClick={() => {
        if (click) {
          if (loading || disabled || pending) return
          if (isWeb3) setPending(true)
          if (isWeb3 && !account) activateBrowserWallet()
          else click()

          audio.load()
          audio.play()
        }
      }}
    >
      <StyledInnerButton primaryColor={primaryColor} padding={padding} disabled={disabled || loading || pending}>
        {isWeb3 && !account ? (
          <Display3> {t('connect-wallet')}</Display3>
        ) : loading ? (
          <Display3>Loading...</Display3>
        ) : (
          children
        )}
      </StyledInnerButton>
    </StyledButton>
  )
}

export default Button
