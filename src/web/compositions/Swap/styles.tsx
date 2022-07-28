import {
  BORDER_RADIUS,
  BREAKPOINTS,
  FONTS,
  FONT_SIZES,
  MAIN_FONT,
  TRANSITION,
} from '@variables/variables'
import React from 'react'
import styled from 'styled-components'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { Button, PADDINGS } from '@sb/components/Button'
import { Page } from '@sb/components/Layout'

import { Row, RowContainer } from '../AnalyticsRoute/index.styles'
import { BlockTemplate } from '../Pools/index.styles'

export const SwapPageContainer = styled(RowContainer)`
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

export const ValueButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 2em;
  height: 2em;
  cursor: pointer;
  padding: 0.5em 0.8em;
  font-family: Avenir Next Bold;
  color: #a7a7ae;
  background-color: ${(props) => props.theme.colors.white4};
  margin-left: 0.5rem;
  font-size: ${(props) => FONT_SIZES[props.$fontSize || 'sm']};
  line-height: 2em;
  border: 0.1rem solid ${(props) => props.theme.colors.white4};
  border-radius: 0.8rem;

  &:hover {
    background-color: ${(props) => props.theme.colors.white5};
    border: 0.1rem solid ${(props) => props.theme.colors.white5};
  }

  &:active {
    background-color: ${(props) => props.theme.colors.white6};
    border: 0.1rem solid ${(props) => props.theme.colors.white6};
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
  background: ${(props) => props.theme.colors.white4};
  border-radius: 1.2rem;
  height: 3em;
  padding: 1em 0.8em;
  margin-top: 0.8rem;
`

export const RowTitle = styled.span`
  font-family: ${MAIN_FONT};
  font-size: ${FONT_SIZES.xsm};
  color: ${(props) => props.theme.colors.white1};
`

export const RowValue = styled(RowTitle)`
  font-weight: 500;
  color: ${(props) => props.theme.colors.white1};
`

export const RowAmountValue = styled(RowValue)`
  margin-right: 0.4rem;
  color: ${(props) => props.theme.colors.green3};
`

export const SwapButton = styled((props) => (
  <BtnCustom
    btnWidth="100%"
    height="4em"
    fontSize="initial"
    padding="0.7em 1.2em"
    borderRadius=".8rem"
    borderColor="none"
    btnColor="#fff"
    backgroundColor={
      props.disabled ? props.theme.colors.disabled : props.theme.colors.blue3
    }
    textTransform="none"
    transition="all .4s ease-out"
    {...props}
  />
))`
  &:disabled {
    color: #fff;
  }
`

export const CircleIconContainer = styled(Row)`
  width: ${(props) => props.size || '1.6em'};
  height: ${(props) => props.size || '1.6em'};
  background: ${(props) => props.theme.colors.white6};
  border-radius: 50%;
  font-family: Avenir Next Bold;
  color: ${(props) => props.theme.colors.white1};
  line-height: ${(props) => props.size || '1.6em'};
`

export const ReverseTokensContainer = styled(CircleIconContainer)`
  position: absolute;
  right: 1rem;
  top: 50%;
  box-shadow: ${(props) => props.theme.colors.shadow};
  transform: translateY(-50%);
  cursor: pointer;
  z-index: 2;
  svg {
    width: 10px;
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

  @media (min-width: ${BREAKPOINTS.sm}) {
    width: 30em;
  }

  @media (min-width: 1920px) {
    width: 40em;
  }
`

export const SwapBlockTemplate = styled(BlockTemplate)`
  box-shadow: 0px 0px 48px rgba(0, 0, 0, 0);
  background: ${({ theme }) => theme.colors.white5};
  padding: 2.4rem 1.6rem;
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
