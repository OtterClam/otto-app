import { useEthers, useTokenAllowance } from '@usedapp/core'
import Price, { PriceProps } from 'components/Price'
import TxButton, { TxButtonProps } from 'components/TxButton'
import { useApprove } from 'contracts/functions'
import { BigNumber, constants, ethers } from 'ethers'
import noop from 'lodash/noop'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

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
  const [btnState, setBtnState] = useState(BtnState.WaitingClick)
  const { account, chainId } = useEthers()
  let allowance = useTokenAllowance(token.address, account, spenderAddress, { chainId })
  const { approve, approveState } = useApprove(token.address)
  if (token.address === constants.AddressZero) {
    allowance = constants.MaxUint256
  }
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
    } else if (approveState.status === 'Success') {
      onSuccess()
    }
  }, [approveState.status])

  return (
    <TxButton onClick={pay} disabled={disabled || loading || approving} loading={loading || approving} {...btnProps}>
      <StyledWrapper>
        {!noAmount && <Price showSymbol={showSymbol} token={token} amount={amount} />}
        {children && <StyledButtonText>{children}</StyledButtonText>}
      </StyledWrapper>
    </TxButton>
  )
}
