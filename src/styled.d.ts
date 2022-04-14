import 'styled-components/macro'
import { Breakpoints } from 'styles/breakpoints'
import { Colors } from './styles/colors'

declare module 'styled-components/macro' {
  export interface DefaultTheme {
    colors: Colors
    breakpoints: Breakpoints
  }
}
