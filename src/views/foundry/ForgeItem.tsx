import Button from 'components/Button'
import ItemCell from 'components/ItemCell'
import ItemType from 'components/ItemType'
import SectionRope from 'components/SectionRope'
import TreasurySection from 'components/TreasurySection'
import { Forge } from 'models/Forge'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { ContentMedium, Display3, Headline, Note } from 'styles/typography'

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

export interface ForgeItemProps {
  forge: Forge
}

export default function ForgeItem({ forge }: ForgeItemProps) {
  const { t } = useTranslation('', { keyPrefix: 'foundry' })

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

        <SectionRope vertical />

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
        </StyledMaterials>
      </StyledDetails>
    </StyledContainer>
  )
}
