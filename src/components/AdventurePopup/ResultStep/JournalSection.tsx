import TreasurySection from 'components/TreasurySection'
import { format } from 'date-fns'
import range from 'lodash/range'
import { AdventureJournalEntry, AdventureResult } from 'models/AdventureResult'
import { useTranslation } from 'next-i18next'
import Skeleton from 'react-loading-skeleton'
import ReactMarkdown from 'react-markdown'
import styled from 'styled-components/macro'
import { Caption, ContentSmall, Headline } from 'styles/typography'
import 'react-loading-skeleton/dist/skeleton.css'

const AdventureJournalBg = {
  src: '/images/adventure//adventure_journal_bg.png',
  width: 552,
  height: 150,
}

interface Props {
  className?: string
  result: AdventureResult | null
}

export default function AdventureJournal({ className, result }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'adventurePopup.resultStep' })
  return (
    <StyledJournalSection className={className}>
      <StyledTitle>{t('journal')}</StyledTitle>
      <StyledScrollContainer>
        <StyledJournalEntryContainer>
          {!result && range(10).map(i => <JournalEntrySkeleton key={i} />)}
          {result && result.journal.map((entry, i) => <DisplayJournalEntry key={i} {...entry} />)}
        </StyledJournalEntryContainer>
      </StyledScrollContainer>

      <StyledResultContainer>
        <StyledResultLabel>{t('result_label')}</StyledResultLabel>
        <StyledResultValue succeeded={result?.success}>
          {result && t(result.success ? 'result_succeeded' : 'result_failed')}
          {!result && <Skeleton />}
        </StyledResultValue>
      </StyledResultContainer>
    </StyledJournalSection>
  )
}

const StyledJournalSection = styled(TreasurySection)`
  max-height: 250px;
  padding: 15px 0;
  background: ${({ theme }) => theme.colors.darkGray400};
`

const StyledTitle = styled(Headline).attrs({ as: 'h1' })`
  position: absolute;
  top: -65px;
  left: calc(50% - 138px);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 75px;
  width: 276px;
  text-shadow: -2px 0 ${({ theme }) => theme.colors.otterBlack}, 0 2px ${({ theme }) => theme.colors.otterBlack},
    2px 0 ${({ theme }) => theme.colors.otterBlack}, 0 -2px ${({ theme }) => theme.colors.otterBlack};
  color: ${({ theme }) => theme.colors.white};
  background: center / cover url(${AdventureJournalBg.src}) no-repeat;
  background-size: ${AdventureJournalBg.width / 2} 75px;
`

const StyledScrollContainer = styled.div`
  height: 164px;
  overflow-y: scroll;
`

const StyledJournalEntryContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 15px;
  gap: 5px;
`

const StyledResultContainer = styled.div`
  height: 66px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
`

const StyledResultLabel = styled(ContentSmall)`
  color: ${({ theme }) => theme.colors.white};
`

const StyledResultValue = styled(ContentSmall)<{ succeeded?: boolean }>`
  min-width: 150px;
  font-family: 'PaytoneOne';
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 36px;
  background: ${({ succeeded }) =>
    succeeded
      ? 'linear-gradient(180deg, #ffffff 0%, #ffc737 100%)'
      : 'linear-gradient(180deg, #FFFFFF 0%, #FF3737 100%)'};
  -webkit-text-fill-color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
`

function JournalEntrySkeleton() {
  return (
    <StyledJournalEntry>
      <StyledJournalEntryTimestamp>
        <Skeleton width={24} />
      </StyledJournalEntryTimestamp>
      <StyledJournalEntryText>
        <Skeleton />
      </StyledJournalEntryText>
    </StyledJournalEntry>
  )
}

function DisplayJournalEntry({ happened_at, text }: AdventureJournalEntry) {
  return (
    <StyledJournalEntry>
      <StyledJournalEntryTimestamp>{format(happened_at, 'HH:mm')}</StyledJournalEntryTimestamp>
      <StyledJournalEntryText>
        <ReactMarkdown>{text}</ReactMarkdown>
      </StyledJournalEntryText>
    </StyledJournalEntry>
  )
}

const StyledJournalEntry = styled(Caption).attrs({ as: 'div' })`
  width: 100%;
  display: flex;
  align-items: flex-start;
`

const StyledJournalEntryTimestamp = styled.div`
  width: 40px;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.lightGray400};
  font-family: 'VT323';
`

const StyledJournalEntryText = styled(Caption)`
  width: 100%;
  color: ${({ theme }) => theme.colors.white};
  strong {
    color: ${({ theme }) => theme.colors.crownYellow};
    font-weight: 400;
  }
`
