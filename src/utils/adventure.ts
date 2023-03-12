import { RawAdventureResult } from 'libs/RawAdventureResult'
import { RawAdventureLocation } from 'models/AdventureLocation'
import { RawOtto } from 'models/Otto'
import { ParsedUrlQuery } from 'querystring'

const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT_MAINNET
if (!baseUrl) {
  throw new Error('API endpoint not defined')
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
