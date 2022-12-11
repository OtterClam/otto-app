import { TraitCollection } from 'models/Otto'
import styled from 'styled-components/macro'
import gen1Image from './gen1.svg'
import gen2Image from './gen2.svg'
import gen3Image from './gen3.svg'

const images = {
  [TraitCollection.Genesis]: gen1Image,
  [TraitCollection.Second]: gen2Image,
  [TraitCollection.Third]: gen3Image,
}

const StyledImage = styled.img`
  width: 44px;
  height: 44px;
`

export interface ItemCollectionBadgeProps {
  collection: TraitCollection
  collectionName: string
  className?: string
}

export default function ItemCollectionBadge({ collection, collectionName, className }: ItemCollectionBadgeProps) {
  const image = images[collection]
  return image && <StyledImage className={className} src={image.src} alt={collectionName} />
}
