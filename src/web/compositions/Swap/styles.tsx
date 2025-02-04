import {
  BREAKPOINTS,
  FONTS,
  FONT_SIZES,
  MAIN_FONT,
  TRANSITION,
} from '@variables/variables'
import { rgba, em } from 'polished'
import React from 'react'
import styled, { DefaultTheme } from 'styled-components'

import { Button } from '@sb/components/Button'
import { Page } from '@sb/components/Layout'

import { Row, RowContainer } from '../AnalyticsRoute/index.styles'
import { BlockTemplate } from '../Pools/index.styles'

type BoxProps = {
  image?: string
}

type TextButtonProps = {
  color?: string
  weight?: number
  padding?: string
}

type DropdownIconContainerProps = {
  isDetailsOpen?: boolean
}

export const LeftColumn = styled(Row)`
  justify-content: flex-end;
  order: 1;
  height: 20em;
  margin-right: 1em;

  @media (max-width: ${BREAKPOINTS.xs}) {
    order: 2;
    justify-content: center;
    margin-right: 0;
  }
`

export const RightColumn = styled(Row)`
  justify-content: flex-start;
  order: 2;

  @media (max-width: ${BREAKPOINTS.xs}) {
    order: 1;
    justify-content: center;
  }
`

export const ChartContainer = styled(Row)`
  width: 33em;
  height: 100%;

  @media (max-width: ${BREAKPOINTS.xs}) {
    width: 100%;
    margin: ${em('24px', '14px')};
  }
`

export const SwapPageContainer = styled(RowContainer)`
  background: ${(props) => props.theme.colors.background1};
  //margin: 80px 0;

  @media (max-width: ${BREAKPOINTS.xs}) {
    flex-direction: column;
    height: 100%;
    //margin: 0;
    justify-content: flex-start;
  }

  ${LeftColumn} + ${RightColumn} {
    margin-left: 0.6em;

    @media (max-width: ${BREAKPOINTS.xs}) {
      margin-left: 0;
    }
  }
`

export const Card = styled(BlockTemplate)`
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border: 1px solid #383b45;
  border-top: none;
  box-shadow: none;
`

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

  height: 32px;
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

type InfoIconContainerProps = {
  isHighPriceDiff: boolean
}

export const InfoIconContainer = styled.span<InfoIconContainerProps>`
  color: ${(props) =>
    props.isHighPriceDiff
      ? props.theme.colors.red1
      : props.theme.colors.green3};
`

export const BlackRow = styled((props) => (
  <Row justify="space-between" {...props} />
))`
  flex-direction: column;
  justify-content: center;
  border-radius: 1.2rem;
  height: ${(props) => (props.isDetailsOpen ? 'auto' : '1.7em')};
  padding: 0 0.6em;
  margin-top: 0.8rem;
  border: 1px solid ${(props) => props.theme.colors.white4};
  transition: height 2s;
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
  border-right: 1px solid ${(props) => props.theme.colors.white4};
  padding-right: 1.5em;
  margin-right: 1.5em;
  white-space: nowrap;
`

export const SwapButton = styled(Button)`
  height: 4em;

  color: ${(props: { isHighPriceDiff: boolean }) =>
    props.isHighPriceDiff
      ? props.theme.colors.red1
      : props.theme.colors.green3};

  background: ${(props: { isHighPriceDiff: boolean }) =>
    props.isHighPriceDiff
      ? rgba(props.theme.colors.red0, 0.15)
      : rgba(props.theme.colors.green2, 0.15)};

  border: none;

  transition: all 0.4s ease-out;

  span {
    font-size: ${FONT_SIZES.esm};
    font-weight: 600;
  }

  &:disabled {
    color: ${(props) => props.theme.colors.white3};
    background: ${(props) => rgba(props.theme.colors.white3, 0.15)};
  }

  &:hover {
    background: ${(props: { isHighPriceDiff: boolean }) =>
      props.isHighPriceDiff
        ? rgba(props.theme.colors.red0, 0.2)
        : rgba(props.theme.colors.green2, 0.2)};
  }

  &:active {
    background: ${(props: { isHighPriceDiff: boolean }) =>
      props.isHighPriceDiff
        ? rgba(props.theme.colors.red0, 0.25)
        : rgba(props.theme.colors.green2, 0.25)};
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

type ReverseTokensContainerProps = {
  $isReversed: boolean
}

export const ReverseTokensContainer = styled(
  CircleIconContainer
)<ReverseTokensContainerProps>`
  position: absolute;
  left: 50%;
  top: 50%;
  border: 1px solid ${(props) => props.theme.colors.white4};
  transform: translate(-50%, -50%)
    rotate(${(props) => (props.$isReversed ? 180 : 0)}deg);
  cursor: pointer;
  z-index: 2;
  transition: all 0.3s ease-out;

  &:hover {
    transform: translate(-50%, -50%)
      rotate(${(props) => (props.$isReversed ? 180 : 0)}deg) scale(1.2);
  }

  svg {
    width: 0.8em;
    height: auto;
    path {
      fill: ${(props) => props.theme.colors.white1};
    }
  }
`

export const SwapPageLayout = styled(Page)`
  font-size: 13px;
  justify-content: center;

  @media (min-width: ${BREAKPOINTS.xs}) {
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
  padding: 30px 0px;
  width: 24em;
  height: 100%;

  @media (max-width: ${BREAKPOINTS.xs}) {
    width: 100%;
  }

  @media (min-width: ${BREAKPOINTS.xxl}) {
    width: 27em;
  }

  @media (min-width: ${BREAKPOINTS.xxxl}) {
    padding: 90px 0;
  }
`

export const SwapBlockTemplate = styled(BlockTemplate)`
  background: ${({ theme }) => theme.colors.white6};
  padding: 1em 1em;
  z-index: 10;
  flex-direction: column;
  justify-content: space-between;
  min-height: 25em;

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

  @media (min-width: ${BREAKPOINTS.xxl}) {
    font-size: 20px;
  }
`
export const TextButton = styled(Button)<TextButtonProps>`
  background: none;
  color: ${(props) => props.theme.colors[props.color || 'green3']};
  border: 0;
  padding: ${(props) => props.padding || 0};
  font-weight: ${(props) => props.weight || 600};
  width: auto;
  min-width: 0;
`

export const FailedButtonsRow = styled(Row)`
  ${TextButton} + ${TextButton} {
    margin-left: 1.2em;
  }
`

export const DropdownIconContainer = styled.div<DropdownIconContainerProps>`
  transform: ${(props) => (props.isDetailsOpen ? 'rotate(180deg)' : '')};
  width: 0.5em;
  height: 0.9em;
  cursor: pointer;
  transition: transform 0.5s;
`
