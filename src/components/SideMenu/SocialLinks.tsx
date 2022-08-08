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
  { key: 'twitter', image: twitterImage, link: 'https://twitter.com/otterclam' },
  { key: 'discord', image: discordImage, link: 'https://discord.gg/otterclam' },
  { key: 'youtube', image: youtubeImage, link: 'https://www.youtube.com/channel/UCDDMx916FeqHmCilGr5WuQw/videos' },
  { key: 'medium', image: mediumImage, link: 'https://medium.com/@otterclam' },
  { key: 'github', image: githubImage, link: 'https://github.com/otterclam' },
  { key: 'telegram', image: telegramImage, link: 'https://t.me/otterclam_official' },
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
