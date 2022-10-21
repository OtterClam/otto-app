import useAdventureOttosAtLocation from 'hooks/useAdventureOttosAtLocation'
import Otto from 'models/Otto'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import AdventureInfoSection from './AdventureInfoSection'

const StyledItem = styled.div`
  display: flex;
`

function ListItem({ otto }: { otto: Otto }) {
  return <StyledItem />
}

export interface AdventureOttoListProps {
  locationId: number
}

export default function AdventureOttoList({ locationId }: AdventureOttoListProps) {
  const { t } = useTranslation('', { keyPrefix: 'adventureOttoList' })
  const ottos = useAdventureOttosAtLocation(locationId)

  return (
    <AdventureInfoSection title={t('title')}>
      {ottos.map(otto => (
        <ListItem key={otto.id} otto={otto} />
      ))}
    </AdventureInfoSection>
  )
}
