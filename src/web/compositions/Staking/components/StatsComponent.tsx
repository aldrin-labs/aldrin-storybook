import { getRINCirculationSupply } from '@core/api'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getDexTokensPrices } from '@core/graphql/queries/pools/getDexTokensPrices'
import {
  stripByAmount,
  stripByAmountAndFormat,
} from '@core/utils/chartPageUtils'
import { formatNumberToUSFormat } from '@core/utils/PortfolioTableUtils'
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
import { DexTokensPrices } from '@sb/compositions/Pools/index.types'
import { getStakedTokensFromOpenFarmingTickets } from '@sb/dexUtils/common/getStakedTokensFromOpenFarmingTickets'
import { FarmingTicket } from '@sb/dexUtils/common/types'
import { STAKING_FARMING_TOKEN_DIVIDER } from '@sb/dexUtils/staking/config'
import { getCurrentFarmingStateFromAll } from '@sb/dexUtils/staking/getCurrentFarmingStateFromAll'
import { StakingPool } from '@sb/dexUtils/staking/types'
import { TokenInfo } from '@sb/dexUtils/types'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { compose } from 'recompose'
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
  const { getDexTokensPricesQuery, stakingPool, allStakingFarmingTickets } =
    props
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

  const tokenPrice =
    getDexTokensPricesQuery &&
    getDexTokensPricesQuery.getDexTokensPrices &&
    getDexTokensPricesQuery.getDexTokensPrices[0] &&
    getDexTokensPricesQuery.getDexTokensPrices[0].price

  const totalStakedUSD = tokenPrice * totalStaked
  const tokensTotal =
    currentFarmingState?.tokensTotal / STAKING_FARMING_TOKEN_DIVIDER
  const daysInMonth = dayjs().daysInMonth()
  const dailyRewards = tokensTotal / daysInMonth
  const apy = (tokensTotal / totalStaked) * 100 * 12

  useEffect(() => {
    document.title = `Aldrin | Stake RIN | ${stripByAmount(apy)}% APY`
    return () => {
      document.title = 'Aldrin'
    }
  }, [apy])

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
                  {formatNumberToUSFormat(stripByAmount(totalStaked, 0))}{' '}
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

export default compose<InnerProps, any>(
  queryRendererHoc({
    query: getDexTokensPrices,
    name: 'getDexTokensPricesQuery',
    fetchPolicy: 'cache-and-network',
    variables: { symbols: ['RIN'] },
    withoutLoading: true,
    pollInterval: 60000,
  })
)(StatsComponent)
