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
}

const StyledButton = styled.div<ButtonProps>`
  display: inline-block;
  border: 4px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;
  background-color: ${({ theme, primaryColor }) =>
    primaryColor === 'blue' ? theme.colors.otterBlue : theme.colors.lightGray200};

  :disabled {
    cursor: auto;
    background-color: var(--sub);
  }

  :active {
    border: 4px solid transparent;
    background-color: transparent;
  }

  :hover {
    background-color: ${({ theme, primaryColor }) =>
      primaryColor === 'blue' ? theme.colors.otterBlueHover : theme.colors.lightGray100};
  }
`

const StyledInnerButton = styled.button<ButtonProps>`
  color: ${({ theme, primaryColor }) => (primaryColor === 'blue' ? '#fff' : theme.colors.otterBlack)};
  background-color: ${({ theme, primaryColor }) => (primaryColor === 'blue' ? theme.colors.otterBlue : '#fff')};
  padding: 0 45px;
  margin: -4px -4px 6px -4px;
  border: 4px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;

  :active {
    translate: 0 6px;
  }

  :hover {
    background-color: ${({ theme, primaryColor }) =>
      primaryColor === 'blue' ? theme.colors.otterBlueHover : theme.colors.lightGray100};
  }
`

interface Props {
  click?: () => void
  primaryColor?: ButtonColor
  isWeb3?: boolean
  disabled?: boolean
  loading?: boolean
  children?: ReactNode
}

const Button = ({ children, click, primaryColor = 'blue', isWeb3, disabled, loading }: Props) => {
  const { account, activateBrowserWallet } = useEthers()
  const error = useSelector(selectError)
  const [pending, setPending] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    if (error || loading) setPending(false)
  }, [error, loading])

  return (
    <StyledButton primaryColor={primaryColor}>
      <StyledInnerButton
        primaryColor={primaryColor}
        onClick={() => {
          if (click) {
            if (loading || disabled || pending) return
            if (isWeb3) setPending(true)
            if (isWeb3 && !account) activateBrowserWallet()
            else click()
          }
        }}
        disabled={disabled || loading || pending}
      >
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
