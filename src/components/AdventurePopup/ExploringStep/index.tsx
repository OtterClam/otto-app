import { useOtto } from 'contexts/Otto'
import { useAdventureFinish } from 'contracts/functions'
import { useMyOttos } from 'MyOttosProvider'
import { useEffect } from 'react'
import FinishedView from './FinishedView'
import OnGoingView from './OnGoingView'

export default function ExploringStep() {
  const { updateOtto } = useMyOttos()
  const { otto, setOtto } = useOtto()
  const { finishState, finish, resetFinish } = useAdventureFinish()
  const onFinish = (immediately: boolean, potions: string[]) => otto && finish(otto.id, immediately, potions)

  useEffect(() => {
    if (finishState.state === 'Success' && otto) {
      otto?.finish()
      setOtto(otto)
      updateOtto(otto)
    }
    if (finishState.state === 'Fail') {
      alert(finishState.status.errorMessage)
      resetFinish()
    }
  }, [finishState, resetFinish, otto])

  if (!otto) return null

  return (
    <div>
      {finishState.state === 'Success' ? (
        <FinishedView tx={finishState.status.transaction?.hash || ''} />
      ) : (
        <OnGoingView otto={otto} state={finishState.state} onFinish={onFinish} />
      )}
    </div>
  )
}
