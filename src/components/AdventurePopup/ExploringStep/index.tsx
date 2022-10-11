import { useOtto } from 'contexts/Otto'
import { useAdventureFinish } from 'contracts/functions'
import { useEffect } from 'react'
import FinishedView from './FinishedView'
import OnGoingView from './OnGoingView'

export default function ExploringStep() {
  const { otto } = useOtto()
  const { finishState, finish, resetFinish } = useAdventureFinish()
  const onFinish = (immediately: boolean, potions: string[]) => otto && finish(otto.id, immediately, potions)

  useEffect(() => {
    if (finishState.state === 'Exception' || finishState.state === 'Fail') {
      alert(finishState.status.errorMessage)
      resetFinish()
    }
  }, [finishState, resetFinish])

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
