import { PropsWithChildren } from 'react'
import { SkeletonTheme } from 'react-loading-skeleton'
import { useTheme } from 'styled-components'

export enum SkeletonColor {
  Dark = 'dark',
  Light = 'light',
}

export default function SkeletonThemeProvider({
  color = SkeletonColor.Dark,
  children,
}: PropsWithChildren<{ color?: SkeletonColor }>) {
  const theme = useTheme()
  const colors = {
    [SkeletonColor.Dark]: {
      baseColor: theme.colors.otterBlack,
      highlightColor: theme.colors.darkGray400,
    },
    [SkeletonColor.Light]: {
      baseColor: theme.colors.white,
      highlightColor: theme.colors.lightGray100,
    },
  }[color]

  return <SkeletonTheme {...colors}>{children}</SkeletonTheme>
}
