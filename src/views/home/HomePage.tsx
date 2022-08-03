import { useBreakpoints } from 'contexts/Breakpoints'
import DesktopHomePage from './DesktopHomePage'
import MobileHomePage from './MobileHomePage'

export default function HomePage() {
  const { isTablet, isMobile } = useBreakpoints()
  const dekstopVersion = !(isTablet || isMobile)

  if (dekstopVersion) {
    return <DesktopHomePage />
  }
  return <MobileHomePage />
}
