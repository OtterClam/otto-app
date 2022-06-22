import BorderContainer from 'components/BorderContainer'
import Button from 'components/Button'
import { useTranslation } from 'next-i18next'
import styled, { useTheme } from 'styled-components/macro'
import { ContentMedium, ContentSmall, Headline, Note } from 'styles/typography'

const StyledOttoCandidate = styled(BorderContainer)`
  display: flex;
  flex-direction: column;
  padding: 15px;
  gap: 10px;

  &:hover {
    transform: scale(1.01);
    background-color: ${({ theme }) => theme.colors.lightGray100};
    box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.2);
    transition: 0.2s;
  }
`

const StyledPFP = styled.img`
  width: 225px;
  height: 225px;
  border: 4px solid ${({ theme }) => theme.colors.otterBlack};
  background: url(/otto-loading.jpg);
  background-size: 100% 100%;
`

const StyledName = styled.p`
  text-align: center;
`

const StyledGender = styled.p``

const StyledDesc = styled.p`
  text-align: center;
  $color: ${({ theme }) => theme.colors.darkGray200};
`

interface Props {
  name: string
  gender: string
  image: string
  onSummon: () => void
}

export default function OttoCandidateCard({ name, gender, image, onSummon }: Props) {
  const { t } = useTranslation()
  const theme = useTheme()
  return (
    <StyledOttoCandidate borderColor={theme.colors.otterBlue}>
      <StyledPFP src={image} />
      <StyledName>
        <ContentMedium>{name}</ContentMedium>
      </StyledName>
      <StyledGender>
        <ContentSmall>{t('portal.gender', { gender })}</ContentSmall>
      </StyledGender>
      <StyledDesc>
        <Note>{t('portal.otto_candidate_desc')}</Note>
      </StyledDesc>
      <Button Typography={Headline} onClick={() => onSummon()}>
        {t('portal.summon_otto_button')}
      </Button>
    </StyledOttoCandidate>
  )
}
