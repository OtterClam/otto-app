import { BigNumber, BigNumberish, ethers } from 'ethers'
import { trim } from 'helpers/trim'

export const formatClam = (value: BigNumberish, decimal = 4) => trim(ethers.utils.formatUnits(value, 9), decimal)

export const formatUsdc = (value: BigNumberish, decimal = 4) => trim(ethers.utils.formatUnits(value, 6), decimal)

export const formatUsd = (number: string | number): string => {
  return `${new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(parseFloat(String(number)) / 1000)}k`
}
