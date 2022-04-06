import BorderContainer from 'components/BorderContainer'
import { ottoClick } from 'constant'
import useOtto from 'hooks/useOtto'
import { RawOtto } from 'models/Otto'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled, { useTheme } from 'styled-components'
import { Caption, ContentMedium, ContentSmall } from 'styles/typography'

const StyledOttoCard = styled(BorderContainer)`
  width: 265px;
  height: 448px;
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.colors.otterBlack};

  padding: 15px;
  gap: 12px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 100%;
    height: 363px;
    padding: 8px 5px;
    gap: 8px;
    align-items: center;
  }

  &:hover {
    transform: scale(1.01);
    background-color: ${({ theme }) => theme.colors.lightGray100};
    box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.2);
    transition: 0.2s;
  }
`

const StyledPortalImage = styled.img`
  width: 225px;
  height: 225px;
  border: 4px solid ${({ theme }) => theme.colors.otterBlack};

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 90%;
    height: unset;
  }
`

const StyledOttoName = styled.h2`
  text-align: center;
`

const StyledRarityScore = styled.p``

const StyledAttrs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 60px);
  column-gap: 10px;
`

const StyledAttr = styled.div`
  display: flex;
  justify-content: space-between;
`

interface Props {
  rawOtto: RawOtto
}

export default function OttoCard({ rawOtto }: Props) {
  const { t } = useTranslation()
  const theme = useTheme()
  const navigate = useNavigate()
  const { loading, otto } = useOtto(rawOtto)
  return (
    <a
      href={rawOtto.tokenId}
      onClick={async e => {
        e.preventDefault()
        ottoClick.play()
        navigate(rawOtto.tokenId)
      }}
    >
      <StyledOttoCard borderColor={theme.colors.lightGray400}>
        <StyledPortalImage src={otto?.image} />
        <StyledOttoName>
          <ContentMedium>{otto?.name}</ContentMedium>
        </StyledOttoName>
        <StyledRarityScore>
          <ContentSmall>{t('my_ottos.rarity_score', { score: otto?.baseRarityScore })}</ContentSmall>
        </StyledRarityScore>
        <StyledAttrs>
          {otto?.metadata?.otto_attrs
            ?.filter(p => p.trait_type !== 'BRS')
            .map(({ trait_type, value }) => (
              <StyledAttr>
                <Caption>{trait_type}</Caption>
                <Caption>{value}</Caption>
              </StyledAttr>
            ))}
        </StyledAttrs>
      </StyledOttoCard>
    </a>
  )
}
