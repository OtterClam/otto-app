import Ribbon from 'assets/ui/ribbon.svg'
import Button from 'components/Button'
import CloseButton from 'components/CloseButton'
import Fullscreen from 'components/Fullscreen'
import ItemCell from 'components/ItemCell'
import Item from 'models/Item'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import styled, { keyframes } from 'styled-components/macro'
import { ContentSmall, Headline } from 'styles/typography'
import Star from './large-star.svg'

const StyledOpenItemView = styled.div`
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;
  height: calc(80vh);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 50px 108px;
  gap: 20px;
  overflow-x: hidden;
  overflow-y: auto;

  > * {
    position: relative;
  }

  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding: 50px 20px;
  }
`

const StyledTitle = styled(Headline)`
  text-align: center;
`

const StyledCloseButton = styled(CloseButton)`
  position: absolute;
  top: 40px;
  right: 40px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    top: 10px;
    right: 10px;
  }
`

const Spin = keyframes`
	from{transform:rotate(0deg)}
	to{transform:rotate(360deg)}
`

const StyledBackgroundContainer = styled.div`
  position: absolute;
  width: 908px;
  height: 908px;
  overflow: hidden;
  top: calc(40% - 454px);
  left: calc(50% - 454px);
`

const StyledBackground = styled.div`
  width: 908px;
  height: 908px;
  background: url(${Star}) no-repeat;
  background-size: 100% 100%;
  animation: ${Spin} 12s linear infinite;
`

const StyledRibbonText = styled.div`
  min-width: 223px;
  min-height: 53px;
  text-align: center;
  color: ${({ theme }) => theme.colors.white};
  background-image: url(${Ribbon});
  padding-top: 6px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding-top: 10px;
  }
`

const StyledItemList = styled.div<{ count: number }>`
  display: grid;
  justify-content: left;
  align-items: center;
  justify-items: center;
  gap: 20px;
  grid-template-columns: repeat(${({ count }) => (count > 5 ? 5 : count)}, 115px);

  @media ${({ theme }) => theme.breakpoints.mobile} {
    grid-template-columns: repeat(${({ count }) => (count > 1 ? 2 : count)}, 115px);
  }
`

const StyledCheckOutButton = styled(Button)``

enum State {
  Playing,
  Finished,
}

interface Props {
  items: Item[]
  onClose: () => void
}

export default function OpenItemView({ items, onClose }: Props) {
  const { t } = useTranslation()
  // const [state, setState] = useState(State.Playing)
  return (
    <Fullscreen>
      <StyledOpenItemView>
        <StyledBackgroundContainer>
          <StyledBackground />
        </StyledBackgroundContainer>
        <StyledTitle>{t('store.popup.open_title')}</StyledTitle>
        <StyledRibbonText>
          <ContentSmall>{t('store.popup.received_items', { count: items.length })}</ContentSmall>
        </StyledRibbonText>
        <StyledItemList count={items.length}>
          {items.map((item, index) => (
            <ItemCell key={index} item={item} />
          ))}
        </StyledItemList>
        <StyledCloseButton color="white" onClose={onClose} />
        <Link to="/my-items">
          <StyledCheckOutButton>
            <Headline>{t('store.popup.check_out')}</Headline>
          </StyledCheckOutButton>
        </Link>
      </StyledOpenItemView>
    </Fullscreen>
  )
}
