import styled from 'styled-components'
import { BlockContent } from '@sb/components/Block'
import { BREAKPOINTS, COLORS, BORDER_RADIUS, FONT_SIZES } from '@variables/variables'
import { InlineText, Text } from '@sb/components/Typography'
import { TokenIcon } from '@sb/components/TokenIcon'
import { Button } from '@sb/components/Button'
import { SvgIcon } from '@sb/components'
import { Row, StretchedBlock } from '@sb/components/Layout'

export const ModalBlock = styled(BlockContent)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  @media(min-width: ${BREAKPOINTS.md}) {
    padding-left: 48px;
    padding-right: 48px;
  }
`

export const TokenInfo = styled.div`
  background: ${COLORS.background};
  border-radius: ${BORDER_RADIUS.lg};
  margin: 0 0 0 24px;
  padding: 16px 12px;
  height: 70px;
  display: flex;
  flex-direction: row;
  align-items: center;
`

export const TokenGlobalInfo = styled(TokenInfo)`
  @media(min-width: ${BREAKPOINTS.lg}) {
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

  ${TokenIcon} {
    margin-right: 5px;
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
`

export const TokenPrice = styled(TokenInfoText)`
  color: ${COLORS.success};
  font-weight: 400;
`

export const TokenInfoName = styled(InlineText)`
  font-size: 13px;
  color: ${COLORS.textAlt};
  font-weight: 400;
`

export const SwapButton = styled(Button)`
  margin-right: 16px;
  padding-top: 5px;
  padding-bottom: 6px;
`

export const SwapButtonIcon = styled.span`
  margin-right: 1em;
  margin-top: 0.2em;
  position: relative;
  top: 4px;
`

export const TokenSymbols = styled.h2`
  font-weight: bold;
  font-size: ${FONT_SIZES.xl};
  line-height: 1.6;
  color: ${COLORS.white};
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
`

export const PoolInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 40px;
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
  margin-left: auto;
`

export const PoolStatsBlock = styled.div`
  margin-left: 36px;
`

export const PoolStatsTitle = styled.h4`
  font-size: 20px;
  font-weight: bold;
  line-height: 1.25;
  letter-spacing: -0.63px;
  margin: 20px 0;

  span {
    font-weight: normal;
  }
`

export const PoolStatsData = styled.div`
  height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const PoolStatsText = styled(InlineText)`
  font-size: 12px;
  line-height: 26px;
`

export const PoolStatsNumber = styled(PoolStatsText)`
  padding-left: 25px;
`

export const LiquidityWrap = styled.div`
  width: 100%;
  height: 160px;
`

export const LiquidityBlock = styled.div`
  position: relative;
  padding-left: 60px;
  height: 100%;
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;

  &:before {
    content: "Liquidity";
    font-weight: bold;
    font-size: 20px;
    color: ${COLORS.background};
    transform: rotate(-90deg);
    position: absolute;
    left: -60px;
    top: 57px;
    letter-spacing: 7px;
  }
`
export const FarmingBlock = styled(LiquidityBlock)`
  border-left: 1px solid ${COLORS.background};
  padding-left: 100px;
  margin-left: -30px;
  

  &:before {
    content: "Farming";
    letter-spacing: 8px;
    left: -20px;
  }
`

export const LiquidityTitle = styled(PoolStatsTitle)`
  margin: 5px 0;
`

export const LiquidityText = styled(PoolStatsText)`
  font-size: 13px;
`

export const LiquidityItem = styled.div`
  margin-right: 40px;
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
`

export const FarmingButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  
  ${FarmingButton}:first-child {
    margin-right: 10px;
  }
`
