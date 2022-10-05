import styled from 'styled-components/macro'
import { Note } from 'styles/typography'
import { useTranslation } from 'next-i18next'
import useFormatedDuration from 'hooks/useFormatedDuration'

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
  targetDate: Date
  onClick: () => void
}

export default function RemainingTime({ targetDate, onClick }: RemainingTimeProps) {
  const { t } = useTranslation('', { keyPrefix: 'adventureOttoCard' })
  const duration = useFormatedDuration(targetDate)

  return (
    <StyledContainer viewLabel={t('viewLabel')} onClick={onClick}>
      {duration}
    </StyledContainer>
  )
}
