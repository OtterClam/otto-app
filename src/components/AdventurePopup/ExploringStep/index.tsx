import { useAdventureOttos } from 'contexts/AdventureOttos'
import { useOtto } from 'contexts/Otto'
import { AdventureOttoStatus } from 'models/AdventureOtto'
import FinishedView from './FinishedView'
import OnGoingView from './OnGoingView'

export default function ExploringStep() {
  const { otto } = useOtto()
  const { ottos: adventureOttos } = useAdventureOttos()
  const adventureOtto = adventureOttos.find(adventureOtto => String(adventureOtto.id) === otto?.tokenId)!

  return (
    <div>
      {adventureOtto.status === AdventureOttoStatus.Finished && <FinishedView />}
      {adventureOtto.status !== AdventureOttoStatus.Finished && <OnGoingView />}
    </div>
  )
}
