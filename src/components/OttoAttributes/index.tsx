import Constellations from 'assets/constellations'
import format from 'date-fns/format'
import Otto from 'models/Otto'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { Note } from 'styles/typography'
import ClassicIcon from 'assets/badge/classic.png'
import LegendaryIcon from 'assets/badge/legendary.png'

const StyledContainer = styled.div`
  display: grid;
  gap: 1px;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 20px;
`

const StyledAttr = styled(Note)<{ icon: string }>`
  display: flex;
  align-items: center;
  gap: 5px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 4px;

  &::before {
    content: '';
    display: block;
    width: 20px;
    height: 20px;
    background: center / cover url(${({ icon }) => icon});
  }
`

export interface OttoAttributesProps {
  otto?: Otto
}

export default function OttoAttributes({ otto }: OttoAttributesProps) {
  const { t } = useTranslation()

  const attributes = [
    { icon: '/trait-icons/Generation.png', value: t('otto.first_gen') },
    { icon: Constellations[otto?.zodiacSign ?? ''], value: otto?.zodiacSign },
    { icon: '/trait-icons/Birthday.png', value: format(otto?.birthday ?? new Date(0), 'MMM dd, yyyy') },
    { icon: '/trait-icons/Gender.png', value: otto?.gender },
    { icon: '/trait-icons/Personality.png', value: otto?.personality },
    { icon: `/arms/${otto?.armsImage}.png`, value: otto?.coatOfArms },
    {
      icon: otto?.legendary ? LegendaryIcon.src : ClassicIcon.src,
      value: t(otto?.legendary ? 'otto.legendary' : 'otto.classic'),
    },
    { icon: '/trait-icons/Items.png', value: otto?.wearableTraits.length ?? 0 },
    { icon: '/trait-icons/Voice.png', value: otto?.voiceName },
  ]

  return (
    <StyledContainer>
      {attributes.map((attr, index) => (
        <StyledAttr key={index} icon={attr.icon}>
          {attr.value}
        </StyledAttr>
      ))}
    </StyledContainer>
  )
}
