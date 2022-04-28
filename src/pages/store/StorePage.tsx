import Layout from 'Layout'
import { Product } from 'models/Product'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'
import { ContentMedium, Display2, Display3 } from 'styles/typography'
import { useMemo, useState } from 'react'
import CurtainImage from './curtain.png'
import ProductCard from './ProductCard'
import GemLeft from './gem-left.png'
import GemRight from './gem-right.png'
import Diamond from './tmp/diamond.png'
import Golden from './tmp/golden.png'
import Sliver from './tmp/sliver.png'
import ProductPopup, { GroupedProduct } from './ProductPopup'

const StyledStorePage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const StyledHeroSection = styled.section`
  padding: 48px 80px;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.otterBlack};

  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding: 48px 24px;
  }
`

const StyledHeroText = styled.h1``

const StyledSubtitle = styled.p``

const StyledHeroImg = styled.img``

const StyledCurtain = styled.div`
  width: calc(100% + 2px);
  height: 73px;
  background-image: url(${CurtainImage});
  background-repeat: repeat-x;
  background-size: 112px 73px;
  transform: translateX(-2px);
`

const StyledProductBody = styled.div`
  width: 80%;
  max-width: 870px;
  padding: 40px 0;
  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding: 24px 0;
  }
`

const StyledShellChestTitle = styled.h2`
  display: flex;
  justify-content: space-between;
  align-items: center;

  > * {
    &:first-child {
      width: 230px;
      height: 120px;

      @media ${({ theme }) => theme.breakpoints.mobile} {
        width: 30%;
        height: auto;
      }
    }
    &:nth-child(2) {
      flex: 1;
      text-align: center;
    }
    &:last-child {
      width: 194px;
      height: 106px;
      @media ${({ theme }) => theme.breakpoints.mobile} {
        width: 30%;
        height: auto;
      }
    }
  }
`

const StyledProductList = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    flex-direction: column;
    gap: 10px;
  }
`

const products: Product[] = [
  {
    id: '1',
    name: 'Sliver Shell',
    desc: 'A beautiful shell with a silver finish.',
    price: '1.00',
    discountPrice: '1.00',
    airdropAmount: 3,
    amount: 1,
    type: 'sliver',
    image: Sliver,
  },
  {
    id: '2',
    name: 'Sliver Shell * 3',
    desc: 'A beautiful shell with a silver finish.',
    price: '3.00',
    discountPrice: '2.50',
    airdropAmount: 0,
    amount: 3,
    type: 'sliver',
    image: Sliver,
  },
  {
    id: '3',
    name: 'Sliver Shell * 10',
    desc: 'A beautiful shell with a silver finish.',
    price: '10.00',
    discountPrice: '5.00',
    airdropAmount: 0,
    amount: 10,
    type: 'sliver',
    image: Sliver,
  },
  {
    id: '4',
    name: 'Golden Shell',
    desc: 'A beautiful shell with a golden finish.',
    price: '2.0',
    discountPrice: '2.0',
    airdropAmount: 1,
    amount: 1,
    type: 'golden',
    image: Golden,
  },
  {
    id: '5',
    name: 'Golden Shell * 3',
    desc: 'A beautiful shell with a golden finish.',
    price: '6.00',
    discountPrice: '5.00',
    airdropAmount: 0,
    amount: 3,
    type: 'golden',
    image: Golden,
  },
  {
    id: '6',
    name: 'Golden Shell * 10',
    desc: 'A beautiful shell with a golden finish.',
    price: '20.00',
    discountPrice: '15.00',
    airdropAmount: 0,
    amount: 10,
    type: 'golden',
    image: Golden,
  },
  {
    id: '7',
    name: 'Diamond Shell',
    desc: 'A beautiful shell with a diamond finish.',
    price: '3.00',
    discountPrice: '3.00',
    airdropAmount: 0,
    amount: 1,
    type: 'diamond',
    image: Diamond,
  },
  {
    id: '8',
    name: 'Diamond Shell * 3',
    desc: 'A beautiful shell with a diamond finish.',
    price: '9.00',
    discountPrice: '8.10',
    airdropAmount: 0,
    amount: 3,
    type: 'diamond',
    image: Diamond,
  },
  {
    id: '9',
    name: 'Diamond Shell * 10',
    desc: 'A beautiful shell with a silver finish.',
    price: '30.00',
    discountPrice: '24.00',
    airdropAmount: 0,
    amount: 10,
    type: 'diamond',
    image: Diamond,
  },
]

export default function StorePage() {
  const { t } = useTranslation()
  const [selectedProduct, setSelectedProduct] = useState<GroupedProduct | null>(null)
  const groupedProducts = useMemo(() => {
    const grouped = products.reduce<Record<string, GroupedProduct>>((acc, product) => {
      if (!acc[product.type]) {
        acc[product.type] = {
          main: product,
          all: [product],
        }
      } else {
        if (product.amount === 1) {
          acc[product.type].main = product
        }
        acc[product.type].all.push(product)
      }
      return acc
    }, {})
    return Object.values(grouped).sort((a, b) => a.main.id.localeCompare(b.main.id))
  }, [])
  return (
    <Layout title={t('store.title')}>
      <StyledStorePage>
        <StyledHeroSection>
          <StyledHeroText>
            <Display2>{t('store.hero')}</Display2>
          </StyledHeroText>
          <StyledSubtitle>
            <ContentMedium>{t('store.subtitle')}</ContentMedium>
          </StyledSubtitle>
          <StyledHeroImg />
        </StyledHeroSection>
        <StyledCurtain />
        <StyledProductBody>
          <StyledShellChestTitle>
            <img src={GemLeft} alt="Gem Left" />
            <Display3>{t('store.shell_chest')}</Display3>
            <img src={GemRight} alt="Gem Left" />
          </StyledShellChestTitle>
          <StyledProductList>
            {groupedProducts.map((p, index) => (
              <ProductCard key={index} product={p.main} onClick={() => setSelectedProduct(p)} />
            ))}
          </StyledProductList>
        </StyledProductBody>
      </StyledStorePage>
      {selectedProduct && <ProductPopup product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </Layout>
  )
}
