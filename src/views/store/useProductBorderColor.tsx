import { useMemo } from 'react'
import { useTheme } from 'styled-components/macro'

export default function useProductBorderColor(type: string) {
  const theme = useTheme()
  const color = useMemo(() => {
    if (type === 'sliver') return theme.colors.lightGray400
    if (type === 'golden') return theme.colors.crownYellow
    return theme.colors.legendary
  }, [theme, type])
  return color
}
