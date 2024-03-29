import { useAdventureUIState, useGoToAdventureResultStep } from 'contexts/AdventureUIState'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function useSharedAdventureResult(): void {
  const router = useRouter()
  const gotoResultStep = useGoToAdventureResultStep()
  const {
    state: { finishedTx },
  } = useAdventureUIState()

  const tx = String(router.query.adventure_tx)
  const locationId = Number(router.query.location ?? 0)
  const ottoId = String(router.query.otto ?? 0)

  useEffect(() => {
    if (!(tx && locationId)) {
      return
    }
    if (router.pathname !== '/' && router.pathname !== '/adventure') {
      router.pathname = '/'
      router.push(router)
    } else if (finishedTx !== tx) {
      gotoResultStep({ ottoId, tx, locationId, showEvent: false })
    }
  }, [tx, ottoId, locationId, router.asPath, finishedTx, gotoResultStep, router])
}
