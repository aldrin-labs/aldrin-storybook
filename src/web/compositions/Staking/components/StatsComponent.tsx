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
import { getParsedStakingSnapshots } from '@sb/dexUtils/staking/getParsedStakingSnapshots'
import { useAllFarmingStates } from '@sb/dexUtils/staking/useAllFarmingStates'
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

interface StatsComponentProps {
  getDexTokensPricesQuery: { getDexTokensPrices: DexTokensPrices[] }
  marketDataByTickersQuery: { marketDataByTickers: MarketDataByTicker }
  tokenData: TokenInfo | null
}

const StatsComponent: React.FC<StatsComponentProps> = (
  props: StatsComponentProps
) => {
  const { getDexTokensPricesQuery, marketDataByTickersQuery, tokenData } = props
  const [RINCirculatingSupply, setCirculatingSupply] = useState(0)
  const connection = useConnection()
  const { wallet } = useWallet()
  const [
    allStakingFarmingStates,
    refreshAllStakingFarmingStates,
  ] = useAllFarmingStates({
    connection,
    wallet,
  })
  const markPrice = useMarkPrice() || 0
  const [allStakingFarmingTickets, refreshTotalStaked] = useAllStakingTickets({
    wallet,
    connection,
  })

  const decDelimiter = Math.pow(10, tokenData?.decimals || 0)

  const totalStaked = getStakedTokensFromOpenFarmingTickets(
    allStakingFarmingTickets
  ) / decDelimiter
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
  const tokensTotal = currentFarmingState?.tokensTotal / decDelimiter
  const daysInMonth = dayjs().daysInMonth()
  const dailyRewards = tokensTotal / daysInMonth
  const apy = (tokensTotal / totalStaked) * 100 * 12

  const SHARE_TEXT = getShareText(apy)

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
              <BigNumber>{apy}%</BigNumber>
              <StretchedBlock>
                <Number>APY</Number>
                <div>
                  <ShareButton text={SHARE_TEXT}></ShareButton>
                  {/* <BorderButton
                    target="_blank"
                    href={
                      'https://twitter.com/intent/tweet?text=I+stake+my+%24RIN+on+%40Aldrin_Exchange+with+192%25+APY%21%0D%0A%0D%0ADon%27t+miss+your+chance%21'
                    }
                    borderColor={'#fbf2f2'}
                    borderRadius="3rem"
                  >
                    Share
                    <SvgIcon src={lightBird} style={{ marginLeft: '1rem' }} />
                  </BorderButton> */}
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
                      {stripByAmount(priceChangePercentage)}%
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

export default compose(
  queryRendererHoc({
    query: getDexTokensPrices,
    name: 'getDexTokensPricesQuery',
    fetchPolicy: 'cache-and-network',
    variables: { symbols: ['RIN'] },
    withoutLoading: true,
    pollInterval: 60000,
  }),
  queryRendererHoc({
    query: marketDataByTickers,
    name: 'marketDataByTickersQuery',
    variables: (props) => ({
      symbol: 'RIN_USDC',
      exchange: 'serum',
      marketType: 0,
      ...generateDatesForRequest(),
    }),
  })
)(StatsComponent)
