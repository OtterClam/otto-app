import { WHITE_PAPER_LINK } from 'constant'
import Layout from 'Layout'
import useProducts from 'models/store/useProducts'
import { useMemo, useState } from 'react'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { ContentMedium, Display3 } from 'styles/typography'
import MarkdownWithHtml from 'components/MarkdownWithHtml'
import useMyItems from 'hooks/useMyItems'
import Curtain from './Curtain'
import GemLeft from './gem-left.png'
import GemRight from './gem-right.png'
import BorderedProductCard from './BorderedProductCard'
import ProductPopup, { GroupedProduct } from './ProductPopup'
import StoreHero from './StoreHero'
import StarLeft from './star-left.png'
import StarRight from './star-right.png'
import FlashSellInfo from './FlashSellInfo'

const StyledStorePage = styled.div`
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.otterBlack};
`

const StyledCurtain = styled(Curtain)`
  width: calc(100% + 2px);
  transform: translate(-2px, -4px);
  z-index: 1;
`

const StyledHeroSection = styled.section`
  width: 100%;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.otterBlack};
  margin-top: -20px;
`

const StyledFlashSellBody = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 80%;
  max-width: 880px;
  padding-bottom: 40px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding: 24px 0;
  }
`

const StyledProductBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 80%;
  max-width: 880px;
  padding-bottom: 40px;

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

const StyledChestDesc = styled(ContentMedium).attrs({ as: 'p' })`
  text-align: center;

  a {
    color: ${({ theme }) => theme.colors.clamPink};
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
  const { t } = useTranslation('', { keyPrefix: 'store' })
  const [selectedProduct, setSelectedProduct] = useState<GroupedProduct | null>(null)
  const { products } = useProducts()
  const groupedProducts = useMemo(() => {
    const grouped = products
      .filter(p => p.type !== 'helldice')
      .reduce<Record<string, GroupedProduct>>((acc, product) => {
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
  const { items } = useMyItems()
  const flashSellStart = 1655891027241
  const flashSellEnd = 1655977433796
  return (
    <Layout title={t('title')} background="dark">
      <StyledStorePage>
        <StyledCurtain />
        <StyledHeroSection>
          <StoreHero />
        </StyledHeroSection>
        {groupedProducts[0] && Date.now() < flashSellEnd && (
          <StyledFlashSellBody>
            <StyledShellChestTitle>
              <img src={StarLeft.src} alt="Star Left" />
              <Display3>{t('lucky_star_flash_sell')}</Display3>
              <img src={StarRight.src} alt="Star Left" />
            </StyledShellChestTitle>
            <StyledChestDesc>
              <MarkdownWithHtml>{t('lucky_star_flash_desc')}</MarkdownWithHtml>
            </StyledChestDesc>
            <FlashSellInfo
              product={groupedProducts[0].main}
              items={items?.slice(0, 3) || []}
              startTime={flashSellStart}
              endTime={flashSellEnd}
              onClick={() => setSelectedProduct(groupedProducts[0])}
            />
          </StyledFlashSellBody>
        )}
        <StyledProductBody>
          <StyledShellChestTitle>
            <img src={GemLeft.src} alt="Gem Left" />
            <Display3>{t('shell_chest')}</Display3>
            <img src={GemRight.src} alt="Gem Left" />
          </StyledShellChestTitle>
          <StyledChestDesc>
            {t('chest_desc')}
            <a href={WHITE_PAPER_LINK} target="_blank" rel="noreferrer">
              {t('chest_link_part2')}
            </a>
          </StyledChestDesc>
          <StyledProductList>
            {groupedProducts.map((p, index) => (
              <BorderedProductCard key={index} product={p.main} onClick={() => setSelectedProduct(p)} />
            ))}
          </StyledProductList>
        </StyledProductBody>
      </StyledStorePage>
      {selectedProduct && <ProductPopup product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </Layout>
  )
}
