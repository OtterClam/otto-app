import { gql, useQuery } from '@apollo/client'
import { useTranslation } from 'react-i18next'
import { utils } from 'ethers'
import Product from './Product'
import { GetProducts } from './__generated__/GetProducts'
import Diamond from './images/diamond.png'
import Golden from './images/golden.png'
import Silver from './images/silver.png'

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
  silver: {
    1: Silver,
    3: Silver,
    10: Silver,
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
      name: t(`product.${p.type}.name`),
      desc: t(`product.${p.type}.name`),
      image: Preset[p.type][p.amount],
      airdropAmount: 0,
      displayPrice: utils.formatUnits(p.price, 9),
      displayDiscountPrice: utils.formatUnits(p.discountPrice, 9),
    })) || []
  return { products }
}
