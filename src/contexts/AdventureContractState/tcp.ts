import { useCall, useEthers } from '@usedapp/core'
import { BIG_NUM_ZERO } from 'constant'
import { useAdventureContract } from 'contracts/contracts'
import { useEffect } from 'react'
import { AdventureContractStateAction, AdventureContractStateActionType } from '.'

export function useTcpWatcher(dispatch: (action: AdventureContractStateAction) => void) {
  const { account } = useEthers()
  const adventureContract = useAdventureContract()
  const result = useCall(account && { contract: adventureContract, method: 'accumulativeTcp', args: [account] })
  const tcp = (result?.value ?? [BIG_NUM_ZERO])[0]

  useEffect(() => {
    dispatch({ type: AdventureContractStateActionType.UpdateWalletTcp, data: tcp.mod(100) })
  }, [dispatch, tcp])
}
