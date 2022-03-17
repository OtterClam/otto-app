import 'styled-components'
import { Breakpoints } from 'styles/breakpoints'
import { Colors } from './styles/colors'

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: Colors
    breakpoints: Breakpoints
  }
}
