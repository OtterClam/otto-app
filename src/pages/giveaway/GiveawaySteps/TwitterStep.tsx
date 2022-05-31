import { CheckedIcon } from 'assets/icons'
import axios from 'axios'
import Button from 'components/Button'
import { TWITTER_LINK } from 'constant'
import useApi from 'hooks/useApi'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'
import { ContentSmall, Headline } from 'styles/typography'
import LockedButton from './LockedButton'
import Twitter from './twitter.svg'

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

const StyledIcon = styled.img.attrs({ src: Twitter })`
  width: 24px;
  height: 24px;
`

const StyledDesc = styled(ContentSmall).attrs({ as: 'p' })`
  flex: 1;
  white-space: pre;
`

const StyledVerifyArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border: 4px solid ${({ theme }) => theme.colors.lightGray400};
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

export default function TwitterStep({ locked, onComplete, className }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'giveaway.steps.twitter' })
  const [state, setState] = useState(State.Follow)
  const [twitterUser, setTwitterUser] = useState<string | null>(null)
  const verify = useCallback(async () => {
    // setState(State.Verified)
    // onComplete()
    axios
      .get('/.netlify/functions/twitter-verify')
      .then(res => {
        setTwitterUser(res.data.username)
        if (res.data.verified) {
          setState(State.Verified)
          onComplete()
        }
      })
      .catch(err => console.warn(err))
  }, [])
  useEffect(() => {
    if (!locked) {
      verify()
    }
  }, [!locked, verify])
  return (
    <StyledStep className={className}>
      <StyledActionContainer>
        <StyledIcon />
        <StyledDesc>{t('desc')}</StyledDesc>
        {locked && <LockedButton />}
        {state === State.Follow && (
          <a href={TWITTER_LINK} target="_blank" rel="noreferrer">
            <Button height="60px" padding="0 10px" onClick={() => setState(State.Verify)}>
              {t('follow')}
            </Button>
          </a>
        )}
        {state === State.Verified && <CheckedIcon />}
      </StyledActionContainer>
      {state === State.Verify && (
        <StyledVerifyArea>
          <ContentSmall>{t('verify_desc')}</ContentSmall>
          <a href="/.netlify/functions/twitter-login">
            <Button>
              <Headline>{t('verify')}</Headline>
            </Button>
          </a>
        </StyledVerifyArea>
      )}
    </StyledStep>
  )
}
