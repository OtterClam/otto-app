import { BigNumber, ethers } from 'ethers'
import { trim } from 'helpers/trim'

export const formatClamEthers = (value: BigNumber, decimal = 4) => trim(ethers.utils.formatUnits(value, 9), decimal)
export const formatClamString = (number: string, appendClam: boolean = false) =>
  `${Intl.NumberFormat('en-US').format(Math.round(parseFloat(number)))} ${appendClam ? ' CLAM' : ''}`
export const formatClamThousandsK = (number: string) =>
  `${Intl.NumberFormat('en-US').format(Math.round(parseFloat(number)))}`

export const formatUsdc = (value: BigNumber, decimal = 4) => trim(ethers.utils.formatUnits(value, 6), decimal)

export const formatUsd = (number: string | number, decimals: number = 0): string => {
  return `${new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(parseFloat(String(number)))}`
}

export const formatUsdThousandsK = (number: string | number): string => {
  return `${new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(parseFloat(String(number)) / 1000)}k`
}
