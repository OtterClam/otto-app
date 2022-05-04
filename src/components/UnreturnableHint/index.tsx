import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'
import { Note } from 'styles/typography'
import InfoIcon from 'assets/ui/info.svg'
import UnreturnableIcon from './unreturnable.svg'

const StyledUnreturnableHint = styled.div`
  width: fit-content;
  position: relative;

  &:hover:after {
    display: block;
  }

  &:after {
    content: '';
    display: none;
    position: absolute;

    /* position tooltip correctly */
    left: 100%;
    margin-left: -5px;

    /* vertically center */
    top: 50%;
    transform: translateY(-50%);

    /* the arrow */
    border: 10px solid ${({ theme }) => theme.colors.white};
    border-color: transparent ${({ theme }) => theme.colors.white} transparent transparent;
  }
`

const StyledHint = styled(Note)`
  display: none;
  position: absolute;

  /* vertically center */
  top: 50%;
  transform: translateY(-50%);

  /* move to right */
  left: 100%;
  margin-left: 15px; /* and add a small left margin */

  /* basic styles */
  width: 300px;
  padding: 10px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.white};
  text-align: center;

  filter: drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.25));

  ${StyledUnreturnableHint}:hover & {
    display: block;
  }
`

const StyledUnreturnableText = styled(Note)`
  display: flex;
  align-items: center;
  gap: 5px;

  &:before {
    content: '';
    width: 18px;
    height: 18px;
    background-image: url(${UnreturnableIcon});
    background-size: 100% 100%;
  }

  &:after {
    content: '';
    width: 18px;
    height: 18px;
    background-image: url(${InfoIcon});
    background-size: 100% 100%;
  }
`

export default function UnreturnableHint() {
  const { t } = useTranslation()
  return (
    <StyledUnreturnableHint>
      <StyledUnreturnableText>{t('otto.unreturnable')}</StyledUnreturnableText>
      <StyledHint>{t('otto.unreturnable_hint')}</StyledHint>
    </StyledUnreturnableHint>
  )
}
