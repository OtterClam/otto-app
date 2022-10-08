import { useCall, useEthers, useLogs } from '@usedapp/core'
import { BIG_NUM_ZERO } from 'constant'
import { useAdventureContract } from 'contracts/contracts'
import { BigNumber } from 'ethers'
import sortBy from 'lodash/sortBy'
import { useEffect } from 'react'
import { AdventureContractStateAction, AdventureContractStateActionType } from '.'

export function useTcpWatcher(dispatch: (action: AdventureContractStateAction) => void) {
  const { account } = useEthers()
  const adventureContract = useAdventureContract()
  const logsResult = useLogs({ contract: adventureContract, event: 'TcpChanged', args: [] })

  useEffect(() => {
    if (logsResult && logsResult.value && logsResult.value[0]) {
      const sortedLogs = sortBy(logsResult.value, 'blockNumber')
      const lastLog = sortedLogs[sortedLogs.length - 1]
      dispatch({ type: AdventureContractStateActionType.UpdateWalletTcp, data: lastLog.data.to.mod(100) })
    }
  }, [logsResult])

  const result = useCall({ contract: adventureContract, method: 'accumulativeTcp', args: [account ?? ''] })
  const tcp = (result?.value ?? [BIG_NUM_ZERO])[0]

  useEffect(() => {
    dispatch({ type: AdventureContractStateActionType.UpdateWalletTcp, data: tcp.mod(100) })
  }, [tcp])
}
