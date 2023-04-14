import Button from 'components/Button'
import { DISCORD_LINK } from 'constant'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { ContentSmall, Headline } from 'styles/typography'
import { CheckedIcon } from 'assets/icons'
import axios from 'axios'
import { useEthers } from '@usedapp/core'
import { useRouter } from 'next/router'
import useUrlHash from 'hooks/useUrlHash'
import LockedButton from './LockedButton'
import Discord from './discord.svg'

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

const StyledIcon = styled.img.attrs({ src: Discord.src })`
  width: 24px;
  height: 24px;
`

const StyledDesc = styled(ContentSmall).attrs({ as: 'div' })`
  flex: 1;
  white-space: pre-wrap;
`

const StyledUserName = styled.span`
  color: ${({ theme }) => theme.colors.otterBlue};
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
  Join,
  Verify,
  Verified,
}

const DISCORD_OAUTH_STATE = 'discord-ottopia'
const DISCORD_OAUTH_LINK = `https://discord.com/api/oauth2/authorize?response_type=token&client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&state=${DISCORD_OAUTH_STATE}&scope=identify guilds.members.read`

export default function DiscordStep({ locked, onComplete, className }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'giveaway.steps.discord' })
  const { chainId } = useEthers()
  const [state, setState] = useState(State.Join)
  const [discordUser, setDiscordUser] = useState<string | null>(null)
  const hash = useUrlHash()
  const params = useMemo(() => new URLSearchParams(hash), [hash])
  const doVerify = useCallback(() => {
    axios
      .get('/api/discord-verify', {
        headers: {
          Authorization: `Bearer ${params.get('access_token')}`,
        },
        params: { chainId },
      })
      .then(res => {
        setDiscordUser(res.data.username)
        if (res.data.verified) {
          setState(State.Verified)
          onComplete()
        }
      })
  }, [params, chainId, onComplete])
  useEffect(() => {
    if (!locked && state !== State.Verified && params.get('state') === DISCORD_OAUTH_STATE) {
      doVerify()
    }
  }, [locked, params, doVerify, state])
  return (
    <StyledStep className={className} locked={locked}>
      <StyledActionContainer>
        <StyledIcon />
        <StyledDesc>
          {discordUser && (
            <p>
              {t('welcome')}
              <StyledUserName>{discordUser}!</StyledUserName>
            </p>
          )}
          <p>{t('desc')} </p>
        </StyledDesc>
        {locked && <LockedButton />}
        {!locked && state === State.Join && (
          <a href={DISCORD_LINK} target="_blank" rel="noreferrer">
            <Button height="60px" padding="0 10px" Typography={Headline} onClick={() => setState(State.Verify)}>
              {t('join')}
            </Button>
          </a>
        )}
        {state === State.Verified && <CheckedIcon />}
      </StyledActionContainer>
      {!locked && state === State.Verify && (
        <StyledVerifyArea>
          <ContentSmall>{t('verify_desc')}</ContentSmall>
          <a href={DISCORD_OAUTH_LINK}>
            <Button padding="0px 10px" Typography={Headline}>
              {t('verify')}
            </Button>
          </a>
        </StyledVerifyArea>
      )}
    </StyledStep>
  )
}
