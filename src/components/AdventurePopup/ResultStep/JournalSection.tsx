import TreasurySection from 'components/TreasurySection'
import { format } from 'date-fns'
import { useTranslation } from 'next-i18next'
import ReactMarkdown from 'react-markdown'
import styled from 'styled-components/macro'
import { Caption, ContentSmall, Display3 } from 'styles/typography'
import AdventureJournalBg from './adventure_journal_bg.png'

interface JournalEntry {
  timestamp: number
  text: string
}

interface Props {
  className?: string
  succeeded: boolean
}

export default function AdventureJournal({ className, succeeded }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'adventurePopup.resultStep' })
  const journalEntries: JournalEntry[] = [
    {
      timestamp: 1620000000000,
      text: '克蕾歐和**無良的律師**一起在馬路上私奔',
    },
    {
      timestamp: 1621000000000,
      text: '大家在酒吧裡喝酒',
    },
    {
      timestamp: 1622000000000,
      text: '玩了一場麻將',
    },
    {
      timestamp: 1623000000000,
      text: '吃了一頓美食',
    },
    {
      timestamp: 1623000000000,
      text: '打了一場籃球',
    },
    {
      timestamp: 1620000000000,
      text: '克蕾歐和**無良的律師**一起在馬路上私奔',
    },
    {
      timestamp: 1621000000000,
      text: '大家在酒吧裡喝酒',
    },
    {
      timestamp: 1622000000000,
      text: '玩了一場麻將',
    },
    {
      timestamp: 1623000000000,
      text: '吃了一頓美食',
    },
    {
      timestamp: 1623000000000,
      text: '打了一場籃球',
    },
    {
      timestamp: 1620000000000,
      text: '克蕾歐和**無良的律師**一起在馬路上私奔',
    },
    {
      timestamp: 1621000000000,
      text: '大家在酒吧裡喝酒',
    },
    {
      timestamp: 1622000000000,
      text: '玩了一場麻將',
    },
    {
      timestamp: 1623000000000,
      text: '吃了一頓美食',
    },
    {
      timestamp: 1623000000000,
      text: '打了一場籃球',
    },
  ]

  return (
    <StyledJournalSection className={className}>
      <StyledTitle>{t('journal')}</StyledTitle>
      <StyledScrollContainer>
        <StyledJournalEntryContainer>
          {journalEntries.map((entry, i) => (
            <DisplayJournalEntry key={i} {...entry} />
          ))}
        </StyledJournalEntryContainer>
      </StyledScrollContainer>

      <StyledResultContainer>
        <StyledResultLabel>{t('result_label')}</StyledResultLabel>
        <StyledResultValue succeeded={succeeded}>
          {t(succeeded ? 'result_succeeded' : 'result_failed')}
        </StyledResultValue>
      </StyledResultContainer>
    </StyledJournalSection>
  )
}

const StyledJournalSection = styled(TreasurySection)`
  max-height: 250px;
  padding: 15px 0;
`

const StyledTitle = styled(Display3).attrs({ as: 'h1' })`
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
  padding: 0 15px;
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

const StyledResultValue = styled(ContentSmall)<{ succeeded: boolean }>`
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

  border: 1px solid #5c3317;
`

function DisplayJournalEntry({ timestamp, text }: JournalEntry) {
  return (
    <StyledJournalEntry>
      <StyledJournalEntryTimestamp>{format(timestamp, 'HH:mm')}</StyledJournalEntryTimestamp>
      <StyledJournalEntryText>
        <ReactMarkdown>{text}</ReactMarkdown>
      </StyledJournalEntryText>
    </StyledJournalEntry>
  )
}

const StyledJournalEntry = styled(Caption).attrs({ as: 'div' })`
  display: flex;
  align-items: center;
`

const StyledJournalEntryTimestamp = styled.span`
  width: 40px;
  color: ${({ theme }) => theme.colors.lightGray400};
`

const StyledJournalEntryText = styled.span`
  color: ${({ theme }) => theme.colors.white};
  strong {
    color: ${({ theme }) => theme.colors.crownYellow};
    font-weight: 400;
  }
`
