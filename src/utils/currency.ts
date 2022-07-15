import { trim } from 'helpers/trim'

export const formatClam = (number: string | number): string => `${trim(parseFloat(String(number)) / 1000, 2)}k`

export const formatUsd = (number: string | number): string => {
  return `${new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(parseFloat(String(number)) / 1000)}k`
}
