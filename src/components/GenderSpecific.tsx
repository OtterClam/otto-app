import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { Caption } from 'styles/typography'
import Lock from 'assets/ui/lock.svg'

const StyledGenderSpecific = styled(Caption)<{ gender: string }>`
  display: ${({ gender }) => (gender === 'both' ? 'none' : 'flex')};
  align-items: center;
  &:before {
    content: '';
    display: block;
    width: 18px;
    height: 18px;
    background-image: url(${Lock.src});
    background-size: 100% 100%;
    margin-right: 10px;
  }
`

interface Props {
  equippableGender: string
}

export default function GenderSpecific({ equippableGender }: Props) {
  const { t } = useTranslation()
  equippableGender = equippableGender.toLowerCase()
  return (
    <StyledGenderSpecific as="p" gender={equippableGender}>
      {t('otto.gender_specific', { context: equippableGender })}
    </StyledGenderSpecific>
  )
}
