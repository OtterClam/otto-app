import { useEthers } from '@usedapp/core'
import { CheckedIcon } from 'assets/icons'
import axios from 'axios'
import Button from 'components/Button'
import { TWITTER_LINK } from 'constant'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { ContentSmall, Headline } from 'styles/typography'
import Link from 'next/link'
import LockedButton from './LockedButton'
import Twitter from './twitter.svg'

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

const StyledIcon = styled.img.attrs({ src: Twitter.src })`
  width: 24px;
  height: 24px;
`

const StyledDesc = styled(ContentSmall).attrs({ as: 'section' })`
  flex: 1;
  white-space: pre-wrap;
`

const StyledVerifyArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border: 4px solid ${({ theme }) => theme.colors.lightGray400};
  border-radius: 10px;
`

const StyledVerifyMessage = styled(ContentSmall).attrs({ as: 'div' })``

const StyledUserName = styled.span`
  color: ${({ theme }) => theme.colors.otterBlue};
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
  const { chainId } = useEthers()
  const [state, setState] = useState(State.Follow)
  const [twitterUser, setTwitterUser] = useState<string | null>(null)
  const verify = useCallback(async () => {
    axios
      .get('/api/twitter-verify', { params: { chainId } })
      .then(res => {
        setTwitterUser(res.data.username)
        if (res.data.verified) {
          setState(State.Verified)
          onComplete()
        } else {
          setState(State.Verify)
        }
      })
      .catch(err => console.warn(err))
  }, [chainId, onComplete])
  useEffect(() => {
    if (!locked) {
      verify()
    }
  }, [locked, verify])
  return (
    <StyledStep className={className} locked={locked}>
      <StyledActionContainer>
        <StyledIcon />
        <StyledDesc>
          <p> {t('desc')} </p>
          {twitterUser && (
            <p>
              {t('welcome')}
              <StyledUserName>{twitterUser}</StyledUserName>
            </p>
          )}
        </StyledDesc>
        {locked && <LockedButton />}
        {state === State.Follow && (
          <a href={TWITTER_LINK} target="_blank" rel="noreferrer">
            <Button height="60px" padding="0 10px" onClick={() => setState(State.Verify)} Typography={Headline}>
              {t('follow')}
            </Button>
          </a>
        )}
        {state === State.Verified && <CheckedIcon />}
      </StyledActionContainer>
      {state === State.Verify && (
        <StyledVerifyArea>
          <StyledVerifyMessage>
            {twitterUser && (
              <p>
                {t('welcome')}
                <StyledUserName>{twitterUser}!</StyledUserName>
              </p>
            )}
            <p>{t('verify_desc')}</p>
          </StyledVerifyMessage>
          {twitterUser ? (
            <Button padding="0px 10px" onClick={verify} Typography={Headline}>
              {t('verify')}
            </Button>
          ) : (
            <Link href="/api/twitter-login" passHref>
              <a style={{ textDecoration: 'none', display: 'inline-block' }}>
                <Button padding="0px 10px" Typography={Headline}>
                  {t('verify')}
                </Button>
              </a>
            </Link>
          )}
        </StyledVerifyArea>
      )}
    </StyledStep>
  )
}
