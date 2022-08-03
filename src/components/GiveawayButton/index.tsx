import IconButton from 'components/IconButton'
import Link from 'next/link'
import icon from './icon.png'

export default function GiveawayButton() {
  return (
    <Link href="/giveaway" passHref>
      <IconButton as="a" rel="noreferrer" icon={icon} target="_blank" />
    </Link>
  )
}
