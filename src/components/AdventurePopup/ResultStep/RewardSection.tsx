import AdventureRibbonText from 'components/AdventureRibbonText'
import ItemCell from 'components/ItemCell'
import TreasurySection from 'components/TreasurySection'
import useMyItems from 'hooks/useMyItems'
import { useTranslation } from 'next-i18next'
import Image, { StaticImageData } from 'next/image'
import styled from 'styled-components/macro'
import { ContentSmall, Note } from 'styles/typography'
import ProgressBar from './ProgressBar'
import ExpIcon from './EXP.png'
import TcpIcon from './TCP.png'

interface Props {
  className?: string
  succeeded: boolean
}

export default function RewardSection({ className, succeeded }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'adventurePopup.resultStep' })
  const { items } = useMyItems()
  const itemsFound = items.slice(0, 3)
  return (
    <StyledRewardSection className={className} showRope={false}>
      <StyledRewardTitle>{t('reward')}</StyledRewardTitle>
      {itemsFound.length > 0 && (
        <StyledFoundItemsContainer>
          {succeeded && <StyledFoundItemTitle>{t('found_items')}</StyledFoundItemTitle>}
          <StyledFoundItemList>
            {itemsFound.map(item => (
              <StyledItemCell key={item.id} item={item} />
            ))}
          </StyledFoundItemList>
        </StyledFoundItemsContainer>
      )}
      {succeeded && (
        <>
          <StyledInfoContainer>
            <Image src={ExpIcon} width={60} height={60} />
            <StyledInfoRightContainer>
              <ContentSmall>LV1</ContentSmall>
              <StyledInfoDetailsContainer>
                <StyledIncrease>+50 EXP</StyledIncrease>
                <ContentSmall>100/100 EXP</ContentSmall>
              </StyledInfoDetailsContainer>
              <StyledProgressBar progress={40} color="linear-gradient(90deg, #9CFE9F 0%, #9CE0FF 50%, #FFADA9 100%)" />
            </StyledInfoRightContainer>
          </StyledInfoContainer>
          <StyledInfoContainer>
            <Image src={TcpIcon} width={60} height={60} />
            <StyledInfoRightContainer>
              <ContentSmall>{t('treasury_chest')}</ContentSmall>
              <StyledInfoDetailsContainer>
                <StyledIncrease>+5 TCP</StyledIncrease>
                <ContentSmall>100/100 TCP</ContentSmall>
              </StyledInfoDetailsContainer>
              <StyledProgressBar progress={40} color="#FFDC77" />
            </StyledInfoRightContainer>
          </StyledInfoContainer>
        </>
      )}
      {!succeeded && (
        <>
          <StyledFailedInfoContainer>
            <FailedInfo image={ExpIcon} text="+50 EXP" />
            <FailedInfo image={TcpIcon} text="+5 TCP" />
          </StyledFailedInfoContainer>
          <StyledFailedMask />
          <StyledFailedDesc>{t('failed_desc')}</StyledFailedDesc>
        </>
      )}
    </StyledRewardSection>
  )
}

const StyledRewardSection = styled(TreasurySection)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ theme }) => theme.colors.darkGray400};
  padding: 40px 15px 15px 15px;
  gap: 20px;
`

const StyledRewardTitle = styled(AdventureRibbonText)`
  position: absolute;
  top: -20px;
`

const StyledFoundItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

const StyledFoundItemTitle = styled(ContentSmall).attrs({ as: 'h2' })`
  color: ${({ theme }) => theme.colors.white};
`

const StyledFoundItemList = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`

const StyledItemCell = styled(ItemCell)`
  width: 70px;
  height: 70px;
`

const StyledInfoContainer = styled.div`
  display: flex;
  color: ${({ theme }) => theme.colors.white};
  width: 100%;
  gap: 10px;
  padding: 20px 0;
  border-top: 1px ${({ theme }) => theme.colors.otterBlack} solid;
`

const StyledInfoRightContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 5px;
`

const StyledInfoDetailsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

const StyledIncrease = styled(ContentSmall)`
  color: ${({ theme }) => theme.colors.crownYellow};
`

const StyledProgressBar = styled(ProgressBar)``

const StyledFailedInfoContainer = styled.div`
  width: 100%;
  display: flex;
  > * {
    &:first-child {
      border-right: 1px solid ${({ theme }) => theme.colors.otterBlack};
    }
  }
`

interface FailedInfoProps {
  className?: string
  image: StaticImageData
  text: string
}

function FailedInfo({ className, image, text }: FailedInfoProps) {
  return (
    <StyledFailedInfo className={className}>
      <Image src={image} width={60} height={60} />
      <StyledFailedInfoText>{text} </StyledFailedInfoText>
    </StyledFailedInfo>
  )
}

const StyledFailedInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
`

const StyledFailedInfoText = styled(ContentSmall)`
  color: ${({ theme }) => theme.colors.white};
`

const StyledFailedDesc = styled(Note).attrs({ as: 'p' })`
  color: ${({ theme }) => theme.colors.white};
  position: relative;
`

const StyledFailedMask = styled.div`
  position: absolute;
  background: ${({ theme }) => theme.colors.darkGray400};
  opacity: 0.5;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`
