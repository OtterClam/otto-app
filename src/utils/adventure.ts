import addMilliseconds from 'date-fns/addMilliseconds'
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds'
import formatDistance from 'date-fns/formatDistance'
import formatDistanceStrict from 'date-fns/formatDistanceStrict'
import milliseconds from 'date-fns/milliseconds'
import { RawAdventureResult } from 'libs/RawAdventureResult'
import { AdventureLocation, RawAdventureLocation } from 'models/AdventureLocation'
import Otto, { RawOtto } from 'models/Otto'
import { ParsedUrlQuery } from 'querystring'

const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT_MAINNET
if (!baseUrl) {
  console.error('API endpoint not defined')
}

export interface ServerSideAdventureShare {
  location: RawAdventureLocation
  otto: RawOtto
  result: RawAdventureResult
}

export const serverSideAdventureShare = async (params?: ParsedUrlQuery) => {
  const locationId = params?.location ? Number(params?.location) : undefined
  const ottoId = params?.otto ? String(params?.otto) : undefined
  const tx = params?.adventure_tx ? String(params?.adventure_tx) : undefined

  if (!locationId || !ottoId || !tx) {
    return {}
  }

  const [result, locations, otto] = await Promise.all([getAdventureResult(tx), getLocations(), getOtto(ottoId)])
  const location = locations.find(location => location.id === locationId)

  if (!location) {
    return {}
  }

  return {
    adventure: {
      result,
      location,
      otto,
    },
  }
}

async function getAdventureResult(tx: string) {
  const res = await fetch(`${baseUrl}adventure/results/${tx}`)
  const adventureResult: RawAdventureResult = await res.json()
  return adventureResult
}

async function getLocations() {
  const res = await fetch(`${baseUrl}adventure/locations`)
  const locations: RawAdventureLocation[] = await res.json()
  return locations
}

async function getOtto(ottoId: string) {
  const res = await fetch(`${baseUrl}ottos/metadata/${ottoId}`)
  const otto: RawOtto = await res.json()
  return otto
}

export const computeStakingInfo = (now: Date, otto: Otto | undefined, location: AdventureLocation | undefined) => {
  if (!location) {
    return {}
  }
  const elapsedDuration = formatDistanceStrict(now, otto?.latestAdventurePass?.departureAt ?? 0, { unit: 'hour' })
  const elapsedDurationMillis = differenceInMilliseconds(now, otto?.latestAdventurePass?.departureAt ?? now)
  const stakeRounds =
    location.stakeMode && location.adventureTime
      ? Math.min(location.maxStakeRounds, Math.floor(elapsedDurationMillis / milliseconds(location.adventureTime)))
      : 0
  const timeToNextRoundMillis =
    milliseconds(location.adventureTime) - (elapsedDurationMillis % milliseconds(location.adventureTime))
  const nextRoundTime = addMilliseconds(now, timeToNextRoundMillis)
  const timeToNextRound = formatDistance(nextRoundTime, now)
  const isMaxRounds = location.maxStakeRounds === stakeRounds
  return {
    elapsedDuration,
    elapsedDurationMillis,
    stakeRounds,
    timeToNextRoundMillis,
    nextRoundTime,
    timeToNextRound,
    isMaxRounds,
  }
}
