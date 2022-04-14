import { Trait } from 'models/Otto'
import styled from 'styled-components/macro'
import { useTranslation } from 'react-i18next'
import { ContentLarge, ContentSmall, Note } from 'styles/typography'

const StyledTraitCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;
`

const StyledTopContainer = styled.div`
  display: flex;
`

const StyledTitle = styled.p<{ icon: string }>`
  display: flex;
  align-items: center;
  flex: 1;

  &:before {
    content: '';
    display: inline-block;
    width: 30px;
    height: 30px;
    background-image: url(${({ icon }) => icon});
    background-size: 30px 30px;
    margin-right: 12px;
  }
`

const StyledRarityBadge = styled.div<{ rarity: string }>`
  display: flex;
  align-items: center;
  padding: 0 10px;
  background-color: ${({ theme, rarity }) => (theme.colors.rarity as any)[rarity]};
  border-radius: 6px;
`

const StyledBottomContainer = styled.div`
  display: flex;
  gap: 20px;
`

const StyledImageContainer = styled.div<{ rarity: string }>`
  width: 120px;
  height: 120px;
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 5px;
  position: relative;

  &:before {
    content: ' ';
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    border: 5px solid ${({ theme, rarity }) => (theme.colors.rarity as any)[rarity]};
    border-radius: 5px;
    pointer-events: none;
  }

  &:after {
    content: ' ';
    position: absolute;
    top: 3px;
    left: 3px;
    right: 3px;
    bottom: 3px;
    border: 2px solid ${({ theme }) => theme.colors.otterBlack};
    pointer-events: none;
  }
`

const StyledImage = styled.img`
  width: 100%;
  border-radius: 5px;
`

const StyledInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`

const StyledRarityScore = styled.p``

const StyledStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 60px);
  grid-column-gap: 10px;
`

const StyledStat = styled.p`
  display: flex;
  justify-content: space-between;
`

export interface Props {
  trait: Trait
}

export default function TraitCard({ trait: { type, name, image, stats, rarity, total_rarity_score } }: Props) {
  const { t } = useTranslation()
  const title = t(`otto.traits.title`, { type: t(`otto.traits.${type}`), name })
  return (
    <StyledTraitCard>
      <StyledTopContainer>
        <StyledTitle icon={encodeURI(`/trait-icons/${type}.png`)}>
          <ContentLarge>{title}</ContentLarge>
        </StyledTitle>
        <StyledRarityBadge rarity={rarity}>
          <ContentSmall>{t(`otto.rarity.${rarity}`)}</ContentSmall>
        </StyledRarityBadge>
      </StyledTopContainer>
      <StyledBottomContainer>
        {image && (
          <StyledImageContainer rarity={rarity}>
            <StyledImage src={image} />
          </StyledImageContainer>
        )}
        <StyledInfoContainer>
          <StyledRarityScore>
            <ContentSmall>{t('otto.rarity_score', { score: total_rarity_score })}</ContentSmall>
          </StyledRarityScore>
          <StyledStats>
            {stats.map(({ name, value }, i) => (
              <StyledStat key={i}>
                <Note>{name}</Note>
                <Note>{value}</Note>
              </StyledStat>
            ))}
          </StyledStats>
        </StyledInfoContainer>
      </StyledBottomContainer>
    </StyledTraitCard>
  )
}
