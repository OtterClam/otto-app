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
  const api = useApi()

  // useEffect(() => {
  //   api.getAdventureResult('0xa7581518772e7f308fbe55247a5428c5bea59aa18a267bf8657d4750d32db18d')
  // }, [api])

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
        <FinishedView />
      ) : (
        <OnGoingView state={finishState.state} onFinish={() => finish(otto.tokenId, false, [])} /> // TODO: set immediately / apply potion
      )}
    </div>
  )
}
