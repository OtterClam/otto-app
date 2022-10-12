import styled from 'styled-components/macro'
import { Display1 } from 'styles/typography'
import edgeImage from './edge.png'
import bgImage from './background.png'

const StyledContainer = styled.div`
  position: relative;
  width: ${bgImage.width / 2}px;
  height: ${bgImage.height / 2}px;
  background: center / cover url(${bgImage.src});
  text-align: center;

  &::before,
  &::after {
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
  z-index: 0;
  background: linear-gradient(180deg, #ffffff 0%, #f9cd4f 75%, #ffeaac 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
  text-fill-color: transparent;
  font-size: 24px;

  &::before,
  &::after {
    position: absolute;
    z-index: -1;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    content: attr(data-text);
    width: 100%;
    height: 100%;
    text-shadow: rgb(92, 51, 23) 2px 0px 0px, rgb(92, 51, 23) 1.75517px 0.958851px 0px,
      rgb(92, 51, 23) 1.0806px 1.68294px 0px, rgb(92, 51, 23) 0.141474px 1.99499px 0px,
      rgb(92, 51, 23) -0.832294px 1.81859px 0px, rgb(92, 51, 23) -1.60229px 1.19694px 0px,
      rgb(92, 51, 23) -1.97998px 0.28224px 0px, rgb(92, 51, 23) -1.87291px -0.701566px 0px,
      rgb(92, 51, 23) -1.30729px -1.5136px 0px, rgb(92, 51, 23) -0.421592px -1.95506px 0px,
      rgb(92, 51, 23) 0.567324px -1.91785px 0px, rgb(92, 51, 23) 1.41734px -1.41108px 0px,
      rgb(92, 51, 23) 1.92034px -0.558831px 0px;
    -webkit-background-clip: initial;
    -webkit-text-fill-color: initial;
    background-clip: initial;
    -webkit-background-clip: initial;
    text-fill-color: initial;
  }

  &::after {
    opacity: 0.5;
    z-index: -2;
    text-shadow: rgb(255, 255, 255) 4px 0px 0px, rgb(255, 255, 255) 3.87565px 0.989616px 0px,
      rgb(255, 255, 255) 3.51033px 1.9177px 0px, rgb(255, 255, 255) 2.92676px 2.72656px 0px,
      rgb(255, 255, 255) 2.16121px 3.36588px 0px, rgb(255, 255, 255) 1.26129px 3.79594px 0px,
      rgb(255, 255, 255) 0.282949px 3.98998px 0px, rgb(255, 255, 255) -0.712984px 3.93594px 0px,
      rgb(255, 255, 255) -1.66459px 3.63719px 0px, rgb(255, 255, 255) -2.51269px 3.11229px 0px,
      rgb(255, 255, 255) -3.20457px 2.39389px 0px, rgb(255, 255, 255) -3.69721px 1.52664px 0px,
      rgb(255, 255, 255) -3.95997px 0.56448px 0px, rgb(255, 255, 255) -3.97652px -0.432781px 0px,
      rgb(255, 255, 255) -3.74583px -1.40313px 0px, rgb(255, 255, 255) -3.28224px -2.28625px 0px,
      rgb(255, 255, 255) -2.61457px -3.02721px 0px, rgb(255, 255, 255) -1.78435px -3.57996px 0px,
      rgb(255, 255, 255) -0.843183px -3.91012px 0px, rgb(255, 255, 255) 0.150409px -3.99717px 0px,
      rgb(255, 255, 255) 1.13465px -3.8357px 0px, rgb(255, 255, 255) 2.04834px -3.43574px 0px,
      rgb(255, 255, 255) 2.83468px -2.82216px 0px, rgb(255, 255, 255) 3.44477px -2.03312px 0px,
      rgb(255, 255, 255) 3.84068px -1.11766px 0px, rgb(255, 255, 255) 3.9978px -0.132717px 0px;
  }
`

export interface RewardRibbonTextProps {
  text: string
  className?: string
}

export default function RewardRibbonText({ text, className }: RewardRibbonTextProps) {
  return (
    <StyledContainer className={className}>
      <StyledText data-text={text}>{text}</StyledText>
    </StyledContainer>
  )
}
