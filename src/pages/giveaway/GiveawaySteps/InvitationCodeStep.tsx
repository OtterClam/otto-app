import { CheckedIcon } from 'assets/icons'
import Invitation from 'assets/ui/invitation.svg'
import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'
import { ContentSmall, Headline } from 'styles/typography'
import Button from 'components/Button'
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import { useEthers } from '@usedapp/core'
import LockedButton from './LockedButton'

export interface SuccessResponse {
  item_id: number
  amount: number
  nonce: string
  contract: string
  wallet: string
  code: string
  digest: string
  signature: string
}

const StyledStep = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 4px solid ${({ theme }) => theme.colors.otterBlue};
  border-radius: 10px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.white};
`

const StyledActionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`

const StyledIcon = styled.img.attrs({ src: Invitation })`
  width: 24px;
  height: 24px;
`

const StyledDesc = styled(ContentSmall).attrs({ as: 'p' })`
  flex: 1;
  white-space: pre;
`

const StyledInput = styled.input`
  padding: 10px;
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;
`

interface Props {
  locked: boolean
  onComplete: (data: SuccessResponse) => void
  className?: string
}

enum State {
  Follow,
  Verify,
  Verified,
}

export default function InvitationCodeStep({ locked, onComplete, className }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'giveaway.steps.invitation' })
  const [state, setState] = useState(State.Follow)
  const inputRef = useRef<HTMLInputElement>(null)
  const { account } = useEthers()
  const location = useLocation()
  const params = useMemo(() => new URLSearchParams(location.hash), [location.hash])
  const onVerify = () => {
    if (inputRef.current?.value) {
      axios
        .post(
          '/.netlify/functions/submit-giveaway',
          {
            code: inputRef.current?.value,
            wallet: account,
          },
          {
            headers: {
              Authorization: `Bearer ${params.get('access_token')}`,
            },
          }
        )
        .then(res => {
          setState(State.Verified)
          onComplete(res.data)
        })
    }
  }
  return (
    <StyledStep className={className}>
      <StyledActionContainer>
        <StyledIcon />
        <StyledDesc>{t('desc')}</StyledDesc>
        {locked && <LockedButton />}
        {!locked && state === State.Follow && (
          <>
            <StyledInput ref={inputRef} placeholder={t('placeholder')} />
            <Button padding="6px 10px" onClick={onVerify}>
              <Headline>{t('apply')}</Headline>
            </Button>
          </>
        )}
        {!locked && state === State.Verified && <CheckedIcon />}
      </StyledActionContainer>
    </StyledStep>
  )
}
