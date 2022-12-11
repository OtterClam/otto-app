import AdventureRibbonText from 'components/AdventureRibbonText'
import AdventureTooltip from 'components/AdventureTooltip'
import ItemCell from 'components/ItemCell'
import TreasurySection from 'components/TreasurySection'
import { useAdventureContractState } from 'contexts/AdventureContractState'
import { AdventureResult } from 'models/AdventureResult'
import Otto from 'models/Otto'
import { useTranslation } from 'next-i18next'
import Image, { StaticImageData } from 'next/image'
import styled from 'styled-components/macro'
import { ContentSmall, Note } from 'styles/typography'
import ApImage from 'assets/adventure/reward/ap.png'
import ExpIcon from './EXP.png'
import ProgressBar from './ProgressBar'
import TcpIcon from './TCP.png'

const StyledTooltip = styled(AdventureTooltip)`
  margin-top: 20px;
`

interface Props {
  className?: string
  result: AdventureResult
  otto: Otto
}

export default function RewardSection({ className, result, otto }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'adventurePopup.resultStep' })
  const {
    state: { walletTcp },
  } = useAdventureContractState()
  return (
    <>
      <StyledRewardSection className={className} showRope={false}>
        <StyledRewardTitle>{t('reward')}</StyledRewardTitle>
        {result.rewards.items.length > 0 && (
          <StyledFoundItemsContainer>
            {result.success && <StyledFoundItemTitle>{t('found_items')}</StyledFoundItemTitle>}
            <StyledFoundItemList>
              {result.rewards.items.map(item => (
                <StyledItemCell showDetailsPopup key={item.tokenId} metadata={item} />
              ))}
            </StyledFoundItemList>
          </StyledFoundItemsContainer>
        )}
        {result.success && (
          <>
            <StyledInfoContainer>
              <Image src={ExpIcon} width={60} height={60} />
              <StyledInfoRightContainer>
                <ContentSmall>LV{otto.level}</ContentSmall>
                <StyledInfoDetailsContainer>
                  <StyledIncrease>+{result.rewards.exp} EXP</StyledIncrease>
                  <ContentSmall>
                    {otto.exp}/{otto.next_level_exp} EXP
                  </ContentSmall>
                </StyledInfoDetailsContainer>
                <StyledProgressBar
                  progress={(otto.exp / otto.next_level_exp) * 100}
                  color="linear-gradient(90deg, #9CFE9F 0%, #9CE0FF 50%, #FFADA9 100%)"
                />
              </StyledInfoRightContainer>
            </StyledInfoContainer>
            <StyledInfoContainer>
              <Image src={TcpIcon} width={60} height={60} />
              <StyledInfoRightContainer>
                <ContentSmall>{t('treasury_chest')}</ContentSmall>
                <StyledInfoDetailsContainer>
                  <StyledIncrease>+{result.rewards.tcp} TCP</StyledIncrease>
                  <ContentSmall>{walletTcp.toNumber() % 100}/100 TCP</ContentSmall>
                </StyledInfoDetailsContainer>
                <StyledProgressBar progress={walletTcp.toNumber() % 100} color="#FFDC77" />
              </StyledInfoRightContainer>
            </StyledInfoContainer>
            <StyledInfoContainer>
              <Image src={ApImage} width={60} height={60} />
              <StyledInfoRightContainer>
                <ContentSmall>{t('adventure_point')}</ContentSmall>
                <StyledInfoDetailsContainer>
                  <StyledIncrease>+{result.rewards.ap} AP</StyledIncrease>
                  <StyledTotalAP>
                    <Image src={ApImage} width={21} height={21} />
                    <ContentSmall>{otto.ap} AP</ContentSmall>
                  </StyledTotalAP>
                </StyledInfoDetailsContainer>
              </StyledInfoRightContainer>
            </StyledInfoContainer>
          </>
        )}
        {!result.success && !result.revived && (
          <>
            <StyledFailedInfoContainer>
              <FailedInfo image={ExpIcon} text={`+${result.rewards.exp} EXP`} />
              <FailedInfo image={TcpIcon} text={`+${result.rewards.tcp} TCP`} />
            </StyledFailedInfoContainer>
            <StyledFailedMask />
            <StyledFailedDesc>{t('failed_desc')}</StyledFailedDesc>
          </>
        )}
      </StyledRewardSection>
      {!result.success && !result.revived && <StyledTooltip content={t('failed_tooltip')} />}
    </>
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

const StyledTotalAP = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
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
  pointer-events: none;
`
