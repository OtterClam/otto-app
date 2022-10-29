import BorderContainer from 'components/BorderContainer'
import Product from 'models/store/Product'
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
  const borderColor = useProductBorderColor(product.type)
  return (
    <StyledContainer borderColor={borderColor}>
      <ProductCard product={product} onClick={onClick} />
    </StyledContainer>
  )
}
