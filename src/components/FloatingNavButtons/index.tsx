import { useTranslation } from 'next-i18next'
import styled from 'styled-components'
import giveawayImage from './giveaway.png'
import NavButton from './NavButton'
import newsImage from './news.png'

const StyledContainer = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`

export default function FloatingNavButtons({ className }: { className?: string }) {
  const { t } = useTranslation('', { keyPrefix: 'floatingNavButtons' })
  return (
    <StyledContainer className={className}>
      {/* <NavButton image={newsImage} link="/news" label={t('news')} /> */}
      <NavButton showNotifcationIcon image={giveawayImage} link="/giveaway" label={t('giveaway')} />
    </StyledContainer>
  )
}
