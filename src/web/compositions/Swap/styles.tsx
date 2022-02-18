import {
  BREAKPOINTS,
  COLORS,
  FONT_SIZES,
  MAIN_FONT,
} from '@variables/variables'
import React from 'react'
import styled from 'styled-components'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { Page } from '@sb/components/Layout'

import { Row, RowContainer } from '../AnalyticsRoute/index.styles'
import { BlockTemplate } from '../Pools/index.styles'

export const SwapPageContainer = styled(RowContainer)`
  background: ${COLORS.mainBlack};
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
  background-color: #2b2d32;
  margin-left: 0.5rem;
  font-size: ${(props) => FONT_SIZES[props.$fontSize || 'sm']};
  line-height: 2em;
  border: 0.1rem solid #3a475c;
  border-radius: 0.8rem;
`

export const ValueInput = styled.input`
  width: 5em;
  height: 2em;
  padding: 0.5em 0.8em;
  font-family: Avenir Next Medium;
  color: #fbf2f2;
  background-color: transparent;
  font-size: ${FONT_SIZES.sm};
  border: 0.1rem solid #3a475c;
  border-radius: 0.8rem;
  outline: none;
`

export const BlackRow = styled((props) => (
  <Row justify="space-between" {...props} />
))`
  background: ${COLORS.cardsBack};
  border-radius: 1.2rem;
  height: 3em;
  padding: 1em 0.8em;
  margin-top: 0.8rem;
`

export const RowTitle = styled.span`
  font-family: ${MAIN_FONT};
  font-size: ${FONT_SIZES.xsm};
  color: #c9c8cd;
`

export const RowValue = styled(RowTitle)`
  font-weight: 500;
  color: #fff;
`

export const RowAmountValue = styled(RowValue)`
  margin-right: 0.4rem;
  color: #91e073;
`

export const SwapButton = styled((props) => (
  <BtnCustom
    btnWidth="100%"
    height="4em"
    fontSize="initial"
    padding="0.7em 1.2em"
    borderRadius=".8rem"
    borderColor="none"
    btnColor={COLORS.primaryWhite}
    backgroundColor={
      props.disabled
        ? '#3A475C'
        : 'linear-gradient(91.8deg, #651CE4 15.31%, #D44C32 89.64%)'
    }
    textTransform="none"
    transition="all .4s ease-out"
    {...props}
  />
))`
  &:disabled {
    color: ${COLORS.primaryWhite};
  }
`

export const CircleIconContainer = styled(Row)`
  width: ${(props) => props.size || '1.6em'};
  height: ${(props) => props.size || '1.6em'};
  background: #2b2d36;
  border-radius: 50%;
  font-family: Avenir Next Bold;
  color: #a7a7ae;
  line-height: ${(props) => props.size || '1.6em'};
`

export const ReverseTokensContainer = styled(CircleIconContainer)`
  box-shadow: 0px 0px 0.8rem rgba(0, 0, 0, 0.45);
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  z-index: 2;
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
  width: 90%;

  @media (min-width: ${BREAKPOINTS.sm}) {
    width: 30em;
  }

  @media (min-width: 1920px) {
    width: 40em;
  }
`

export const SwapBlockTemplate = styled(BlockTemplate)`
  padding: 2.4rem 1.6rem;
  z-index: 10;

  @media (min-width: 1920px) {
    font-size: 20px;
  }
`
