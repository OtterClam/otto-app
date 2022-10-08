import { useAdventureOtto } from 'contexts/AdventureOttos'
import { useApi } from 'contexts/Api'
import { useOtto } from 'contexts/Otto'
import { useAdventureFinish } from 'contracts/functions'
import { AdventureOttoStatus } from 'models/AdventureOtto'
import { useEffect, useState } from 'react'
import FinishedView from './FinishedView'
import OnGoingView from './OnGoingView'

export default function ExploringStep() {
  const { otto } = useOtto()
  const adventureOtto = useAdventureOtto(otto?.tokenId)
  const { finishState, finish, resetFinish } = useAdventureFinish()
  const onFinish = (immediately: boolean, potions: string[]) => otto && finish(otto.tokenId, immediately, potions)

  useEffect(() => {
    if (finishState.state === 'Exception' || finishState.state === 'Fail') {
      alert(finishState.status.errorMessage)
      resetFinish()
    }
  }, [finishState, resetFinish])

  if (!otto || !adventureOtto) return null

  return (
    <div>
      {finishState.state === 'Success' ? (
        <FinishedView tx={finishState.status.transaction?.hash || ''} />
      ) : (
        <OnGoingView state={finishState.state} onFinish={onFinish} />
      )}
    </div>
  )
}
