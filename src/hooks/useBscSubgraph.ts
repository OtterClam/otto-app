import { BscSubgraphContext } from 'BscSubgraphProvider'
import { useContext } from 'react'

export function useBscSubgraph() {
  return useContext(BscSubgraphContext)
}
