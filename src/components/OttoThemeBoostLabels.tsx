import Otto from 'models/Otto'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { Note } from 'styles/typography'

const StyledContainer = styled(Note)`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
`

const StyledLabel = styled.span<{ boost?: boolean }>`
  display: flex;
  align-items: center;
  height: 28px;
  padding: 0 10px;
  background: ${({ theme, boost }) => (boost ? theme.colors.crownYellow : theme.colors.lightGray200)};
  border-radius: 14px;
  gap: 2px;
`

const StyledIcon = styled.span<{ type: string }>`
  width: 18px;
  height: 18px;
  background: center / cover url(/trait-icons/${({ type }) => encodeURIComponent(type)}.png);
`

export interface OttoThemeBoostLabelsProps {
  otto: Otto
  className?: string
}

export default function OttoThemeBoostLabels({ otto, className }: OttoThemeBoostLabelsProps) {
  const traits = (otto.metadata.otto_details ?? []).filter(trait => trait.theme_boost > 0)
  const { t } = useTranslation('', { keyPrefix: 'themeBoost' })

  return (
    <StyledContainer className={className}>
      {traits.map(trait => (
        <StyledLabel key={trait.type}>
          <StyledIcon type={trait.type} />
          BRS+{trait.theme_boost}
        </StyledLabel>
      ))}
      <StyledLabel boost>{t('comboTag', { combo: otto.themeCombo })}</StyledLabel>
    </StyledContainer>
  )
}
