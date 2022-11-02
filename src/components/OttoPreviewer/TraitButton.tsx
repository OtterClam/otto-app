import { Trait } from 'models/Otto'
import styled, { css } from 'styled-components/macro'
import React from 'react'
import Image from 'next/image'
import Skeleton from 'react-loading-skeleton'
import noop from 'lodash/noop'
import lockImage from './lock.svg'

const StyledButton = styled.button<{ traitType?: string; trait?: Trait; locked?: boolean }>`
  position: relative;
  background: ${({ theme, trait }) => (trait ? theme.colors.rarity[trait.rarity] : theme.colors.darkGray200)};
  padding: 2px;
  width: 40px;
  height: 40px;
  box-sizing: border-box;
  border: 1px ${({ theme }) => theme.colors.otterBlack} solid;
  border-radius: 2px;

  ${({ traitType }) =>
    traitType &&
    css<{ traitType?: string; trait?: Trait; locked?: boolean }>`
      &::before {
        position: absolute;
        top: 50%;
        ${({ locked }) => (locked ? 'left: 0' : 'right: 0')};
        transform: ${({ locked }) => (locked ? 'translate(-14px, -11px)' : 'translate(14px, -11px)')};
        z-index: 1;
        content: '';
        background: center / 16px 16px url(${({ traitType }) => encodeURI(`/trait-icons/${traitType}.png`)}) no-repeat;
        background-color: ${({ theme }) => theme.colors.white};
        width: 22px;
        height: 22px;
        border: 1px ${({ theme }) => theme.colors.otterBlack} solid;
        box-sizing: border-box;
        border-radius: 11px;
      }

      &:disabled::after {
        position: absolute;
        z-index: 1;
        right: 0;
        bottom: 0;
        content: '';
        background: url(${lockImage.src});
        width: 18px;
        height: 18px;
      }
    `}
`

const StyledImage = styled.div`
  width: 34px;
  height: 34px;
  box-sizing: border-box;
  border: 1px ${({ theme }) => theme.colors.otterBlack} solid;
`

const StyledSkeleton = styled(Skeleton)`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`

export interface TraitButtonProps {
  type?: string
  trait?: Trait
  locked?: boolean
  onSelect?: (type: string, trait?: Trait) => void
}

export default React.memo(
  function TraitButton({ type, trait, locked, onSelect = noop }: TraitButtonProps) {
    if (!type) {
      return (
        <StyledButton as="div">
          <StyledSkeleton borderRadius={0} />
        </StyledButton>
      )
    }
    return (
      <StyledButton
        disabled={locked}
        traitType={type}
        trait={trait}
        locked={locked}
        onClick={() => onSelect(type, trait)}
      >
        <StyledImage>{trait && <Image src={trait.image} width={34} height={34} />}</StyledImage>
      </StyledButton>
    )
  },
  (propsA, propsB) => propsA.trait?.id === propsB.trait?.id && propsA.locked === propsB.locked
)
