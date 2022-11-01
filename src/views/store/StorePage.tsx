import MarkdownWithHtml from 'components/MarkdownWithHtml'
import { WHITE_PAPER_LINK } from 'constant'
import { FlashSellResponse } from 'libs/api'
import { useApi, useApiCall } from 'contexts/Api'
import useProducts from 'models/store/useProducts'
import { useTranslation } from 'next-i18next'
import { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components/macro'
import { ContentMedium, Display3 } from 'styles/typography'
import BorderedProductCard from './BorderedProductCard'
import Curtain from './Curtain'
import FlashSellInfo from './FlashSellInfo'
import GemLeft from './gem-left.png'
import GemRight from './gem-right.png'
import ProductPopup, { GroupedProduct } from './ProductPopup'
import StarLeft from './star-left.png'
import StarRight from './star-right.png'
import StoreHero from './StoreHero'
import FishProductCard from './FishProductCard'

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
  margin-bottom: 20px;
`

const StyledFlashSellBody = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 80%;
  max-width: 880px;
  padding-bottom: 40px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 95%;
    padding: 24px 0;
  }
`

const StyledProductBody = styled.section`
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
    &:first-child,
    &:last-child {
      max-width: 230px;
      min-width: 230px;
      height: 120px;

      @media ${({ theme }) => theme.breakpoints.mobile} {
        max-width: 30%;
        min-width: 30%;
        height: auto;
      }
    }

    &:nth-child(2) {
      flex: 1;
      text-align: center;
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

const REGULAR_PRODUCT_TYPES = ['silver', 'golden', 'diamond']

export default function StorePage() {
  const { t } = useTranslation('', { keyPrefix: 'store' })
  const api = useApi()
  const bodyRef = useRef<HTMLDivElement>(null)
  const [flashSell, setFlashSell] = useState<FlashSellResponse | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<GroupedProduct | null>(null)
  const { result: fishStore } = useApiCall('getFishStoreProducts', [], true, [])
  const { products } = useProducts()
  const groupedProducts = useMemo(() => {
    const grouped = products.reduce<Record<string, GroupedProduct>>((acc, product) => {
      if (!acc[product.type]) {
        acc[product.type] = {
          title: product.name,
          desc: product.desc,
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
    return Object.values(grouped).sort((a, b) => (a.main.id > b.main.id ? 1 : -1))
  }, [products])
  const displayProducts = useMemo(
    () => groupedProducts.filter(p => REGULAR_PRODUCT_TYPES.indexOf(p.main.type) !== -1),
    [groupedProducts]
  )
  useEffect(() => {
    if (products.length > 0) {
      api
        .getFlashSell()
        .then(sell => {
          setFlashSell({
            ...sell,
            products: products
              .filter(p => p.type === sell.type)
              .map(p => ({
                ...p,
                ...sell.products.find(sp => sp.id === p.id),
              })),
          })
        })
        .catch(console.error)
    }
  }, [api, products])
  return (
    <>
      <StyledStorePage>
        <StyledCurtain />
        <StyledHeroSection>
          <StoreHero onClickScroll={() => bodyRef?.current?.scrollIntoView({ behavior: 'smooth' })} />
        </StyledHeroSection>
        {flashSell && Date.now() < new Date(flashSell.end_time).valueOf() && (
          <StyledFlashSellBody ref={bodyRef}>
            <StyledShellChestTitle>
              <img src={StarLeft.src} alt="Star Left" />
              <Display3>{flashSell.name}</Display3>
              <img src={StarRight.src} alt="Star Left" />
            </StyledShellChestTitle>
            <StyledChestDesc>
              <MarkdownWithHtml>{flashSell.desc}</MarkdownWithHtml>
            </StyledChestDesc>
            <FlashSellInfo
              flashSell={flashSell}
              onClick={() =>
                setSelectedProduct({
                  title: flashSell.popup_title,
                  desc: flashSell.popup_desc,
                  image: flashSell.popup_image,
                  main: flashSell.products[0],
                  all: flashSell.products,
                  processing_images: flashSell.processing_images,
                })
              }
            />
          </StyledFlashSellBody>
        )}
        {fishStore &&
          fishStore.length > 0 &&
          fishStore.map((store, i) => (
            <StyledProductBody key={i}>
              <StyledShellChestTitle>
                <img src={store.left_img} alt="Left" />
                <Display3>{store.title}</Display3>
                <img src={store.right_img} alt="Right" />
              </StyledShellChestTitle>
              <StyledChestDesc>
                <MarkdownWithHtml>{store.desc}</MarkdownWithHtml>
              </StyledChestDesc>
              <StyledProductList>
                {store.products.map((p, index) => (
                  <FishProductCard key={index} product={p} />
                ))}
              </StyledProductList>
            </StyledProductBody>
          ))}
        <StyledProductBody ref={flashSell ? null : bodyRef}>
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
            {displayProducts.map((p, index) => (
              <BorderedProductCard key={index} product={p.main} onClick={() => setSelectedProduct(p)} />
            ))}
          </StyledProductList>
        </StyledProductBody>
      </StyledStorePage>
      {selectedProduct && <ProductPopup product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </>
  )
}
