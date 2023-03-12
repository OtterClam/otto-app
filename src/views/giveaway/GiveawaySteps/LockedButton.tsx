import LockedIcon from 'assets/ui/locked.svg'
import Button from 'components/Button'
import { Fragment } from 'react'
import Image from 'next/image'

export default function LockedButton() {
  return (
    <Button disabled padding="6px 10px" Typography={Fragment}>
      <Image src={LockedIcon.src} alt="locked" width="20" height="20" />
    </Button>
  )
}
