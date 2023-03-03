import styled from 'styled-components/macro'
import { useTranslation } from 'next-i18next'
import { Note } from 'styles/typography'
import { AdventureOttoStatus } from 'models/Otto'

const StyledContainer = styled(Note)<{ status: AdventureOttoStatus }>`
  background: ${({ theme, status }) => theme.colors.adventureStatus[status]};
  padding: 2px 5px 0;
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
