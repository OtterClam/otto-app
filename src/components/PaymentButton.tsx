import { useEthers, useTokenAllowance } from '@usedapp/core'
import assert from 'assert'
import TxButton, { TxButtonProps } from 'components/TxButton'
import Price, { PriceProps } from 'components/Price'
import { useApprove } from 'contracts/functions'
import useContractAddresses from 'hooks/useContractAddresses'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { ethers, BigNumber } from 'ethers'
import noop from 'lodash/noop'

export interface PaymentButtonProps extends PriceProps, TxButtonProps {
  spenderAddress: string
  showSymbol?: boolean
  onSuccess?: () => void
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
  showSymbol,
  onSuccess = noop,
  // PriceProps
  token,
  amount,
  // TxButtonProps
  onClick = noop,
  disabled,
  loading,
  ...btnProps
}: PaymentButtonProps) {
  const addresses = useContractAddresses()
  const tokenAddress = addresses[token]
  assert(tokenAddress, `unknown token: ${token}`)

  const [btnState, setBtnState] = useState(BtnState.WaitingClick)
  const { account, chainId } = useEthers()
  const allowance = useTokenAllowance(tokenAddress, account, spenderAddress, { chainId })
  const { approve, approveState } = useApprove(tokenAddress)
  const approving = allowance === undefined || btnState === BtnState.WaitingApprove
  const noAmount = BigNumber.from(amount).eq(0)

  const pay = useCallback(() => {
    if (!noAmount && (!allowance || BigNumber.from(amount).gt(allowance))) {
      setBtnState(BtnState.WaitingApprove)
      approve(spenderAddress, ethers.constants.MaxUint256)
      return
    }
    onClick()
  }, [onClick, amount, allowance, spenderAddress, approve])

  useEffect(() => {
    if (btnState === BtnState.WaitingApprove && allowance && BigNumber.from(amount).lte(allowance)) {
      setBtnState(BtnState.WaitingClick)
      onClick()
    }
  }, [btnState, allowance, amount, onClick])

  useEffect(() => {
    if (approveState.status === 'Exception') {
      setBtnState(BtnState.WaitingClick)
    }
  }, [approveState.status])

  useEffect(() => {
    if (approveState.status === 'Success') {
      onSuccess()
    }
  }, [approveState.status])

  return (
    <TxButton onClick={pay} loading={loading || approving} {...btnProps}>
      <StyledWrapper>
        {!noAmount && <Price showSymbol={showSymbol} token={token} amount={amount} />}
        {children && <StyledButtonText>{children}</StyledButtonText>}
      </StyledWrapper>
    </TxButton>
  )
}
