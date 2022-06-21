import { useBreakpoints } from 'contexts/Breakpoints'
import DesktopPageHeader from './DesktopPageHeader'
import MobilePageHeader from './MobilePageHeader'
import { PageHeaderProps } from './type'

export default function PageHeader({ title }: PageHeaderProps) {
  const { isMobile } = useBreakpoints()
  const PageHeader = isMobile ? MobilePageHeader : DesktopPageHeader
  return <PageHeader title={title} />
}
