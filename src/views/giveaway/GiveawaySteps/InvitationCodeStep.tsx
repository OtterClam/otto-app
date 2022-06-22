import { CheckedIcon } from 'assets/icons'
import Invitation from 'assets/ui/invitation.svg'
import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { Caption, ContentSmall, Headline } from 'styles/typography'
import Button from 'components/Button'
import axios from 'axios'
import { useEthers } from '@usedapp/core'
import useUrlHash from 'hooks/useUrlHash'
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

const StyledStep = styled.div<{ locked: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 4px solid ${({ theme, locked }) => (locked ? theme.colors.lightGray400 : theme.colors.otterBlue)};
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

const StyledIcon = styled.img.attrs({ src: Invitation.src })`
  width: 24px;
  height: 24px;
`

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  gap: 10px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    flex-direction: column;
    align-items: flex-start;
  }
`

const StyledDescContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`

const StyledDesc = styled(ContentSmall).attrs({ as: 'p' })`
  flex: 1;
  white-space: pre-wrap;
`

const StyledInputContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;
`

const StyledInput = styled(ContentSmall).attrs({ as: 'input' })`
  width: 100%;
  padding: 10px;
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;

  ::placeholder {
    color: ${({ theme }) => theme.colors.lightGray400};
    opacity: 1;
  }
`

const StyledNote = styled(Caption).attrs({ as: 'p' })`
  margin-top: 10px;
  text-align: center;
`

interface Props {
  locked: boolean
  onComplete: (data: SuccessResponse) => void
  className?: string
}

enum State {
  Verify,
  Verified,
}

export default function InvitationCodeStep({ locked, onComplete, className }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'giveaway.steps.invitation' })
  const [state, setState] = useState(State.Verify)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { account, chainId } = useEthers()
  const hash = useUrlHash()
  const params = useMemo(() => new URLSearchParams(hash), [hash])
  const onVerify = () => {
    if (inputRef.current?.value) {
      setLoading(true)
      axios
        .post(
          '/api/submit-giveaway',
          {
            code: inputRef.current?.value,
            wallet: account,
            chainId,
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
        .catch(err => {
          if (err.response) {
            window.alert(err.response.data.error)
          } else {
            window.alert(err.message)
          }
        })
        .finally(() => setLoading(false))
    }
  }
  return (
    <>
      <StyledStep className={className} locked={locked}>
        <StyledActionContainer>
          <StyledIcon />
          <StyledContainer>
            <StyledDescContainer>
              <StyledDesc>{t('desc')}</StyledDesc>
              {locked && <LockedButton />}
              {!locked && state === State.Verified && <CheckedIcon />}
            </StyledDescContainer>
            {!locked && state === State.Verify && (
              <StyledInputContainer>
                <StyledInput ref={inputRef} placeholder={t('placeholder')} />
                <Button padding="6px 10px" loading={loading} onClick={onVerify} Typography={Headline}>
                  {t('apply')}
                </Button>
              </StyledInputContainer>
            )}
          </StyledContainer>
        </StyledActionContainer>
      </StyledStep>
      <StyledNote>{t('note')}</StyledNote>
    </>
  )
}
