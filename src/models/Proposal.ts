export interface Proposal {
  id: string
  title: string | null
  body: string | null
  choices: (string | null)[]
  start: number
  end: number
  snapshot: string | null
  state: string | null
  scores: (number | null)[] | null
  votes: number | null
  type: string | null
  space: string | null
  voted_choices: any | null
  vote_power: number | null
  vote_power_by_strategy: (number | null)[] | null
  voted: boolean
}
