import MarkdownWithHtml from 'components/MarkdownWithHtml'
import Tooltip from 'components/Tooltip'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components'
import giveawayImage from './giveaway.png'
import NavButton from './NavButton'
import oldAppImage from './old-app.png'
import whitePaperImage from './news.png'

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
      <Tooltip content={<MarkdownWithHtml>{t('oldAppTip')}</MarkdownWithHtml>} place="bottom">
        <div>
          <NavButton image={oldAppImage} link="https://app.otterclam.finance/#/stake" label={t('oldApp')} />
        </div>
      </Tooltip>
      <NavButton showNotifcationIcon image={giveawayImage} link="/giveaway" label={t('giveaway')} />
      <NavButton image={whitePaperImage} link="https://docs.ottopia.app/ottopia/" label={t('whitepaper')} />
    </StyledContainer>
  )
}
