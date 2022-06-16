import { gql, useQuery } from '@apollo/client'
import { useStoreAirdropAmounts } from 'contracts/views'
import { utils } from 'ethers'
import { useMyOttos } from 'MyOttosProvider'
import { useTranslation } from 'react-i18next'
import Diamond from './images/diamond.png'
import Golden from './images/golden.png'
import Silver from './images/silver.png'
import Diamond3 from './images/diamond_3.png'
import Golden3 from './images/golden_3.png'
import Silver3 from './images/silver_3.png'
import Diamond10 from './images/diamond_10.png'
import Golden10 from './images/golden_10.png'
import Silver10 from './images/silver_10.png'
import Product from './Product'
import { GetProducts } from './__generated__/GetProducts'

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

const PresetImages: Record<string, any> = {
  silver: {
    1: Silver.src,
    3: Silver3.src,
    10: Silver10.src,
  },
  golden: {
    1: Golden.src,
    3: Golden3.src,
    10: Golden10.src,
  },
  diamond: {
    1: Diamond.src,
    3: Diamond3.src,
    10: Diamond10.src,
  },
  helldice: {},
}

export default function useProducts() {
  const { t } = useTranslation()
  const { loading, ottos } = useMyOttos()
  const { data } = useQuery<GetProducts>(GET_PRODUCTS, {
    skip: loading,
  })
  const airdropAmounts = useStoreAirdropAmounts(
    data?.ottoProducts.map(p => p.productId) || [],
    ottos?.map(o => o.tokenId) || []
  )
  const products: Product[] =
    data?.ottoProducts
      .filter(p => Object.keys(PresetImages).includes(p.type))
      .map((p, idx) => ({
        ...p,
        id: p.productId,
        name: t(`product.${p.type}.name`),
        desc: t(`product.${p.type}.desc`),
        mustDesc: p.amount === 10 ? t(`product.${p.type}.must_desc`) : undefined,
        image: PresetImages[p.type][p.amount],
        airdropAmount: airdropAmounts[idx],
        displayPrice: utils.formatUnits(p.price, 9),
        displayDiscountPrice: utils.formatUnits(p.discountPrice, 9),
      })) || []
  return { products }
}
