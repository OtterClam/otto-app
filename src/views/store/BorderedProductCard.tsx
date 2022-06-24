import BorderContainer from 'components/BorderContainer'
import Product from 'models/store/Product'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import ProductCard from './ProductCard'
import useProductBorderColor from './useProductBorderColor'

const StyledContainer = styled(BorderContainer)`
  padding: 15px;
  background: ${({ theme }) => theme.colors.darkGray400};
`

interface Props {
  product: Product
  onClick: () => void
}

export default function BorderedProductCard({ product, onClick }: Props) {
  const { t } = useTranslation()
  const borderColor = useProductBorderColor(product.type)
  return (
    <StyledContainer borderColor={borderColor}>
      <ProductCard product={product} onClick={onClick} />
    </StyledContainer>
  )
}
