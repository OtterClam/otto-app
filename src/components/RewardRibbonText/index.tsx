import edgeImage from './edge.png'
import bgImage from './background.png'
import styled from 'styled-components/macro'
import { Display1 } from 'styles/typography'

const StyledContainer = styled.div`
  position: relative;
  width: ${bgImage.width / 2}px;
  height: ${bgImage.height / 2}px;
  background: center / cover url(${bgImage.src});
  text-align: center;
  
  &::before, &::after {
    position: absolute;
    top: -6px;
    content: '';
    display: block;
    width: ${edgeImage.width / 2}px;
    height: ${edgeImage.height / 2}px;
    background: center / cover url(${edgeImage.src});
  }
  
  &::before {
    left: -${edgeImage.width / 4}px;
  }

  &::after {
    right: -${edgeImage.width / 4}px;
    transform: rotateY(180deg);
  }
`

const StyledText = styled(Display1)`
  position: relative;
  background: linear-gradient(180deg, #FFFFFF 0%, #F9CD4F 75%, #FFEAAC 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
  text-fill-color: transparent;
  font-size: 24px;
  
  &::before {
    position: absolute;
    display: block;
    content: attr(data-text);
    transform: scale(1.1);
    width: 100%;
    height: 100%;
  }
`

export interface RewardRibbonTextProps {
  text: string
}

export default function RewardRibbonText({ text }: RewardRibbonTextProps) {
  return (
    <StyledContainer>
      <StyledText data-text={text}>
        {text}
      </StyledText>
    </StyledContainer>
  )
}
