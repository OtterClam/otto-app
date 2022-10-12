import { useGoToAdventureResultStep } from 'contexts/AdventureUIState'
import { useOtto } from 'contexts/Otto'
import { useAdventureFinish } from 'contracts/functions'
import { useMyOttos } from 'MyOttosProvider'
import { useEffect } from 'react'
import OnGoingView from './OnGoingView'

export default function ExploringStep() {
  const { updateOtto } = useMyOttos()
  const { otto, setOtto } = useOtto()
  const { finishState, finish, resetFinish } = useAdventureFinish()
  const goToResult = useGoToAdventureResultStep()
  const onFinish = (immediately: boolean, potions: number[]) => otto && finish(otto.id, immediately, potions)

  useEffect(() => {
    if (finishState.state === 'Success' && otto && finishState.status.transaction?.hash) {
      otto.finish()
      setOtto(otto)
      updateOtto(otto)
      goToResult(finishState.status.transaction.hash)
    } else if (finishState.state === 'Fail') {
      alert(finishState.status.errorMessage)
      resetFinish()
    }
  }, [finishState, resetFinish, otto, setOtto, updateOtto, goToResult])

  if (!otto) return null

  return <OnGoingView otto={otto} state={finishState.state} onFinish={onFinish} />
}
