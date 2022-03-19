export const trim = (value: string, decimal: number): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: decimal,
  })
  return formatter.format(Number(value))
}
