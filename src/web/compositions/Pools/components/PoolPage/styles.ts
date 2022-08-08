import {
  BORDER_RADIUS,
  BREAKPOINTS,
  COLORS,
  FONT_SIZES,
  LAYOUT_WIDTH,
} from '@variables/variables'
import styled from 'styled-components'

import { BlockContent } from '@sb/components/Block'
import { Button } from '@sb/components/Button'
import { Row, StretchedBlock } from '@sb/components/Layout'
import { InlineText, Text } from '@sb/components/Typography'

export const ModalBlock = styled(BlockContent)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  overflow: visible;

  @media (min-width: ${BREAKPOINTS.lg}) {
    flex-direction: row;
    padding-left: 30px;
    padding-right: 30px;
  }

  @media (min-width: ${BREAKPOINTS.xxl}) {
    width: ${LAYOUT_WIDTH}px;
  }
`

export const TokenInfo = styled.div`
  background: ${(props) => props.theme.colors.white4};
  border-radius: ${BORDER_RADIUS.lg};
  margin: 10px 0 10px 12px;
  padding: 16px 12px;
  height: 70px;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
`

export const TokenGlobalInfo = styled(TokenInfo)`
  @media (min-width: ${BREAKPOINTS.lg}) {
    width: 258px;
  }
`

export const TokenInfoRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-weight: bold;
  flex-wrap: nowrap;
  white-space: nowrap;
  flex: 1;

  ${InlineText} {
    margin: 0 3px;
  }
`

export const TokenInfos = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;

  @media (min-width: ${BREAKPOINTS.lg}) {
    flex-direction: row;
  }
`

export const TokenInfoTextWrap = styled.div`
  margin: 0 auto 0 10px;
`

export const TokenInfoText = styled(Text)`
  margin: 0;
  padding: 0;
  line-height: 110%;
  font-weight: 600;
  font-size: 14px;
  line-height: 1.5;
`

export const TokenPrice = styled(TokenInfoText)`
  color: ${(props) => props.theme.colors.green2};
  font-weight: 400;
`

export const TokenInfoName = styled(InlineText)`
  font-size: 13px;
  color: ${(props) => props.theme.colors.white1};
  font-weight: 400;
`

export const SwapButton = styled(Button)`
  margin-right: 16px;
  padding-top: 5px;
  padding-bottom: 6px;
  background-color: ${(props) => props.theme.colors.blue3};
  border-color: ${({ theme }) => theme.colors.blue3};
`

export const SwapButtonIcon = styled.span`
  margin-right: 1em;
  margin-top: 0.2em;
  position: relative;
  top: 4px;
`

export const TokenSymbols = styled.h2`
  font-weight: bold;
  font-size: ${FONT_SIZES.lg};
  line-height: 1.6;
  color: ${(props) => props.theme.colors.white1};
  margin: 0 0 0 20px;
`

export const TokenNames = styled.h3`
  font-weight: 400;
  font-size: ${FONT_SIZES.md};
  line-height: 1.6;
  color: ${COLORS.hint};
  margin: 0 0 0 20px;
`

export const PoolRow = styled(StretchedBlock)`
  flex: 1;
  flex-direction: column;

  @media (min-width: ${BREAKPOINTS.lg}) {
    flex-direction: row;
  }
`

export const PoolInfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 20px;
`

export const PoolName = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
`

export const TokenIcons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 20px;
`

export const ButtonsContainer = styled.div`
  margin: 20px 0 10px 0;
`

export const PoolStatsRow = styled(Row)`
  flex-direction: column;

  @media (min-width: ${BREAKPOINTS.lg}) {
    flex-direction: row;
    margin: auto 0 auto auto;
  }
`

export const PoolStatsWrap = styled.div`
  max-width: 170px;
  min-width: 75px;
  display: flex;
  flex-direction: column;
  margin: 10px 0 0;

  @media (min-width: ${BREAKPOINTS.lg}) {
    margin: 10px 0 10px 35px;
  }
`

export const PoolStatsTitle = styled.h4`
  font-size: 20px;
  font-weight: bold;
  line-height: 1.25;
  letter-spacing: -0.63px;
  margin: 7px 0 20px;
  color: ${(props) => props.theme.colors.white1};
  span {
    font-weight: normal;
  }
`

export const PoolStatsData = styled.div`
  margin: auto 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const FarmingData = styled.div`
  display: flex;
  flex-direction: row;
`

export const PoolStatsText = styled(InlineText)`
  font-size: 13px;
  line-height: 26px;
  font-weight: 600;
`

export const PoolStatsNumber = styled(PoolStatsText)`
  padding-left: 25px;
`

export const LiquidityWrap = styled.div`
  width: 100%;

  @media (min-width: ${BREAKPOINTS.lg}) {
    height: 160px;
  }
`

export const LiquidityBlock = styled.div`
  position: relative;
  padding-left: 50px;
  height: 100%;
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;

  &:before {
    content: 'Liquidity';
    font-weight: bold;
    font-size: 20px;
    color: ${(props) => props.theme.colors.white1};
    transform: rotate(-90deg);
    position: absolute;
    left: -70px;
    top: 57px;
    letter-spacing: 7px;
  }
`
export const FarmingBlock = styled(LiquidityBlock)`
  border-top: 1px solid ${COLORS.background};
  margin-top: 30px;
  padding-top: 20px;
  flex-direction: column;

  &:before {
    content: 'Farming';
    letter-spacing: 8px;
    left: -50px;
    top: 77px;
  }

  @media (min-width: ${BREAKPOINTS.lg}) {
    border-left: 1px solid ${(props) => props.theme.colors.white6};
    padding-left: 90px;
    margin-left: -30px;
    margin-top: 0;
    border-top: 0;
    padding-top: 0px;

    &:before {
      left: -30px;
      top: 57px;
    }
  }
`

export const FarmingBlockInner = styled.div`
  display: flex;
  flex-direction: row;
`

export const LiquidityTitle = styled(PoolStatsTitle)`
  margin: 5px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const LiquidityText = styled(PoolStatsText)`
  font-size: 13px;
`

export const LiquidityItem = styled.div`
  margin: 0 40px 20px 0;
  display: flex;
  flex-direction: column;

  @media (min-width: ${BREAKPOINTS.lg}) {
    margin: 0 40px 0 0;
    overflow: hidden;
  }
`

export const LiquidityButton = styled(Button)`
  width: 160px;
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  letter-spacing: -0.45px;
  border-radius: 12px;
  padding: 10px 0;
  margin-top: 20px;
`

export const FarmingButton = styled(LiquidityButton)`
  width: 110px;
  margin-top: 0;
`

export const FarmingButtonWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`

export const ExtendFarmingButton = styled(FarmingButton)`
  width: auto;
  max-width: 380px;
  flex: 1;
  margin-right: 20px;
  padding-left: 10px;
  padding-right: 10px;
`

export const FarmingButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;

  ${FarmingButton} {
    margin-top: 20px;
  }

  ${FarmingButton}:first-child {
    margin-right: 10px;
  }
`

export const NoFarmingBlock = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
`

export const TooltipText = styled(Text)`
  margin: 5px 0;
`

export const Link = styled.a`
  color: ${(props) => props.theme.colors.blue3};
`
