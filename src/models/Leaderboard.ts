import Otto from './Otto'
import { Paginable } from './Paginable'

export enum LeaderboardType {
  RarityScore,
  AdventurePoint,
}

export interface Leaderboard {
  type: LeaderboardType
  epoch: number
  page: Paginable<Otto>
}
