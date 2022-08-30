import styled from 'styled-components/macro'
import Checked from './Checked.svg'
import Filter from './Filter.svg'
import Sorted from './Sorted.svg'

export const CheckedIcon = styled.img.attrs({ src: Checked.src })`
  width: 60px;
  height: 60px;
`
export const FilterIcon = styled.img.attrs({ src: Filter.src })`
  width: 30px;
  height: 30px;
`
export const SortedIcon = styled.img.attrs({ src: Sorted.src })`
  width: 30px;
  height: 30px;
`
