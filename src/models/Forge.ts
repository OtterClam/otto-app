import { BigNumber } from 'ethers'
import { ItemMetadata, RawItemMetadata, rawItemMetadataToItemMetadata } from './Item'

export interface ForgeFormula {
  id: number
  result?: ItemMetadata
  materials: ItemMetadata[]
  materialAmounts: number[]
  title: string
  description: string
  startTime: Date
  endTime: Date
  bgImage: string
  leftImage: string
  rightImage: string
  fish: BigNumber
  resultImage: string
  resultText: string
}

export interface RawForgeFormula {
  id: number
  result?: RawItemMetadata
  materials: RawItemMetadata[]
  amounts: number[]
  title: string
  description: string
  start_time: Date
  end_time: Date
  bg_img: string
  left_img: string
  right_img: string
  fish: string
  result_image: string
  result_text: string
}

export const rawForgeToForge = (raw: RawForgeFormula): ForgeFormula => {
  return {
    id: raw.id,
    result: raw.result && rawItemMetadataToItemMetadata(raw.result),
    materials: raw.materials.map(rawItem => rawItemMetadataToItemMetadata(rawItem)),
    materialAmounts: raw.amounts,
    title: raw.title,
    description: raw.description,
    startTime: new Date(raw.start_time),
    endTime: new Date(raw.end_time),
    bgImage: raw.bg_img,
    leftImage: raw.left_img,
    rightImage: raw.right_img,
    fish: BigNumber.from(raw.fish),
    resultImage: raw.result_image,
    resultText: raw.result_text,
  }
}
