/* eslint-disable no-restricted-globals */
import { FONT_SIZES } from '@variables/variables'
import React, { useEffect, useState } from 'react'
import { compose } from 'recompose'

import { Block, GreenBlock, BlockContentStretched } from '@sb/components/Block'
import { Cell, Row, StretchedBlock } from '@sb/components/Layout'
import { ShareButton } from '@sb/components/ShareButton'
import { InlineText, Text } from '@sb/components/Typography'
import { MarketDataByTicker } from '@sb/compositions/Chart/components/MarketStats/MarketStats'
import { DexTokensPrices } from '@sb/compositions/Pools/index.types'
import { FarmingState } from '@sb/dexUtils/common/types'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import {
  DAYS_TO_CHECK_BUY_BACK,
  STAKING_FARMING_TOKEN_DIVIDER,
} from '@sb/dexUtils/staking/config'
import { TokenInfo } from '@sb/dexUtils/types'

import { getRINCirculationSupply } from '@core/api'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getDexTokensPrices } from '@core/graphql/queries/pools/getDexTokensPrices'
import { stripByAmount, stripToMillions } from '@core/utils/chartPageUtils'
import { dayDuration } from '@core/utils/dateUtils'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import { BigNumber } from '../styles'
import { getShareText } from '../utils'

export interface OuterProps {
  currentFarmingState: FarmingState
  buyBackAmount: number
  totalStaked: number
  tokenData: TokenInfo | undefined
}
export interface InnerProps {
  getDexTokensPricesQuery: { getDexTokensPrices: DexTokensPrices[] }
  marketDataByTickersQuery: { marketDataByTickers: MarketDataByTicker }
}

const StatsComponent: React.FC<InnerProps & OuterProps> = (props) => {
  const {
    getDexTokensPricesQuery,
    currentFarmingState,
    buyBackAmount,
    totalStaked,
    tokenData,
  } = props
  const [RINCirculatingSupply, setCirculatingSupply] = useState(0)

  useEffect(() => {
    const getRINSupply = async () => {
      const CCAICircSupplyValue = await getRINCirculationSupply()
      setCirculatingSupply(CCAICircSupplyValue)
    }
    getRINSupply()
  }, [])

  const dexTokensPricesMap =
    getDexTokensPricesQuery?.getDexTokensPrices?.reduce(
      (acc, tokenPrice) => acc.set(tokenPrice.symbol, tokenPrice),
      new Map()
    )

  const tokenPrice =
    dexTokensPricesMap?.get(
      getTokenNameByMintAddress(currentFarmingState.farmingTokenMint)
    )?.price || 0

  const totalStakedUSD = tokenPrice * totalStaked

  const buyBackAmountWithoutDecimals =
    buyBackAmount / STAKING_FARMING_TOKEN_DIVIDER

  const buyBackAPR =
    (buyBackAmountWithoutDecimals / DAYS_TO_CHECK_BUY_BACK / totalStaked) *
    365 *
    100

  const treasuryDailyRewards =
    (currentFarmingState.tokensPerPeriod / STAKING_FARMING_TOKEN_DIVIDER) *
    (dayDuration / currentFarmingState.periodLength)

  const buyBackDailyRewards =
    buyBackAmountWithoutDecimals / DAYS_TO_CHECK_BUY_BACK

  const dailyRewards = treasuryDailyRewards + buyBackDailyRewards

  const treasuryAPR = (treasuryDailyRewards / totalStaked) * 365 * 100

  const formattedBuyBackAPR = isFinite(buyBackAPR)
    ? stripByAmount(buyBackAPR, 2)
    : '--'

  const totalStakedPercentageToCircSupply =
    (totalStaked * 100) / RINCirculatingSupply

  const formattedTreasuryAPR = isFinite(treasuryAPR)
    ? stripByAmount(treasuryAPR, 2)
    : '--'

  const formattedAPR =
    isFinite(buyBackAPR) && isFinite(treasuryAPR)
      ? stripByAmount(buyBackAPR + treasuryAPR, 2)
      : '--'

  useEffect(() => {
    document.title = `Aldrin | Stake RIN | ${formattedAPR}% APR`
    return () => {
      document.title = 'Aldrin'
    }
  }, [formattedAPR])

  const shareText = getShareText(formattedAPR)

  return (
    <>
      <Row>
        <Cell colMd={6}>
          <GreenBlock margin="0 1rem">
            <BlockContentStretched>
              <InlineText color="lightGray" size="sm">
                Estimated Rewards
              </InlineText>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  flexWrap: 'nowrap',
                }}
              >
                <InlineText size="lg" weight={700} color="newGreen">
                  {formattedAPR}%{' '}
                  <InlineText
                    weight={400}
                    size="es"
                    style={{ color: 'rgba(38, 159, 19, 50%)' }}
                  >
                    APR
                  </InlineText>
                </InlineText>
              </div>

              <StretchedBlock>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <InlineText
                    size="sm"
                    color="lightGray"
                    style={{
                      lineHeight: 'normal',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {formattedTreasuryAPR}% + {formattedBuyBackAPR}%
                  </InlineText>
                  {/* <DarkTooltip
                    title={
                      <span>
                        <div style={{ marginBottom: '1rem' }}>
                          The first APR is calculated based on fixed “treasury”
                          rewards. These rewards estimation are updated hourly.
                        </div>
                        <div>
                          The second APR is calculated based on the current RIN
                          price and the average AMM fees for the past 7d. The
                          reward estimations are updated weekly.
                        </div>
                      </span>
                    }
                  >
                    <div style={{ display: 'flex' }}>
                      <SvgIcon src={Info} width="1.2em" height="auto" />
                    </div>
                  </DarkTooltip> */}
                </div>
                <div>
                  <ShareButton
                    iconFirst
                    text={shareText}
                    buttonStyle={{
                      minWidth: 'auto',
                      border: 'none',
                      fontSize: FONT_SIZES.sm,
                      padding: '0',
                    }}
                  />
                </div>
              </StretchedBlock>
            </BlockContentStretched>
          </GreenBlock>
        </Cell>
        <Cell colMd={6}>
          <Block margin="0 1rem">
            <BlockContentStretched>
              <InlineText color="lightGray" size="sm">
                Total staked{' '}
              </InlineText>{' '}
              <BigNumber>
                <InlineText>{stripToMillions(totalStaked)} </InlineText>{' '}
                <InlineText color="primaryGray">RIN</InlineText>
              </BigNumber>
              <StretchedBlock align="flex-end">
                <InlineText>${stripToMillions(totalStakedUSD)}</InlineText>{' '}
                <Text lineHeight="100%" margin="0" size="sm">
                  {stripDigitPlaces(totalStakedPercentageToCircSupply, 0)}% of
                  circulating supply
                </Text>
              </StretchedBlock>
            </BlockContentStretched>
          </Block>
        </Cell>
      </Row>
    </>
  )
}

export default compose<InnerProps, OuterProps>(
  queryRendererHoc({
    query: getDexTokensPrices,
    name: 'getDexTokensPricesQuery',
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
    pollInterval: 60000,
  })
)(StatsComponent)
