import { SnapshotContext } from 'SnapshotSubgraphProvider'
import { useContext } from 'react'

export function useSnapshotSubgraph() {
  return useContext(SnapshotContext)
}
