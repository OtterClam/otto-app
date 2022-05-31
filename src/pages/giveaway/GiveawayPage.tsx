import axios from 'axios'
import BorderContainer from 'components/BorderContainer'
import Layout from 'Layout'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components/macro'
import { ContentMedium, Display2 } from 'styles/typography'
import GiveawaySteps from './GiveawaySteps'

const StyledGiveawayPage = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px 0;
  align-items: center;
  background: ${({ theme }) => theme.colors.otterBlack};
  color: ${({ theme }) => theme.colors.white};
`

const StyledHeadline = styled(Display2)``

const StyledSubtitle = styled(ContentMedium)``

const StyledBody = styled(BorderContainer)`
  width: 640px;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.otterBlack};
  padding: 42px 35px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const DISCORD_OAUTH_STATE = 'discord-ottopia'
const DISCORD_OAUTH_LINK = `https://discord.com/api/oauth2/authorize?response_type=token&client_id=${process.env.REACT_APP_DISCORD_CLIENT_ID}&state=${DISCORD_OAUTH_STATE}&scope=identify guilds.members.read`

export default function GiveawayPage() {
  const { t } = useTranslation('', { keyPrefix: 'giveaway' })
  return (
    <Layout title={t('title')}>
      <StyledGiveawayPage>
        <StyledHeadline>{t('headline')}</StyledHeadline>
        <StyledSubtitle>{t('subtitle')}</StyledSubtitle>
        <StyledBody>
          <GiveawaySteps />
        </StyledBody>
      </StyledGiveawayPage>
    </Layout>
  )
}
