import { CheckedIcon } from 'assets/icons'
import Invitation from 'assets/ui/invitation.svg'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'
import { ContentSmall, Headline } from 'styles/typography'
import Button from 'components/Button'
import LockedButton from './LockedButton'

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
  onComplete: () => void
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
  const onVerify = () => {
    setState(State.Verified)
    onComplete()
  }
  return (
    <StyledStep className={className}>
      <StyledActionContainer>
        <StyledIcon />
        <StyledDesc>{t('desc')}</StyledDesc>
        {locked && <LockedButton />}
        {!locked && state === State.Follow && (
          <>
            <StyledInput placeholder={t('placeholder')} />
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
