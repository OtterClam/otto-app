import axios from 'axios'
import Button from 'components/Button'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components/macro'
import { Caption } from 'styles/typography'

const StyledGiveawayPage = styled.div`
  display: flex;
  flex-direction: column;
`

const DISCORD_OAUTH_STATE = 'discord-ottopia'
const DISCORD_OAUTH_LINK = `https://discord.com/api/oauth2/authorize?response_type=token&client_id=${process.env.REACT_APP_DISCORD_CLIENT_ID}&state=${DISCORD_OAUTH_STATE}&scope=identify guilds.members.read`

export default function GiveawayPage() {
  const [discordUser, setDiscordUser] = useState<string | null>(null)
  const [twitterUser, setTwitterUser] = useState<string | null>(null)
  useEffect(() => {
    axios
      .get('/.netlify/functions/twitter-getUser')
      .then(res => setTwitterUser(res.data.username))
      .catch(err => console.warn(err))
  }, [])
  const location = useLocation()
  const params = new URLSearchParams(location.hash)
  useEffect(() => {
    if (params.get('state') === DISCORD_OAUTH_STATE) {
      axios
        .get('/.netlify/functions/discord-getUser', {
          headers: {
            Authorization: `Bearer ${params.get('access_token')}`,
          },
        })
        .then(res => {
          setDiscordUser(res.data.username)
        })
    }
  }, [params])

  return (
    <StyledGiveawayPage>
      {twitterUser ? (
        <Caption>{twitterUser}</Caption>
      ) : (
        <a href="/.netlify/functions/twitter-login">
          <Button>Twitter Login</Button>
        </a>
      )}
      {discordUser ? (
        <Caption>{discordUser}</Caption>
      ) : (
        <a href={DISCORD_OAUTH_LINK}>
          <Button>Discord Login</Button>
        </a>
      )}
    </StyledGiveawayPage>
  )
}
