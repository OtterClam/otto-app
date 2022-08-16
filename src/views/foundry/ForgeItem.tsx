import formatDate from 'date-fns/format'
import Button from 'components/Button'
import ItemCell from 'components/ItemCell'
import ItemType from 'components/ItemType'
import SectionRope from 'components/SectionRope'
import TreasurySection from 'components/TreasurySection'
import { Forge } from 'models/Forge'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { ContentExtraSmall, ContentMedium, Display3, Headline, Note } from 'styles/typography'
import { useBreakpoints } from 'contexts/Breakpoints'

const StyledContainer = styled.div`
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
`

const StyledTitle = styled(Display3)`
  text-align: center;
`

const StyledDesc = styled(ContentMedium)`
  text-align: center;
`

const StyledDetails = styled.div`
  display: flex;
  position: relative;
  z-index: 0;
  width: 100%;

  @media ${({ theme }) => theme.breakpoints.tablet} {
    flex-direction: column;
  }
`

const StyledResult = styled(TreasurySection).attrs({ showRope: false })`
  flex: 0 300px;
  display: flex;
  gap: 10px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 300px;
  min-width: 300px;
  background: ${({ theme }) => theme.colors.darkGray400};
  min-height: 300px;

  @media ${({ theme }) => theme.breakpoints.tablet} {
    flex: 0 1 318px;
    padding: 10px;
    min-height: 318px;
    max-width: unset;
    min-width: unset;
  }
`

const StyledResultItemPreview = styled(ItemCell)`
  width: 180px;
  height: 180px;
`

const StyledItemType = styled(ItemType)`
  color: ${({ theme }) => theme.colors.crownYellow};

  &::before {
    width: 24px;
    height: 24px;
  }
`

const StyledMaterials = styled(TreasurySection)`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: ${({ theme }) => theme.colors.darkGray400};
  padding: 34px 74px;
`

const StyledMaterialPreview = styled(ItemCell)`
  width: 100px;
  height: 100px;
`

const StyledMaterialList = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
`

const StyledMaterialListItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
`

const StyledMaterialName = styled(Note)`
  color: ${({ theme }) => theme.colors.white};
`

const StyledCount = styled(Note)`
  background: ${({ theme }) => theme.colors.otterBlack};
  border-radius: 14px;
  padding: 5px 10px;
`

const StyledAvaliableTime = styled(ContentExtraSmall)`
  text-align: center;
`

const StyledSectionRope = styled(SectionRope)`
  position: relative;
  z-index: -1;
`

export interface ForgeItemProps {
  forge: Forge
}

const TIME_FORMAT = 'LLL dd H:mm a'

export default function ForgeItem({ forge }: ForgeItemProps) {
  const { t } = useTranslation('', { keyPrefix: 'foundry' })
  const startTime = formatDate(forge.startTime, TIME_FORMAT)
  const endTime = formatDate(forge.endTime, TIME_FORMAT)
  const timeZone = formatDate(new Date(), 'z')
  const { isTablet } = useBreakpoints()

  return (
    <StyledContainer>
      <StyledTitle>{forge.title}</StyledTitle>

      <StyledDesc>{forge.description}</StyledDesc>

      <StyledDetails>
        <StyledResult>
          <Headline>{t('result.title')}</Headline>
          <StyledResultItemPreview item={forge.result} />
          <ContentMedium>{forge.result.name}</ContentMedium>
          <StyledItemType type={forge.result.type} />
        </StyledResult>

        <StyledSectionRope vertical={!isTablet} />

        <StyledMaterials showRope={false}>
          <Headline>{t('materials.title')}</Headline>

          <StyledMaterialList>
            {forge.materials.map((material, index) => (
              <StyledMaterialListItem key={index}>
                <StyledMaterialPreview item={material} />
                <StyledMaterialName>{material.name}</StyledMaterialName>
                <StyledCount>1 / {forge.amounts[index]}</StyledCount>
              </StyledMaterialListItem>
            ))}
          </StyledMaterialList>

          <Button height="60px" Typography={Headline}>
            {t('forgeButton')}
          </Button>

          <StyledAvaliableTime>{t('forgeAvaliableTime', { startTime, endTime, timeZone })}</StyledAvaliableTime>
        </StyledMaterials>
      </StyledDetails>
    </StyledContainer>
  )
}
