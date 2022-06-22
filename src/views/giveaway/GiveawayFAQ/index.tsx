import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { Display3 } from 'styles/typography'
import FAQ from './FAQ'

const StyledGiveawayFAQ = styled.section`
  z-index: 3;
  width: 100%;
  margin: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const StyledTitle = styled(Display3).attrs({ as: 'h1' })``

export default function GiveawayFAQ() {
  const { t } = useTranslation('', { keyPrefix: 'giveaway.faq' })
  return (
    <StyledGiveawayFAQ>
      <StyledTitle>{t('title')}</StyledTitle>
      {Array(9)
        .fill(0)
        .map((_, i) => (
          <FAQ key={i} question={t(`q${i}`)} answer={t(`a${i}`)} />
        ))}
    </StyledGiveawayFAQ>
  )
}
