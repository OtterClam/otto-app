import styled from 'styled-components/macro'
import boostImage from 'assets/boost.png'

const StyledIcon = styled.span`
  width: 20px;
  height: 20px;
  background: center / cover url(${boostImage.src});
`

export default function BoostIcon({ className }: { className?: string }) {
  return <StyledIcon className={className} />
}
