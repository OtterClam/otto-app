import AdventureMap from 'components/AdventureMap'
import styled from 'styled-components'

const StyledAdventureMap = styled(AdventureMap)`
  max-width: 600px;
`

export default function MapStep() {
  return <StyledAdventureMap ottoLocked hideFooter />
}
