import { useEthers } from '@usedapp/core'
import { ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { Display3 } from 'styles/typography'
import { selectError } from '../store/errorSlice'

interface ButtonProps {
  primary?: boolean
  color?: string
}

const StyledButton = styled.div`
  border: 4px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.otterBlue};

  :disabled {
    cursor: auto;
    background-color: var(--sub);
  }

  :active {
    border: 4px solid #fff;
  }

  :hover {
    background-color: ${({ theme }) => theme.colors.otterBlueHover};
  }
`

const StyledInnerButton = styled.button`
  color: #fff;
  padding: 0 45px;
  margin: -4px -4px 6px -4px;
  border: 4px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;

  :active {
    translate: 0 6px;
  }
`

interface Props {
  click: () => void
  primary?: boolean
  isWeb3?: boolean
  disabled?: boolean
  loading?: boolean
  children?: ReactNode
}

const Button = ({ children, click, primary, isWeb3, disabled, loading }: Props) => {
  const { account, activateBrowserWallet } = useEthers()
  const error = useSelector(selectError)
  const [pending, setPending] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    if (error || loading) setPending(false)
  }, [error, loading])

  return (
    <StyledButton
    // primary={primary}
    >
      <StyledInnerButton
        onClick={() => {
          if (loading || disabled || pending) return
          if (isWeb3) setPending(true)
          if (isWeb3 && !account) activateBrowserWallet()
          else click()
        }}
        disabled={disabled || loading || pending}
      >
        <Display3>{isWeb3 && !account ? t('connect-wallet') : loading ? 'Loading...' : children}</Display3>
      </StyledInnerButton>
    </StyledButton>
  )
}

export default Button
