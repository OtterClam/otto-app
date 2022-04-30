import { gql, useQuery } from '@apollo/client'
import { useTranslation } from 'react-i18next'
import { Product } from './Product'
import { GetProducts } from './__generated__/GetProducts'
import Diamond from './images/diamond.png'
import Golden from './images/golden.png'
import Sliver from './images/sliver.png'

const GET_PRODUCTS = gql`
  query GetProducts {
    ottoProducts {
      productId
      type
      amount
      price
      discountPrice
      factory
    }
  }
`

const Preset: Record<string, any> = {
  sliver: {
    1: Sliver,
    3: Sliver,
    10: Sliver,
  },
  golden: {
    1: Golden,
    3: Golden,
    10: Golden,
  },
  diamond: {
    1: Diamond,
    3: Diamond,
    10: Diamond,
  },
}

export default function useProducts() {
  const { t } = useTranslation()
  const { data } = useQuery<GetProducts>(GET_PRODUCTS)
  const products: Product[] =
    data?.ottoProducts.map(p => ({
      ...p,
      id: p.productId,
      image: Preset[p.type][p.amount],
      name: t(`product.${p.type}.name`),
      desc: t(`product.${p.type}.name`),
      airdropAmount: 0,
    })) || []
  return { products }
}
