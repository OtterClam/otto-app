import { OtterSubgraphContext } from 'OtterSubgraphProvider'
import { useContext } from 'react'

export function useOtterSubgraph() {
  return useContext(OtterSubgraphContext)
}
