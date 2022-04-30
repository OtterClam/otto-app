import Layout from 'Layout'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'
import { ContentMedium, Display2, Display3 } from 'styles/typography'
import Diamond from 'models/store/images/diamond.png'
import Golden from 'models/store/images/golden.png'
import Sliver from 'models/store/images/sliver.png'
import Product from 'models/store/Product'
import useProducts from 'models/store/useProducts'
import Curtain from './Curtain'
import GemLeft from './gem-left.png'
import GemRight from './gem-right.png'
import ProductCard from './ProductCard'
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

const StyledCurtain = styled(Curtain)`
  width: calc(100% + 2px);
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

export default function StorePage() {
  const { t } = useTranslation()
  const [selectedProduct, setSelectedProduct] = useState<GroupedProduct | null>(null)
  const { products } = useProducts()
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
  }, [products])
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
