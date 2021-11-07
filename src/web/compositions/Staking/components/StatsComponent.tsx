import React, { useEffect, useState } from 'react'
import { compose } from 'recompose'
import dayjs from 'dayjs'

import { getRINCirculationSupply } from '@core/api'
import {
  queryRendererHoc,
  queryRendererHoc,
} from '@core/components/QueryRenderer'
import { getDexTokensPrices } from '@core/graphql/queries/pools/getDexTokensPrices'
import {
  stripByAmount,
  stripByAmountAndFormat,
} from '@core/utils/chartPageUtils'
import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'
import {
  Block,
  BlockContentStretched,
  BlockSubtitle,
  BlockTitle,
} from '@sb/components/Block'
import { Cell, Row, StretchedBlock } from '@sb/components/Layout'
import { ShareButton } from '@sb/components/ShareButton'
import { InlineText } from '@sb/components/Typography'
import { MarketDataByTicker } from '@sb/compositions/Chart/components/MarketStats/MarketStats'
import { DexTokensPrices, FeesEarned } from '@sb/compositions/Pools/index.types'
import { getStakedTokensFromOpenFarmingTickets } from '@sb/dexUtils/common/getStakedTokensFromOpenFarmingTickets'
import { FarmingTicket } from '@sb/dexUtils/common/types'
import {
  STAKING_FARMING_TOKEN_DIVIDER,
  STAKING_PART_OF_AMM_FEES,
} from '@sb/dexUtils/staking/config'
import { getCurrentFarmingStateFromAll } from '@sb/dexUtils/staking/getCurrentFarmingStateFromAll'
import { StakingPool } from '@sb/dexUtils/staking/types'
import { TokenInfo } from '@sb/dexUtils/types'
import { Text } from '@sb/components/Typography'

import {
  BigNumber,
  LastPrice,
  Number,
  StatsBlock,
  StatsBlockItem,
} from '../styles'
import { getShareText } from '../utils'
import locksIcon from './assets/lockIcon.svg'
import pinkBackground from './assets/pinkBackground.png'
import {
  dayDuration,
  daysInMonth,
  endOfHourTimestamp,
} from '@core/utils/dateUtils'
import { getRandomInt } from '@core/utils/helpers'
import { getFeesEarnedByPool } from '@core/graphql/queries/pools/getFeesEarnedByPool'
import { getTotalFeesFromPools } from '../utils/getTotalFeesFromPools'

interface InnerProps {
  tokenData: TokenInfo | null
}
interface StatsComponentProps extends InnerProps {
  getDexTokensPricesQuery: { getDexTokensPrices: DexTokensPrices[] }
  marketDataByTickersQuery: { marketDataByTickers: MarketDataByTicker }
  stakingPool: StakingPool
  allStakingFarmingTickets: FarmingTicket[]
  getFeesEarnedByPoolQuery: { getFeesEarnedByPool: FeesEarned[] }
}

