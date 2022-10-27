import styled from 'styled-components/macro'
import { Note } from 'styles/typography'
import { useTranslation } from 'next-i18next'
import useRemainingTime from 'hooks/useRemainingTime'

const StyledContainer = styled(Note).attrs({ as: 'div' })<{ viewLabel: string }>`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.otterBlack};
  border-radius: 5px;
  padding: 2px;
  text-align: center;
  gap: 2px;
  white-space: nowrap;

  &::after {
    line-height: 22px;
    content: '${({ viewLabel }) => viewLabel}';
    color: ${({ theme }) => theme.colors.otterBlack};
    background: ${({ theme }) => theme.colors.crownYellow};
    border-radius: 0 0 3px 3px;
  }
`

const StyledDuration = styled.p`
  margin: 0 3px;
`

export interface RemainingTimeProps {
  target: Date
}

export default function RemainingTime({ target }: RemainingTimeProps) {
  const { t } = useTranslation('', { keyPrefix: 'adventureOttoCard' })
  const duration = useRemainingTime(target)

  return (
    <StyledContainer viewLabel={t('viewLabel')}>
      <StyledDuration>{duration}</StyledDuration>
    </StyledContainer>
  )
}
