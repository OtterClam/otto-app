// https://stackoverflow.com/a/69196391
export function textStroke(width: number, color: string): string {
  const r = width /* width of outline in pixels */
  const n = 6 * r /* number of shadows, 2pi ~ 6 rough approximation */
  let shadow = ''
  for (let i = 0; i < n; i++ /* append shadows in n evenly distributed directions */) {
    const theta = (6 * i) / n
    shadow += `${r * Math.cos(theta)}px ${r * Math.sin(theta)}px 0 ${color}${i === n - 1 ? '' : ','}`
  }
  return `text-shadow: ${shadow};`
}
