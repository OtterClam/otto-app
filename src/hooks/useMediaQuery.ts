import { useMediaQuery } from 'react-responsive'

import { breakpoints } from 'styles/breakpoints'

export { useMediaQuery } from 'react-responsive'

export const useBreakPoints = () => {
  const isMobile = useMediaQuery({ query: breakpoints.mobile })
  return { isMobile }
}
