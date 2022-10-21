export interface RawLeaderboardEpoch {
  num: number
  total_ottos: number
  started_at: string
  ended_at: string
  themes: string[]
}

export interface LeaderboardEpoch {
  num: number
  totalOttos: number
  startedAt: Date
  endedAt: Date
  themes: string[]
}

export function rawLeaderboardEpochToLeaderboardEpoch(raw: RawLeaderboardEpoch): LeaderboardEpoch {
  return {
    num: raw.num,
    totalOttos: raw.total_ottos,
    startedAt: new Date(raw.started_at),
    endedAt: new Date(raw.ended_at),
    themes: raw.themes,
  }
}
