const pad = (n: number): string => {
  return n > 10 ? String(n) : `0${n}`
}

export const formatDuration = (duration: Duration): string => {
  return [duration.hours ?? 0, duration.minutes ?? 0, duration.seconds ?? 0].map(pad).join(':')
}
