import { DISCORD_LINK, MEDIUM_LINK, YOUTUB_LINK, TWITTER_LINK, GITHUB_LINK, TELEGRAM_LINK } from 'constant'
import styled from 'styled-components/macro'
import discordImage from './discord.svg'
import githubImage from './github.svg'
import mediumImage from './medium.svg'
import telegramImage from './telegram.svg'
import twitterImage from './twitter.svg'
import youtubeImage from './youtube.svg'

const StyledContainer = styled.div`
  display: flex;
  gap: 12px;
`

const StyledSocialLink = styled.a<{ image: string }>`
  min-width: 24px;
  max-width: 24px;
  min-height: 24px;
  max-height: 24px;
  background: center / cover url(${({ image }) => image});
`

const links = [
  { key: 'twitter', image: twitterImage, link: TWITTER_LINK },
  { key: 'discord', image: discordImage, link: DISCORD_LINK },
  { key: 'youtube', image: youtubeImage, link: YOUTUB_LINK },
  { key: 'medium', image: mediumImage, link: MEDIUM_LINK },
  { key: 'github', image: githubImage, link: GITHUB_LINK },
  { key: 'telegram', image: telegramImage, link: TELEGRAM_LINK },
]

export default function SocialLinks() {
  return (
    <StyledContainer>
      {links.map(link => (
        <StyledSocialLink target="_blank" rel="noreferrer" key={link.key} image={link.image.src} href={link.link} />
      ))}
    </StyledContainer>
  )
}
