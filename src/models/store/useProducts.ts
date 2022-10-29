import { useQuery } from '@apollo/client'
import { utils } from 'ethers'
import { useTranslation } from 'next-i18next'
import { useMemo } from 'react'
import { GET_PRODUCTS } from 'graphs/otto'
import { GetProducts } from 'graphs/__generated__/GetProducts'
import Diamond from './images/diamond.png'
import Golden from './images/golden.png'
import Silver from './images/silver.png'
import Diamond3 from './images/diamond_3.png'
import Golden3 from './images/golden_3.png'
import Silver3 from './images/silver_3.png'
import Diamond10 from './images/diamond_10.png'
import Golden10 from './images/golden_10.png'
import Silver10 from './images/silver_10.png'
import Luk from './images/luk.png'
import Luk3 from './images/luk_3.png'
import Luk10 from './images/luk_10.png'
import Product from './Product'

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
  luk: {
    1: Luk.src,
    3: Luk3.src,
    10: Luk10.src,
  },
}

export default function useProducts() {
  const { t } = useTranslation()
  // const { loading, ottos } = useMyOttos()
  const { data } = useQuery<GetProducts>(GET_PRODUCTS, {
    // skip: loading,
  })
  // @dev: all users should claim their airdrop
  // const airdropAmounts = useStoreAirdropAmounts(
  //   data?.ottoProducts.map(p => p.productId) || [],
  //   ottos?.map(o => o.tokenId) || []
  // )
  const products: Product[] = useMemo(
    () =>
      data?.ottoProducts.map((p, idx) => ({
        ...p,
        id: Number(p.productId),
        name: t(`product.${p.type}.name`),
        desc: t(`product.${p.type}.desc`),
        mustDesc: p.amount === 10 ? t(`product.${p.type}.must_desc`) : undefined,
        image: PresetImages[p.type]?.[p.amount],
        airdropAmount: 0, // airdropAmounts[idx],
        displayPrice: utils.formatUnits(p.price, 9),
        displayDiscountPrice: utils.formatUnits(p.discountPrice, 9),
      })) || [],
    [data]
  )
  return { products }
}