const StatsComponent: React.FC<StatsComponentProps> = (
  props: StatsComponentProps
) => {
  const {
    getDexTokensPricesQuery,
    stakingPool,
    allStakingFarmingTickets,
    getFeesEarnedByPoolQuery,
  } = props
  const [RINCirculatingSupply, setCirculatingSupply] = useState(0)

  const allStakingFarmingStates = stakingPool?.farming || []

  const totalStaked = getStakedTokensFromOpenFarmingTickets(
    allStakingFarmingTickets
  )

  const currentFarmingState = getCurrentFarmingStateFromAll(
    allStakingFarmingStates
  )

  useEffect(() => {
    const getRINSupply = async () => {
      const CCAICircSupplyValue = await getRINCirculationSupply()
      setCirculatingSupply(CCAICircSupplyValue)
    }
    getRINSupply()
  }, [])

  const dexTokensPricesMap = getDexTokensPricesQuery.getDexTokensPrices.reduce(
    (acc, tokenPrice) => acc.set(tokenPrice.symbol, tokenPrice),
    new Map()
  )

  const totalFeesFromPools = getTotalFeesFromPools({
    poolsFeesData: getFeesEarnedByPoolQuery.getFeesEarnedByPool,
    dexTokensPricesMap,
  })

  const tokenPrice = dexTokensPricesMap.get('RIN').price || 0

  const totalStakedUSD = tokenPrice * totalStaked
  const tokensTotal =
    currentFarmingState?.tokensTotal / STAKING_FARMING_TOKEN_DIVIDER

  const poolsFees = (totalFeesFromPools * STAKING_PART_OF_AMM_FEES) / tokenPrice

  const dailyRewards = (tokensTotal + poolsFees) / daysInMonth
  const apy = (tokensTotal / totalStaked) * 100 * 12

  useEffect(() => {
    document.title = `Aldrin | Stake RIN | ${stripByAmount(apy)}% APY`
    return () => {
      document.title = 'Aldrin'
    }
  }, [apy])

  const shareText = getShareText(stripByAmount(apy))

  const totalStakedPercentageToCircSupply =
    (totalStaked * 100) / RINCirculatingSupply

  return (
    <>
      <Row>
        <Cell colMd={6}>
          <Block icon={locksIcon}>
            <BlockContentStretched>
              <BlockTitle>Total Staked</BlockTitle>
              <BigNumber>
                <InlineText color="success">
                  {formatNumberToUSFormat(stripByAmount(totalStaked, 0))}{' '}
                </InlineText>{' '}
                RIN
              </BigNumber>
              <StretchedBlock align={'flex-end'}>
                <Number lineHeight={'85%'} margin={'0'}>
                  ${stripByAmountAndFormat(totalStakedUSD)}
                </Number>{' '}
                <Text lineHeight={'100%'} margin={'0'} size="sm">
                  {stripDigitPlaces(totalStakedPercentageToCircSupply, 0)}% of
                  circulating supply
                </Text>
              </StretchedBlock>
            </BlockContentStretched>
          </Block>
        </Cell>
        <Cell colMd={6}>
          <Block backgroundImage={pinkBackground}>
            <BlockContentStretched>
              <BlockTitle>Estimated Rewards</BlockTitle>
              <BigNumber>{stripByAmount(apy, 2)}%</BigNumber>
              <StretchedBlock>
                <Number>APR</Number>
                <div>
                  <ShareButton text={shareText} />
                </div>
              </StretchedBlock>
            </BlockContentStretched>
          </Block>
        </Cell>
      </Row>
      <Row>
        <Cell>
          <Block>
            <BlockContentStretched>
              <BlockTitle>RIN Stats </BlockTitle>
              <StatsBlock>
                <StatsBlockItem>
                  <BlockSubtitle>Price</BlockSubtitle>
                  <LastPrice>
                    <Number>${stripByAmount(tokenPrice)}</Number>
                    {/* <InlineText
                      color={isPriceIncreasing ? 'success' : 'error'}
                      size="xs"
                    >
                      <SvgIcon
                        src={isPriceIncreasing ? GreenTriangle : RedTriangle}
                        width={'1rem'}
                        height={'1rem'}
                      />{' '}
                      {stripDigitPlaces(priceChangePercentage, 3)}%
                    </InlineText> */}
                  </LastPrice>
                </StatsBlockItem>
                <StatsBlockItem>
                  <BlockSubtitle>Circulating Supply</BlockSubtitle>
                  <Number>
                    {stripByAmountAndFormat(RINCirculatingSupply)} RIN
                  </Number>
                </StatsBlockItem>
                <StatsBlockItem>
                  <BlockSubtitle>Daily Rewards</BlockSubtitle>
                  <Number>{stripByAmountAndFormat(dailyRewards)} RIN</Number>
                </StatsBlockItem>
              </StatsBlock>
            </BlockContentStretched>
          </Block>
        </Cell>
      </Row>
    </>
  )
}

export default compose(
  queryRendererHoc({
    name: 'getFeesEarnedByPoolQuery',
    query: getFeesEarnedByPool,
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
    pollInterval: 60000 * getRandomInt(5, 10),
    variables: () => ({
      timestampFrom: endOfHourTimestamp() - dayDuration * daysInMonth,
      timestampTo: endOfHourTimestamp(),
    }),
  }),
  queryRendererHoc({
    query: getDexTokensPrices,
    name: 'getDexTokensPricesQuery',
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
    pollInterval: 60000,
  })
)(StatsComponent)
