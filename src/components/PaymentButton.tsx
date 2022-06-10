import { useEthers, useTokenAllowance } from '@usedapp/core'
import assert from 'assert'
import TxButton, { TxButtonProps } from 'components/TxButton'
import Price, { PriceProps } from 'components/Price'
import { useApprove } from 'contracts/functions'
import useContractAddresses from 'hooks/useContractAddresses'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { ethers, BigNumber } from 'ethers'

export interface PaymentButtonProps extends PriceProps, TxButtonProps {
  spenderAddress: string
}

const StyledWrapper = styled.div`
  display: inline-flex;
  align-items: center;
`

const StyledButtonText = styled.span`
  display: inline-block;
  margin-left: 20px;
`

enum BtnState {
  WaitingClick,
  WaitingApprove,
}

export default function PaymentButton({
  children,
  spenderAddress,
  // PriceProps
  token,
  amount,
  // TxButtonProps
  onClick,
  ...btnProps
}: PaymentButtonProps) {
  const addresses = useContractAddresses()
  const tokenAddress = addresses[token]
  assert(tokenAddress, `unknown token: ${token}`)

  const [btnState, setBtnState] = useState(BtnState.WaitingClick)
  const { account, chainId } = useEthers()
  const allowance = useTokenAllowance(tokenAddress, account, spenderAddress, { chainId })
  const { approve } = useApprove(tokenAddress)

  const pay = useCallback(() => {
    if (!allowance || BigNumber.from(amount).gt(allowance)) {
      setBtnState(BtnState.WaitingApprove)
      approve(spenderAddress, ethers.constants.MaxUint256)
      return
    }
    if (onClick) {
      onClick()
    }
  }, [onClick, amount, allowance, spenderAddress])

  useEffect(() => {
    if (btnState === BtnState.WaitingApprove && allowance && BigNumber.from(amount).gt(allowance)) {
      setBtnState(BtnState.WaitingClick)
      if (onClick) {
        onClick()
      }
    }
  }, [btnState, allowance])

  return (
    <TxButton onClick={pay} {...btnProps}>
      <StyledWrapper>
        <Price token={token} amount={amount} />
        {children && <StyledButtonText>{children}</StyledButtonText>}
      </StyledWrapper>
    </TxButton>
  )
}
