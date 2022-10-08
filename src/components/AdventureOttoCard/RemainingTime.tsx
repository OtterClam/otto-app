import styled from 'styled-components/macro'
import { Note } from 'styles/typography'
import { useTranslation } from 'next-i18next'
import useFormattedDuration from 'hooks/useFormattedDuration'

const StyledContainer = styled(Note).attrs({ as: 'div' })<{ viewLabel: string }>`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.otterBlack};
  border-radius: 5px;
  padding: 2px;
  text-align: center;
  line-height: 12px;
  gap: 2px;
  white-space: nowrap;

  &::after {
    line-height: 20px;
    max-height: 20px;
    min-height: 20px;
    content: '${({ viewLabel }) => viewLabel}';
    color: ${({ theme }) => theme.colors.otterBlack};
    background: ${({ theme }) => theme.colors.crownYellow};
    border-radius: 0 0 3px 3px;
  }
`

export interface RemainingTimeProps {
  start: Date
  end: Date
  onClick: () => void
}

export default function RemainingTime({ start, end, onClick }: RemainingTimeProps) {
  const { t } = useTranslation('', { keyPrefix: 'adventureOttoCard' })
  const duration = useFormattedDuration(start, end)

  return (
    <StyledContainer viewLabel={t('viewLabel')} onClick={onClick}>
      {duration}
    </StyledContainer>
  )
}
