import { AdventureDisplayedBoost } from 'models/AdventureDisplayedBoost'
import { BoostType } from 'models/AdventureLocation'
import styled from 'styled-components/macro'
import { Note } from 'styles/typography'

const StyledNormalBoostIcon = styled.span<{ icon: string }>`
  flex: 0 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 30px;
  max-width: 30px;
  height: 18px;

  &::before {
    content: '';
    display: block;
    width: 18px;
    height: 18px;
    background: center / cover url(${({ icon }) => icon});
  }
`

const StyledFirstMatchBoostIcon = styled.span<{ attr: string }>`
  flex: 0 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 30px;
  max-width: 30px;
  height: 18px;
  background: ${({ theme, attr }) => theme.colors.attr[attr]};
  color: ${({ theme }) => theme.colors.otterBlack};

  &::before {
    content: '${({ attr }) => attr}';
  }
`

const StyledContainer = styled(Note)<{ disabled: boolean }>`
  display: flex;
  gap: 10px;
  white-space: pre-wrap;
  ${({ disabled }) =>
    disabled &&
    `
    opacity: .3;
  `}
`

export interface BoostProps {
  boost: AdventureDisplayedBoost
  noPreview?: boolean
}

export default function Boost({ boost, noPreview }: BoostProps) {
  return (
    <StyledContainer disabled={!boost.effective && !noPreview}>
      {boost.boostType === BoostType.FirstMatchGroup && (
        <StyledFirstMatchBoostIcon attr={boost.attr.toLocaleUpperCase()} />
      )}
      {boost.boostType !== BoostType.FirstMatchGroup && <StyledNormalBoostIcon icon={boost.icon} />}
      <div>{boost.message}</div>
    </StyledContainer>
  )
}
