import {
  BORDER_RADIUS,
  BREAKPOINTS,
  FONTS,
  FONT_SIZES,
  MAIN_FONT,
  TRANSITION,
} from '@variables/variables'
import { rgba } from 'polished'
import React from 'react'
import styled, { DefaultTheme } from 'styled-components'

import { Button, PADDINGS } from '@sb/components/Button'
import { Page } from '@sb/components/Layout'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'

import { Row, RowContainer } from '../AnalyticsRoute/index.styles'
import { BlockTemplate } from '../Pools/index.styles'

export const SwapPageContainer = styled(RowContainer)`
  background: ${(props) => props.theme.colors.background1};
  overflow-y: auto;
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

export const SlippageButton = styled.button`
  display: flex;
  align-items: center;

  height: 2em;
  cursor: pointer;

  padding: 0 0.6em;

  font-family: ${FONTS.main};
  font-size: 1em;
  font-weight: 600;

  color: ${(props) => props.theme.colors.white2};
  background-color: ${(props) => props.theme.colors.white5};

  border: none;
  border-radius: 2em;
  transition: all 0.3s ease-out;

  &:hover {
    background: ${(props) => props.theme.colors.white4};
    transition: all 0.3s ease-out;
  }
`

export const InfoIconContainer = styled.span`
  color: ${({ isHighPriceDiff, theme }) =>
    isHighPriceDiff ? theme.colors.red1 : theme.colors.green3};

  svg {
    width: 100%;
    height: 100%;
  }
`

export const ValueInput = styled.input`
  width: 5em;
  height: 2em;
  padding: 0.5em 0.8em;
  font-family: Avenir Next Medium;
  color: ${(props) => props.theme.colors.white1};
  background-color: ${(props) => props.theme.colors.white4};
  border: none;
  font-size: ${FONT_SIZES.sm};
  border-radius: 0.8rem;
  outline: none;
`

export const BlackRow = styled((props) => (
  <Row justify="space-between" {...props} />
))`
  background: ${(props) => props.theme.colors.white5};
  border-radius: 1.2rem;
  height: 2em;
  padding: 0 0.6em;
  margin-top: 0.8rem;
`

export const RowTitle = styled.span`
  font-family: ${MAIN_FONT};
  font-size: ${FONT_SIZES.esm};
  line-height: ${FONT_SIZES.md};
  color: ${(props) => props.$color || props.theme.colors.white2};
`

export const RowValue = styled(RowTitle)`
  font-weight: 500;
  color: ${(props) => props.theme.colors.white1};
`

export const RowImpactTitle = styled(RowTitle)`
  font-weight: 600;
  color: ${({
    isHighPriceDiff,
    theme,
  }: {
    isHighPriceDiff: boolean
    theme: DefaultTheme
  }) => (isHighPriceDiff ? theme.colors.red1 : theme.colors.green3)};
`

export const RowAmountValue = styled(RowValue)`
  margin-right: 0.4rem;
  color: ${(props) => props.theme.colors.green3};
`

export const SwapButton = styled(Button)`
  height: 4em;

  color: ${({
    isHighPriceDiff,
    theme,
  }: {
    isHighPriceDiff: boolean
    theme: DefaultTheme
  }) => (isHighPriceDiff ? theme.colors.red1 : theme.colors.green2)};

  background: ${({ isHighPriceDiff, theme }: { isHighPriceDiff: boolean }) =>
    isHighPriceDiff
      ? rgba(theme.colors.red0, 0.15)
      : rgba(theme.colors.green0, 0.15)};

  border: none;

  transition: all 0.4s ease-out;

  span {
    font-size: ${FONT_SIZES.esm};
    font-weight: 600;
  }

  &:disabled {
    color: ${(props) => props.theme.colors.white3};
    background: ${rgba('#5B5A72', 0.15)}; // too rare to add to theme
  }
`

export const CircleIconContainer = styled(Row)`
  width: ${(props) => props.size || '2em'};
  height: ${(props) => props.size || '2em'};
  background: ${(props) => props.theme.colors.white6};
  border-radius: 50%;
  font-family: Avenir Next Bold;
  color: ${(props) => props.theme.colors.white1};
  line-height: ${(props) => props.size || '2em'};
`

export const ReverseTokensContainer = styled(CircleIconContainer)`
  position: absolute;
  left: 50%;
  top: 50%;
  border: 1px solid ${(props) => props.theme.colors.white4};
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 2;

  svg {
    width: 1.2em;
    height: auto;
    path {
      fill: ${(props) => props.theme.colors.white1};
    }
  }
`

export const SwapPageLayout = styled(Page)`
  font-size: 12px;

  @media (min-width: 380px) {
    font-size: 13px;
  }

  @media (min-width: 480px) {
    font-size: 14px;
  }

  @media (min-width: ${BREAKPOINTS.lg}) {
    font-size: 15px;
  }

  @media (min-width: ${BREAKPOINTS.xxl}) {
    font-size: 16px;
  }
`

export const SwapContentContainer = styled(Row)`
  margin: 10px 0;
  width: 90%;
  margin-right: 0.6em;

  @media (min-width: ${BREAKPOINTS.sm}) {
    width: 24em;
  }

  @media (min-width: 1920px) {
    width: 30em;
  }
`

export const SwapBlockTemplate = styled(BlockTemplate)`
  box-shadow: 0px 0px 48px rgba(0, 0, 0, 0);
  background: ${({ theme }) => theme.colors.white6};
  padding: 1.5em 1em;
  z-index: 10;

  .timer {
    &:hover {
      background-color: ${(props) => props.theme.colors.white4};
      border: 0.1rem solid ${(props) => props.theme.colors.white4};
    }
    &:active {
      background-color: ${(props) => props.theme.colors.white4};
      border: 0.1rem solid ${(props) => props.theme.colors.white4};
    }
  }

  .btn {
    transition: ${TRANSITION};

    &:hover {
      background: ${(props) => props.theme.colors.blue2};
      border: 1px solid transparent;
    }

    &:active {
      background: ${(props) => props.theme.colors.blue3};
      border: 1px solid transparent;
    }
  }

  @media (min-width: 1920px) {
    font-size: 20px;
  }
`

export const SetAmountButton = styled(Button)`
  min-width: 0;
  font-size: ${FONT_SIZES.xs};
  font-family: ${FONTS.demi};
  border-radius: ${BORDER_RADIUS.xxl};
  color: ${(props) => props.theme.colors.white1};
  background-color: ${(props) => props.theme.colors.white3};
  border: none;
  padding: ${PADDINGS.xs};

  &:hover {
    background-color: ${(props) => props.theme.colors.white3};
  }
  &:active {
    background-color: ${(props) => props.theme.colors.white4};
  }

  @media (min-width: ${BREAKPOINTS.sm}) {
    padding: ${PADDINGS.sm};
  }
`

export const SwapTooltip = styled(DarkTooltip)`
  && .tooltip {
    color: auto;
  }
`
