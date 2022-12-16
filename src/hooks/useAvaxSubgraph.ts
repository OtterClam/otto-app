import { AvaxSubgraphContext } from 'AvaxSubgraphProvider'
import { useContext } from 'react'

export function useAvaxSubgraph() {
  return useContext(AvaxSubgraphContext)
}
