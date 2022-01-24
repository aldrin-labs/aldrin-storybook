import { COLORS } from '@variables/variables'
import styled from 'styled-components'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'

import { Row, RowContainer } from '../AnalyticsRoute/index.styles'
import { BlockTemplate } from '../Pools/index.styles'

export const SwapPageContainer = styled(RowContainer)`
  background: ${COLORS.bodyBackground};
  overflow-y: auto;
  @media (max-height: 800px) {
    justify-content: flex-start;
  }
`

export const Card = styled(BlockTemplate)`
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border: 1px solid #383b45;
  border-top: none;
  box-shadow: none;
`
export const TokenLabel = styled.div`
  width: auto;
  padding: 0.5rem 1rem;
  font-family: Avenir Next Medium;
  color: #f8faff;
  border-radius: 1.3rem;
  background: #f69894;
  font-size: 1.4rem;
  margin-left: 1rem;
`

type BoxProps = {
  image?: string
}

export const InfoBox = styled(Row)`
  width: 32%;
  height: 15rem;
  background-image: ${(props: BoxProps) => `url(${props.image})`};
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 2rem;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 2rem;
`

type DotFlashingProps = {
  size: number
  emptyColor: string
  filledColor: string
}

export const DotsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 2rem 0;
  margin: 0 -5%;
  overflow: hidden;
  width: 10rem;
`

export const DotPulse = styled.div`
  @keyframes dotFlashing {
    0% {
      background-color: ${(props: DotFlashingProps) => props.emptyColor};
    }
    50%,
    100% {
      background-color: ${(props: DotFlashingProps) => props.filledColor};
    }
  }

  position: relative;
  width: ${(props: DotFlashingProps) => props.size}px;
  height: ${(props: DotFlashingProps) => props.size}px;
  border-radius: ${(props: DotFlashingProps) => props.size / 2}px;
  background-color: ${(props: DotFlashingProps) => props.emptyColor};
  color: ${(props: DotFlashingProps) => props.emptyColor};
  animation: dotFlashing 1s infinite linear alternate;
  animation-delay: 0.5s;

  &::before,
  &::after {
    content: '';
    display: inline-block;
    position: absolute;
    top: 0;
  }

  &::before {
    left: -${(props: DotFlashingProps) => props.size * 1.5}px;
    width: ${(props: DotFlashingProps) => props.size}px;
    height: ${(props: DotFlashingProps) => props.size}px;
    border-radius: ${(props: DotFlashingProps) => props.size / 2}px;
    background-color: ${(props: DotFlashingProps) => props.emptyColor};
    color: ${(props: DotFlashingProps) => props.emptyColor};
    animation: dotFlashing 1s infinite alternate;
    animation-delay: 0s;
  }

  &::after {
    left: ${(props: DotFlashingProps) => props.size * 1.5}px;
    width: ${(props: DotFlashingProps) => props.size}px;
    height: ${(props: DotFlashingProps) => props.size}px;
    border-radius: ${(props: DotFlashingProps) => props.size / 2}px;
    background-color: ${(props: DotFlashingProps) => props.emptyColor};
    color: ${(props: DotFlashingProps) => props.emptyColor};
    animation: dotFlashing 1s infinite alternate;
    animation-delay: 1s;
  }
`

export const SwapButton = styled(BtnCustom)`
  &::after {
    overflow: hidden;
    display: inline-block;
    vertical-align: bottom;
    -webkit-animation: ellipsis steps(4, end) 900ms infinite;
    animation: ellipsis steps(4, end) 900ms infinite;
    content: '\2026'; /* ascii code for the ellipsis character */
    width: 0px;
  }

  @keyframes ellipsis {
    to {
      width: 1.25em;
    }
  }
`
