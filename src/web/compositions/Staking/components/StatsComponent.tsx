import { getRINCirculationSupply } from '@core/api'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getDexTokensPrices } from '@core/graphql/queries/pools/getDexTokensPrices'
import {
  stripByAmount,
  stripByAmountAndFormat
} from '@core/utils/chartPageUtils'
import {
  formatNumberToUSFormat,
  stripDigitPlaces
} from '@core/utils/PortfolioTableUtils'
import {
  Block,
  BlockContentStretched,
  BlockSubtitle,
  BlockTitle
} from '@sb/components/Block'
import { Cell, Row, StretchedBlock } from '@sb/components/Layout'
import { ShareButton } from '@sb/components/ShareButton'
import { InlineText, Text } from '@sb/components/Typography'
import { MarketDataByTicker } from '@sb/compositions/Chart/components/MarketStats/MarketStats'
import { DexTokensPrices } from '@sb/compositions/Pools/index.types'
import { getStakedTokensFromOpenFarmingTickets } from '@sb/dexUtils/common/getStakedTokensFromOpenFarmingTickets'
import { FarmingState, FarmingTicket } from '@sb/dexUtils/common/types'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { STAKING_FARMING_TOKEN_DIVIDER } from '@sb/dexUtils/staking/config'
import { getTicketsWithUiValues } from '@sb/dexUtils/staking/getTicketsWithUiValues'
import { TokenInfo } from '@sb/dexUtils/types'
import React, { useEffect, useState } from 'react'
import { compose } from 'recompose'
import {
  BigNumber,
  LastPrice,
  Number,
  StatsBlock,
  StatsBlockItem
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
  currentFarmingState: FarmingState
  allStakingFarmingTickets: FarmingTicket[]
  poolsFees: number
}

const StatsComponent: React.FC<StatsComponentProps> = (
  props: StatsComponentProps
) => {
  const {
    getDexTokensPricesQuery,
    currentFarmingState,
    allStakingFarmingTickets,
    poolsFees,
  } = props
  const [RINCirculatingSupply, setCirculatingSupply] = useState(0)

  useEffect(() => {
    const getRINSupply = async () => {
      const CCAICircSupplyValue = await getRINCirculationSupply()
      setCirculatingSupply(CCAICircSupplyValue)
    }
    getRINSupply()
  }, [])

  const dexTokensPricesMap = getDexTokensPricesQuery?.getDexTokensPrices?.reduce(
    (acc, tokenPrice) => acc.set(tokenPrice.symbol, tokenPrice),
    new Map()
  )

  const tokenPrice =
    dexTokensPricesMap?.get(
      getTokenNameByMintAddress(currentFarmingState.farmingTokenMint)
    ).price || 0

  const tokensTotal =
    currentFarmingState?.tokensTotal / STAKING_FARMING_TOKEN_DIVIDER

  const poolsFeesWithoutDecimals = poolsFees / STAKING_FARMING_TOKEN_DIVIDER
  const totalTokensToBeDistributed = tokensTotal + poolsFeesWithoutDecimals

  const dailyRewards = totalTokensToBeDistributed / daysInMonth

  const totalStaked = getStakedTokensFromOpenFarmingTickets(
    getTicketsWithUiValues({
      tickets: allStakingFarmingTickets,
      farmingTokenMintDecimals: currentFarmingState.farmingTokenMintDecimals,
    })
  )
  const totalStakedUSD = tokenPrice * totalStaked

  const APR = (totalTokensToBeDistributed / totalStaked) * 100 * 12
  const formattedAPR = APR ? stripByAmount(APR, 2) : '--'

  useEffect(() => {
    document.title = `Aldrin | Stake RIN | ${formattedAPR}% APR`
    return () => {
      document.title = 'Aldrin'
    }
  }, [APR])

  const shareText = getShareText(formattedAPR)

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
          <Block $backgroundImage={pinkBackground}>
            <BlockContentStretched>
              <BlockTitle>Estimated Rewards</BlockTitle>
              <BigNumber>{formattedAPR}%</BigNumber>
              <StretchedBlock>
                <Number style={{ lineHeight: 'normal', marginTop: '1rem' }}>
                  APR
                </Number>
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
    query: getDexTokensPrices,
    name: 'getDexTokensPricesQuery',
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
    pollInterval: 60000,
  })
)(StatsComponent)
