import MarkdownWithHtml from 'components/MarkdownWithHtml'
import { WHITE_PAPER_LINK } from 'constant'
import { useApiCall } from 'contexts/Api'
import { SellData } from 'libs/api'
import { useTranslation } from 'next-i18next'
import Head from 'next/head'
import { useRef, useState } from 'react'
import styled from 'styled-components/macro'
import { ContentMedium, Display3 } from 'styles/typography'
import BorderedProductCard from './BorderedProductCard'
import Curtain from './Curtain'
import FishProductCard from './FishProductCard'
import FlashSellInfo from './FlashSellInfo'
import GemLeft from './gem-left.png'
import GemRight from './gem-right.png'
import ProductPopup, { GroupedProduct } from './ProductPopup'
import StarLeft from './star-left.png'
import StarRight from './star-right.png'
import StoreHero from './StoreHero'

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
  position: relative;
  width: 100%;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.otterBlack};
  margin-top: -20px;
  margin-bottom: 20px;

  &::before {
    content: '';
    display: block;
    padding-bottom: 60.7722008%;
  }
`

const StyledStoreHero = styled(StoreHero)`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
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
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    flex-direction: column;
  }
`

export default function StorePage() {
  const { t } = useTranslation('', { keyPrefix: 'store' })
  const bodyRef = useRef<HTMLDivElement>(null)
  const { result: chestStore } = useApiCall('getChestStore', [], true, [])
  const [selectedProduct, setSelectedProduct] = useState<GroupedProduct | null>(null)
  const { result: fishStore } = useApiCall('getFishStoreProducts', [], true, [])
  const onSelectSell = (data: SellData) => {
    setSelectedProduct({
      sellId: data.id,
      title: data.popup_title,
      desc: data.popup_desc,
      image: data.popup_image,
      main: data.products[0],
      all: data.products,
      processing_images: data.processing_images,
    })
  }
  return (
    <>
      <Head>
        <title>{t('docTitle')}</title>
        <meta property="og:title" content={t('docTitle')} />
        <meta name="description" content={t('docDesc')} />
        <meta property="og:description" content={t('docDesc')} />
        <meta property="og:image" content="/og.jpg" />
      </Head>
      <StyledStorePage>
        <StyledCurtain />
        <StyledHeroSection>
          <StyledStoreHero onClickScroll={() => bodyRef?.current?.scrollIntoView({ behavior: 'smooth' })} />
        </StyledHeroSection>
        {chestStore?.flashSells?.map(
          (flashSell, i) =>
            Date.now() < new Date(flashSell.end_time).valueOf() && (
              <StyledFlashSellBody key={flashSell.id} ref={i === 0 ? bodyRef : null}>
                <StyledShellChestTitle>
                  <img src={StarLeft.src} alt="Star Left" />
                  <Display3>{flashSell.name}</Display3>
                  <img src={StarRight.src} alt="Star Left" />
                </StyledShellChestTitle>
                <StyledChestDesc>
                  <MarkdownWithHtml>{flashSell.desc}</MarkdownWithHtml>
                </StyledChestDesc>
                <FlashSellInfo flashSell={flashSell} onClick={() => onSelectSell(flashSell)} />
              </StyledFlashSellBody>
            )
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
        <StyledProductBody ref={(chestStore?.flashSells.length || 0) > 0 ? null : bodyRef}>
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
            {chestStore?.regulars.map((p, index) => (
              <BorderedProductCard key={index} product={p.products[0]} onClick={() => onSelectSell(p)} />
            ))}
          </StyledProductList>
        </StyledProductBody>
      </StyledStorePage>
      {selectedProduct && <ProductPopup product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </>
  )
}
