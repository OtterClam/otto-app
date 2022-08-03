import IconButton from 'components/IconButton'
import Link from 'next/link'
import icon from './icon.png'

export default function NewsButton() {
  return (
    <Link href="/giveaway">
      <IconButton as="a" icon={icon} target="_blank" />
    </Link>
  )
}
