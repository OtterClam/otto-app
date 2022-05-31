import { useEthers } from '@usedapp/core'
import { ottoClick } from 'constant'
import { ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'
import { theme } from 'styles'
import { Display3 } from 'styles/typography'
import { selectError } from '../store/errorSlice'

export type ButtonColor = 'blue' | 'white' | 'pink'

interface StyledButtonProps {
  width?: string
  height?: string
  primaryColor: ButtonColor
  padding?: string
}

const buttonColors = {
  blue: {
    text: 'white',
    outerBackground: theme.colors.otterBlue,
    innerBackground: theme.colors.otterBlue,
    hover: theme.colors.otterBlueHover,
  },
  white: {
    text: theme.colors.otterBlack,
    outerBackground: theme.colors.lightGray200,
    innerBackground: 'white',
    hover: theme.colors.lightGray100,
  },
  pink: {
    text: 'white',
    outerBackground: theme.colors.clamPink,
    innerBackground: theme.colors.clamPink,
    hover: theme.colors.clamPink,
  },
}

const StyledButton = styled.button<StyledButtonProps>`
  display: inline-block;
  width: ${props => props.width};
  height: ${props => props.height};
  border: 4px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;
  background-color: ${({ primaryColor }) => buttonColors[primaryColor].outerBackground};

  :hover {
    background-color: ${({ primaryColor }) => buttonColors[primaryColor].hover};
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
  primaryColor: ButtonColor
  padding?: string
  disabled?: boolean
}

const StyledInnerButton = styled.div<InnerButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(100% - 6px);
  color: ${({ primaryColor }) => buttonColors[primaryColor].text};
  background-color: ${({ theme, primaryColor, disabled }) =>
    disabled ? theme.colors.darkGray200 : buttonColors[primaryColor].innerBackground};
  padding: ${({ padding }) => padding || '0 45px'};
  margin: 0 0 6px 0;
  outline: 4px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 8px;

  :hover {
    background-color: ${({ theme, primaryColor, disabled }) =>
      disabled ? theme.colors.darkGray200 : buttonColors[primaryColor].hover};
  }

  :active {
    transform: ${({ disabled }) => (disabled ? 'none' : 'translateY(6px)')};
  }
`

interface Props {
  width?: string
  height?: string
  onClick?: () => void
  primaryColor?: ButtonColor
  isWeb3?: boolean
  disabled?: boolean
  loading?: boolean
  children?: ReactNode
  padding?: string
  className?: string
  disableSound?: boolean
}

const Button = ({
  children,
  width,
  height,
  className,
  onClick,
  primaryColor = 'blue',
  isWeb3,
  disabled,
  loading,
  padding,
  disableSound = false,
}: Props) => {
  const { account, activateBrowserWallet } = useEthers()
  const error = useSelector(selectError)
  const [pending, setPending] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    if (error || loading) setPending(false)
  }, [error, loading])

  const _disabled = disabled || loading || pending

  return (
    <StyledButton
      className={className}
      primaryColor={primaryColor}
      disabled={_disabled}
      width={width}
      height={height}
      onClick={() => {
        if (onClick) {
          if (loading || disabled || pending) return
          if (isWeb3) setPending(true)
          if (isWeb3 && !account) activateBrowserWallet()
          else onClick()
        }
        if (!_disabled && !disableSound) {
          ottoClick.play()
        }
      }}
    >
      <StyledInnerButton primaryColor={primaryColor} padding={padding} disabled={disabled || loading || pending}>
        {isWeb3 && !account ? (
          <Display3>{t('connect_wallet')}</Display3>
        ) : loading ? (
          <Display3>{t('button_processing')}</Display3>
        ) : (
          children
        )}
      </StyledInnerButton>
    </StyledButton>
  )
}

export default Button
