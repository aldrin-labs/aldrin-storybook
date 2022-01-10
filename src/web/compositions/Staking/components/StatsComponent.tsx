import { getRINCirculationSupply } from '@core/api'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getDexTokensPrices } from '@core/graphql/queries/pools/getDexTokensPrices'
import {
  stripByAmount,
  stripByAmountAndFormat
} from '@core/utils/chartPageUtils'
import { dayDuration } from '@core/utils/dateUtils'
import {
  formatNumberToUSFormat,
  stripDigitPlaces
} from '@core/utils/PortfolioTableUtils'
import { SvgIcon } from '@sb/components'
import {
  Block,
  BlockContentStretched,
  BlockSubtitle,
  BlockTitle
} from '@sb/components/Block'
import { Cell, Row, StretchedBlock } from '@sb/components/Layout'
import { ShareButton } from '@sb/components/ShareButton'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { InlineText, Text } from '@sb/components/Typography'
import { MarketDataByTicker } from '@sb/compositions/Chart/components/MarketStats/MarketStats'
import { DexTokensPrices } from '@sb/compositions/Pools/index.types'
import { FarmingState } from '@sb/dexUtils/common/types'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import {
  DAYS_TO_CHECK_BUY_BACK,
  STAKING_FARMING_TOKEN_DIVIDER,
} from '@sb/dexUtils/staking/config'

import Info from '@icons/TooltipImg.svg'

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
  buyBackAmount: number
  totalStaked: number
}

const StatsComponent: React.FC<StatsComponentProps> = (
  props: StatsComponentProps
) => {
  const {
    getDexTokensPricesQuery,
    currentFarmingState,
    buyBackAmount,
    totalStaked,
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

  const RINMarketcap = RINCirculatingSupply * tokenPrice

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
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  flexWrap: 'nowrap',
                }}
              >
                <BigNumber>{formattedAPR}% APR</BigNumber>
              </div>

              <StretchedBlock>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <Number
                    style={{
                      lineHeight: 'normal',
                      marginTop: '1rem',
                      fontSize: '.9em',
                      fontWeight: 400,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {formattedTreasuryAPR}% + {formattedBuyBackAPR}%
                  </Number>
                  <DarkTooltip
                    title={
                      <span>
                        <div style={{ marginBottom: '1rem' }}>
                          The first APR is calculated based on fixed “treasury” rewards. 
                          These rewards estimation are updated hourly.
                        </div>
                        <div>
                          The second APR is calculated based on the current RIN price and the 
                          average AMM fees for the past 7d. The reward estimations are updated weekly.
                        </div>
                      </span>
                    }
                  >
                    <div style={{ display: 'flex' }}>
                      <SvgIcon src={Info} width={'1.2em'} height={'auto'} />
                    </div>
                  </DarkTooltip>
                </div>
                <div>
                  <ShareButton
                    text={shareText}
                    buttonStyle={{ minWidth: 'auto' }}
                  />
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
                  <BlockSubtitle margin={'0 0 3rem 0'}>Price</BlockSubtitle>
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
                  <BlockSubtitle margin={'0 0 3rem 0'}>Circulating Supply</BlockSubtitle>
                  <Number>
                    {stripByAmountAndFormat(RINCirculatingSupply)} RIN
                  </Number>
                </StatsBlockItem>
                <StatsBlockItem>
                  <BlockSubtitle margin={'0 0 3rem 0'}>Marketcap</BlockSubtitle>
                  <Number>${stripByAmountAndFormat(RINMarketcap)}</Number>
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
