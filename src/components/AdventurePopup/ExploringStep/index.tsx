import { useGoToAdventureResultStep, useSelectedAdventureLocation } from 'contexts/AdventureUIState'
import { useOtto } from 'contexts/Otto'
import { useAdventureFinish, useUsePotions } from 'contracts/functions'
import Otto, { RawOtto } from 'models/Otto'
import { useMyOttos } from 'MyOttosProvider'
import { useEffect, useState } from 'react'
import { calcRemainingTime } from 'utils/potion'
import OnGoingView from './OnGoingView'

export default function ExploringStep() {
  const { otto, setOtto } = useOtto()
  const { updateOtto } = useMyOttos()
  const location = useSelectedAdventureLocation()
  const { finishState, finish, resetFinish } = useAdventureFinish()
  const [potions, setPotions] = useState<number[]>([])
  const { state: usePotionsState, send: applyPotions, resetState: resetUsePotions } = useUsePotions()
  const goToResult = useGoToAdventureResultStep()
  const onFinish = (immediately: boolean, potions: number[]) => {
    if (!otto) {
      return
    }
    const finishedAt = calcRemainingTime(otto.latestAdventurePass!.canFinishAt!, potions)
    if (finishedAt.getTime() <= Date.now()) {
      finish(otto.id, immediately, potions)
    } else {
      setPotions(potions)
      applyPotions(otto.id, potions)
    }
  }

  useEffect(() => {
    if (finishState.state === 'Success' && otto && finishState.status.transaction?.hash && location) {
      goToResult({ tx: finishState.status.transaction.hash, locationId: location.id })
    } else if (finishState.state === 'Fail') {
      alert(finishState.status.errorMessage)
      resetFinish()
    }
  }, [finishState, resetFinish, otto])

  useEffect(() => {
    if (!otto) {
      return
    }
    if (usePotionsState.status === 'Success') {
      const raw: RawOtto = JSON.parse(JSON.stringify(otto.raw))
      const finishedAt = calcRemainingTime(otto.latestAdventurePass!.finishedAt!, potions)
      raw.latest_adventure_pass!.can_finish_at = finishedAt.toISOString()
      const newOtto = new Otto(raw)
      setOtto(newOtto)
      updateOtto(newOtto)
      setPotions([])
      resetUsePotions()
    } else if (usePotionsState.status === 'Fail') {
      alert(finishState.status.errorMessage)
      setPotions([])
      resetUsePotions()
    }
  }, [usePotionsState.status])

  if (!otto) return null

  return (
    <OnGoingView
      otto={otto}
      loading={finishState.state === 'Processing' || usePotionsState.status === 'Mining'}
      onFinish={onFinish}
    />
  )
}
