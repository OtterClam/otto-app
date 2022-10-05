import styled from 'styled-components/macro'
import { AdventureOttoStatus } from 'models/AdventureOtto'
import { useTranslation } from 'next-i18next'
import { Note } from 'styles/typography'

const StyledContainer = styled(Note)<{ status: AdventureOttoStatus }>`
  background: ${({ theme, status }) => theme.colors.adventureStatus[status]};
  padding: 0 5px;
  line-height: 18px;
  border-radius: 4px;
`

export interface AdventureStatusProps {
  status: AdventureOttoStatus
}

export default function AdventureStatus({ status }: AdventureStatusProps) {
  const { t } = useTranslation()
  return <StyledContainer status={status}>{t(`adventureStatus.${status}`)}</StyledContainer>
}
