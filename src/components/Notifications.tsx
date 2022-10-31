import { useNotifications } from 'contexts/NotificationCenter'
import Image from 'next/image'
import Link from 'next/link'
import { Carousel } from 'react-responsive-carousel'
import styled from 'styled-components/macro'
import { Note } from 'styles/typography'

const StyledContainer = styled.div`
  width: 450px;
  height: 32px;
  background: linear-gradient(
    90deg,
    rgba(16, 22, 49, 0) 0%,
    rgba(16, 22, 49, 0.8) 16.69%,
    rgba(16, 22, 49, 0.8) 83.16%,
    rgba(16, 22, 49, 0) 100%
  );
`

const StyledLink = styled.a`
  display: flex !important;
  height: 32px;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 5px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

const StyledText = styled(Note)`
  color: ${({ theme }) => theme.colors.white};
`

const StyledNotice = styled(Note)`
  color: ${({ theme }) => theme.colors.seaweedGreen};
`

const StyledImage = styled(Image)`
  border-radius: 50%;
`

export default function Notifications({ className }: { className?: string }) {
  const notifications = useNotifications()

  return (
    <StyledContainer className={className}>
      {/* https://github.com/leandrowd/react-responsive-carousel/issues/321#issuecomment-507663251 */}
      {notifications.length > 0 && (
        <Carousel
          interval={5000}
          showIndicators={false}
          showThumbs={false}
          showArrows={false}
          showStatus={false}
          autoPlay
          infiniteLoop
          axis="vertical"
        >
          {notifications.map(notification => (
            <Link key={notification.key} href={notification.url} passHref>
              <StyledLink>
                <StyledNotice>[Notice]</StyledNotice>
                <StyledImage unoptimized src={notification.imageUrl} width={18} height={18} />
                <StyledText>{notification.text}</StyledText>
              </StyledLink>
            </Link>
          ))}
        </Carousel>
      )}
    </StyledContainer>
  )
}
