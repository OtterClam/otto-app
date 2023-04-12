import styled from 'styled-components/macro'
import { ContentMedium, Note } from 'styles/typography'
import { AdventureLocation } from 'models/AdventureLocation'
import { useTranslation } from 'next-i18next'

const skullImage = '/images/adventure/skull.png'
const lockImage = '/images/adventure/lock.png'
const locationNameBgImage = {
  src: '/images/adventure/location_name.png',
  width: 386,
  height: 162,
}

const StyledName = styled.div`
  background: center / cover url(${locationNameBgImage.src});
  width: ${locationNameBgImage.width / 2}px;
  height: ${locationNameBgImage.height / 2}px;
`

const StyledNameLabel = styled(ContentMedium).attrs({ as: 'h3' })`
  margin: 25px 0 13px 20px;
  color: ${({ theme }) => theme.colors.otterBlack};
`

const StyledDifficulty = styled(Note)`
  display: flex;
  gap: 5px;
  align-items: center;
  position: absolute;
  height: 18px;
  bottom: 0;
  left: 20px;
  color: ${({ theme }) => theme.colors.white};
`

const StyledLevel = styled(Note)`
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.otterBlack};
  align-items: center;
  height: 22px;
  color: ${({ theme }) => theme.colors.white};
  padding: 0 5px;

  &::before {
    content: '';
    display: block;
    width: 18px;
    height: 18px;
    background: center / cover url(${lockImage});
  }
`

const StyledSkullList = styled.div`
  display: flex;
  align-items: center;
`

const StyledSkull = styled.span`
  display: block;
  width: 12px;
  height: 12px;
  background: center / cover url(${skullImage});
`

export interface AdventureLocationNameProps {
  className?: string
  location: AdventureLocation
}

export default function AdventureLocationName({ className, location }: AdventureLocationNameProps) {
  const { t } = useTranslation('', { keyPrefix: 'adventureLocationPopup' })

  return (
    <StyledName className={className}>
      <StyledNameLabel>{location.name}</StyledNameLabel>
      <StyledLevel>LV {location.minLevel}</StyledLevel>
      <StyledDifficulty>
        {t('difficulty')}
        <StyledSkullList>
          {' '
            .repeat(location.difficulty)
            .split('')
            .map((_, i) => (
              <StyledSkull key={i} />
            ))}
        </StyledSkullList>
      </StyledDifficulty>
    </StyledName>
  )
}
