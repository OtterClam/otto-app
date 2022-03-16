import 'styled-components'
import { Colors } from './styles/colors'

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: Colors
  }
}
