import { getRINCirculationSupply } from '@core/api'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { marketDataByTickers } from '@core/graphql/queries/chart/marketDataByTickers'
import { getDexTokensPrices } from '@core/graphql/queries/pools/getDexTokensPrices'
import {
  stripByAmount,
  stripByAmountAndFormat,
} from '@core/utils/chartPageUtils'
import GreenTriangle from '@icons/greenTriangle.svg'
import RedTriangle from '@icons/redTriangle.svg'
import { SvgIcon } from '@sb/components'
import {
  Block,
  BlockContentStretched,
  BlockSubtitle,
  BlockTitle,
} from '@sb/components/Block'
import { Cell, Row, StretchedBlock } from '@sb/components/Layout'
import { ShareButton } from '@sb/components/ShareButton'
import { InlineText } from '@sb/components/Typography'
import {
  generateDatesForRequest,
  MarketDataByTicker,
} from '@sb/compositions/Chart/components/MarketStats/MarketStats'
import { DexTokensPrices } from '@sb/compositions/Pools/index.types'
import { getStakedTokensFromOpenFarmingTickets } from '@sb/dexUtils/common/getStakedTokensFromOpenFarmingTickets'
import { useConnection } from '@sb/dexUtils/connection'
import { useMarkPrice } from '@sb/dexUtils/markets'
import { getCurrentFarmingStateFromAll } from '@sb/dexUtils/staking/getCurrentFarmingStateFromAll'
import { useAllStakingTickets } from '@sb/dexUtils/staking/useAllStakingTickets'
import { useWallet } from '@sb/dexUtils/wallet'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { compose } from 'recompose'
import {
  BigNumber,
  LastPrice,
  Number,
  StatsBlock,
  StatsBlockItem,
} from '../Staking.styles'
import { getShareText } from '../Staking.utils.tsx/getShareText'
import locksIcon from './assets/lockIcon.svg'
import pinkBackground from './assets/pinkBackground.png'
import { TokenInfo } from '@sb/dexUtils/types'
import { StakingPool } from '@sb/dexUtils/staking/types'
import { STAKING_FARMING_TOKEN_DIVIDER } from '@sb/dexUtils/staking/config'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import { FarmingTicket } from '@sb/dexUtils/common/types'

interface InnerProps {
  tokenData: TokenInfo | null
}
interface StatsComponentProps extends InnerProps {
  getDexTokensPricesQuery: { getDexTokensPrices: DexTokensPrices[] }
  marketDataByTickersQuery: { marketDataByTickers: MarketDataByTicker }
  stakingPool: StakingPool
  allStakingFarmingTickets: FarmingTicket[]
}

const StatsComponent: React.FC<StatsComponentProps> = (
  props: StatsComponentProps
) => {
  const {
    getDexTokensPricesQuery,
    marketDataByTickersQuery,
    stakingPool,
    allStakingFarmingTickets,
  } = props
  const [RINCirculatingSupply, setCirculatingSupply] = useState(0)

  const allStakingFarmingStates = stakingPool?.farming || []

  const markPrice = useMarkPrice() || 0

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

  const tokenPrice =
    getDexTokensPricesQuery &&
    getDexTokensPricesQuery.getDexTokensPrices &&
    getDexTokensPricesQuery.getDexTokensPrices[0] &&
    getDexTokensPricesQuery.getDexTokensPrices[0].price

  const strippedLastPriceDiff = +stripByAmount(
    marketDataByTickersQuery?.marketDataByTickers?.lastPriceDiff
  )
  const strippedMarkPrice = +stripByAmount(markPrice)
  const prevClosePrice = strippedMarkPrice - strippedLastPriceDiff
  const priceChangePercentage = !prevClosePrice
    ? 0
    : (markPrice - prevClosePrice) / (prevClosePrice / 100)
  const isPriceIncreasing = priceChangePercentage > 0

  const totalStakedUSD = tokenPrice * totalStaked
  const tokensTotal =
    currentFarmingState?.tokensTotal / STAKING_FARMING_TOKEN_DIVIDER
  const daysInMonth = dayjs().daysInMonth()
  const dailyRewards = tokensTotal / daysInMonth
  const apy = (tokensTotal / totalStaked) * 100 * 12

  const shareText = getShareText(stripByAmount(apy))

  return (
    <>
      <Row>
        <Cell colMd={6}>
          <Block icon={locksIcon}>
            <BlockContentStretched>
              <BlockTitle>Total Staked</BlockTitle>
              <BigNumber>
                <InlineText color="success">
                  {stripByAmountAndFormat(totalStaked)}
                </InlineText>{' '}
                RIN
              </BigNumber>
              <Number>${stripByAmountAndFormat(totalStakedUSD)}</Number>
            </BlockContentStretched>
          </Block>
        </Cell>
        <Cell colMd={6}>
          <Block backgroundImage={pinkBackground}>
            <BlockContentStretched>
              <BlockTitle>Estimated Rewards</BlockTitle>
              <BigNumber>{stripByAmount(apy, 4)}%</BigNumber>
              <StretchedBlock>
                <Number>APY</Number>
                <div>
                  <ShareButton text={shareText}></ShareButton>
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
                    <InlineText
                      color={isPriceIncreasing ? 'success' : 'error'}
                      size="xs"
                    >
                      <SvgIcon
                        src={isPriceIncreasing ? GreenTriangle : RedTriangle}
                        width={'1rem'}
                        height={'1rem'}
                      />{' '}
                      {stripDigitPlaces(priceChangePercentage, 3)}%
                    </InlineText>
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

export default compose<InnerProps, any>(
  queryRendererHoc({
    query: getDexTokensPrices,
    name: 'getDexTokensPricesQuery',
    fetchPolicy: 'cache-only',
    variables: { symbols: ['RIN'] },
    withoutLoading: true,
    pollInterval: 60000,
  }),
  queryRendererHoc({
    query: marketDataByTickers,
    name: 'marketDataByTickersQuery',
    fetchPolicy: 'cache-only',
    variables: (props) => ({
      symbol: 'RIN_USDC',
      exchange: 'serum',
      marketType: 0,
      ...generateDatesForRequest(),
    }),
  })
)(StatsComponent)
