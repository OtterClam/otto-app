export interface Paginable<T> {
  page: number
  itemsPerPage: number
  data: T[]
}
