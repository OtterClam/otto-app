export const createSearchParams = (query: object) => {
  return Array.from(Object.entries(query))
    .map(pair => pair.map(val => encodeURIComponent(val)).join('='))
    .join('&')
}
