import React from 'react'
import { Theme } from '@sb/types/materialUI'

import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'
import { SvgIcon } from '@sb/components'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BlueButton } from '@sb/compositions/Chart/components/WarningPopup'
import { PoolInfo, DexTokensPrices } from '@sb/compositions/Pools/index.types'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { TokenIconsContainer } from '../components'
import {
  GreenButton,
  RowDataTdText,
  RowDataTdTopText,
  TextColumnContainer,
} from '../index.styles'

import GreyArrow from '@icons/greyArrow.svg'
import Info from '@icons/TooltipImg.svg'
import { mock } from '../AllPools/AllPoolsTable'
import { calculateWithdrawAmount } from '@sb/dexUtils/pools'

export const getTotalUserLiquidity = ({
  usersPools,
  dexTokensPrices,
}: {
  usersPools: PoolInfo[]
  dexTokensPrices: DexTokensPrices[]
}): number => {
  return usersPools.reduce((acc: number, pool: PoolInfo) => {
    const baseSymbol = getTokenNameByMintAddress(pool.tokenA)
    const quoteSymbol = getTokenNameByMintAddress(pool.tokenB)

    const baseTokenPrice =
      dexTokensPrices.find((tokenInfo) => tokenInfo.symbol === baseSymbol)
        ?.price || 10

    const quoteTokenPrice =
      dexTokensPrices.find((tokenInfo) => tokenInfo.symbol === quoteSymbol)
        ?.price || 10

    const tvlUSDForPool =
      baseTokenPrice * pool.tvl.tokenA + quoteTokenPrice * pool.tvl.tokenB

    return acc + tvlUSDForPool
  }, 0)
}

export const userLiquidityTableColumnsNames = [
  { label: 'Pool', id: 'pool' },
  { label: 'Total Value Locked', id: 'tvl' },
  { label: 'Your Liquidity (Including Fees)', id: 'userLiquidity' },
  {
    label: 'Fees Earned',
    id: 'fees',
  },
  {
    label: (
      <>
        <span>APY</span>{' '}
        <span style={{ color: '#96999C', padding: '0 0 0 0.5rem' }}> 24h</span>
        <SvgIcon
          src={Info}
          width={'1.5rem'}
          height={'auto'}
          style={{ marginLeft: '1rem' }}
        />
      </>
    ),
    id: 'apy',
  },
  {
    label: (
      <>
        Farming
        <SvgIcon
          src={Info}
          width={'1.5rem'}
          height={'auto'}
          style={{ marginLeft: '1rem' }}
        />
      </>
    ),
    id: 'farming',
  },
  { label: '', id: 'details' },
]

export type Pools = {}

export const combineUserLiquidityData = ({
  theme,
  dexTokensPricesMap,
  usersPools,
  allTokensData,
}: {
  theme: Theme
  dexTokensPricesMap: Map<string, DexTokensPrices>
  usersPools: any
  allTokensData: any
}) => {
  const processedAllPoolsData = mock
    .sort((poolA: PoolInfo, poolB: PoolInfo) => {
      const [poolABaseTokenPrice, poolBBaseTokenPrice] = [
        dexTokensPricesMap.get(getTokenNameByMintAddress(poolA.tokenA))
          ?.price || 10,
        dexTokensPricesMap.get(getTokenNameByMintAddress(poolB.tokenA))
          ?.price || 10,
      ]

      const [poolAQuoteTokenPrice, poolBQuoteTokenPrice] = [
        dexTokensPricesMap.get(getTokenNameByMintAddress(poolA.tokenB))
          ?.price || 10,
        dexTokensPricesMap.get(getTokenNameByMintAddress(poolB.tokenB))
          ?.price || 10,
      ]

      const poolATvlUSD =
        poolABaseTokenPrice * poolA.tvl.tokenA +
        poolAQuoteTokenPrice * poolA.tvl.tokenB

      const poolBTvlUSD =
        poolBBaseTokenPrice * poolB.tvl.tokenA +
        poolBQuoteTokenPrice * poolB.tvl.tokenB

      return poolBTvlUSD - poolATvlUSD
    })
    .map((el: PoolInfo) => {
      const baseSymbol = getTokenNameByMintAddress(el.tokenA)
      const quoteSymbol = getTokenNameByMintAddress(el.tokenB)

      const baseTokenPrice = dexTokensPricesMap.get(baseSymbol)?.price || 10

      const quoteTokenPrice = dexTokensPricesMap.get(quoteSymbol)?.price || 10

      const tvlUSD =
        baseTokenPrice * el.tvl.tokenA + quoteTokenPrice * el.tvl.tokenB

      const {
        amount: poolTokenRawAmount,
        decimals: poolTokenDecimals,
      } = allTokensData.find(
        (tokenData) => tokenData.mint === el.poolTokenMint
      ) || {
        amount: 0,
        decimals: 0,
      }

      const poolTokenAmount = poolTokenRawAmount * 10 ** poolTokenDecimals

      const [userAmountTokenA, userAmountTokenB] = calculateWithdrawAmount({
        selectedPool: el,
        poolTokenAmount: poolTokenAmount,
      })

      const userLiquidityUSD =
        baseTokenPrice * userAmountTokenA + quoteTokenPrice * userAmountTokenB

      return {
        id: `${el.name}${el.tvl}${el.poolTokenMint}`,
        pool: {
          render: (
            <div style={{ width: '15rem' }}>
              <TokenIconsContainer tokenA={el.tokenA} tokenB={el.tokenB} />
            </div>
          ),
        },
        tvl: {
          render: (
            <TextColumnContainer>
              <RowDataTdTopText theme={theme}>
                ${tvlUSD}
                {formatNumberToUSFormat(stripDigitPlaces(tvlUSD, 2))}
              </RowDataTdTopText>
              <RowDataTdText theme={theme} color={theme.palette.grey.new}>
                {formatNumberToUSFormat(stripDigitPlaces(el.tvl.tokenA, 2))}{' '}
                {getTokenNameByMintAddress(el.tokenA)} /{' '}
                {formatNumberToUSFormat(stripDigitPlaces(el.tvl.tokenB, 2))}{' '}
                {getTokenNameByMintAddress(el.tokenB)}
              </RowDataTdText>
            </TextColumnContainer>
          ),
          showOnMobile: false,
        },
        userLiquidity: {
          render: (
            <TextColumnContainer>
              <RowDataTdTopText theme={theme}>
                ${tvlUSD}
                {formatNumberToUSFormat(stripDigitPlaces(tvlUSD, 2))}
              </RowDataTdTopText>
              <RowDataTdText theme={theme} color={theme.palette.grey.new}>
                {formatNumberToUSFormat(stripDigitPlaces(el.tvl.tokenA, 2))}{' '}
                {getTokenNameByMintAddress(el.tokenA)} /{' '}
                {formatNumberToUSFormat(stripDigitPlaces(el.tvl.tokenB, 2))}{' '}
                {getTokenNameByMintAddress(el.tokenB)}
              </RowDataTdText>
            </TextColumnContainer>
          ),
        },
        fees: {
          render: (
            <RowDataTdText theme={theme}>
              ${stripDigitPlaces(600000000, 6)}
            </RowDataTdText>
          ),
        },
        apy: {
          render: (
            <RowDataTdText
              color={'#A5E898'}
              fontFamily="Avenir Next Medium"
              theme={theme}
            >
              {stripDigitPlaces(70000000000000, 6)}%
            </RowDataTdText>
          ),
        },
        farming: {
          render: <RowDataTdText theme={theme}>0</RowDataTdText>,
        },
        details: {
          render: (
            <Row>
              <RowDataTdText
                theme={theme}
                color={theme.palette.grey.new}
                fontFamily="Avenir Next Medium"
                style={{ marginRight: '1rem' }}
              >
                Details
              </RowDataTdText>
              <SvgIcon width="1rem" height="auto" src={GreyArrow} />
            </Row>
          ),
        },
        expandableContent: [
          {
            row: {
              render: (
                <RowContainer margin="1rem 0" style={{ background: '#222429' }}>
                  <Row
                    style={{
                      borderRight: `0.2rem solid #383B45`,
                    }}
                    justify="space-between"
                    width="60%"
                  >
                    <Row align="flex-start" direction="column" width="25%">
                      <RowDataTdText
                        theme={theme}
                        color={theme.palette.grey.new}
                        style={{ marginBottom: '1rem' }}
                      >
                        Your Liquitity:
                      </RowDataTdText>
                      <RowDataTdText
                        color={'#A5E898'}
                        fontFamily="Avenir Next Medium"
                        theme={theme}
                      >
                        100{' '}
                        <span style={{ color: '#fbf2f2' }}>
                          {getTokenNameByMintAddress(el.tokenA)}
                        </span>{' '}
                        / 2{' '}
                        <span style={{ color: '#fbf2f2' }}>
                          {getTokenNameByMintAddress(el.tokenB)}
                        </span>{' '}
                        (<span style={{ color: '#fbf2f2' }}>$</span>1,000){' '}
                      </RowDataTdText>
                    </Row>
                    {el.liquidity ? (
                      <Row align="flex-start" direction="column" width="25%">
                        <RowDataTdText
                          theme={theme}
                          color={theme.palette.grey.new}
                          style={{ marginBottom: '1rem' }}
                        >
                          Fees Earned:
                        </RowDataTdText>
                        <RowDataTdText
                          color={'#A5E898'}
                          fontFamily="Avenir Next Medium"
                          theme={theme}
                        >
                          100{' '}
                          <span style={{ color: '#fbf2f2' }}>
                            {getTokenNameByMintAddress(el.tokenA)}
                          </span>{' '}
                          / 2{' '}
                          <span style={{ color: '#fbf2f2' }}>
                            {getTokenNameByMintAddress(el.tokenB)}
                          </span>{' '}
                          (<span style={{ color: '#fbf2f2' }}>$</span>1,000){' '}
                        </RowDataTdText>
                      </Row>
                    ) : null}{' '}
                    <Row align="flex-start" direction="column" width="25%">
                      <RowDataTdText
                        theme={theme}
                        color={theme.palette.grey.new}
                        style={{ marginBottom: '1rem' }}
                      >
                        Pool Tokens:
                      </RowDataTdText>
                      <RowDataTdText
                        color={'#A5E898'}
                        fontFamily="Avenir Next Medium"
                        theme={theme}
                      >
                        <span style={{ color: '#fbf2f2' }}>Total:</span> 500{' '}
                        <span style={{ color: '#fbf2f2' }}>Staked:</span> 200
                      </RowDataTdText>
                    </Row>
                    <Row direction="column" width="25%">
                      <BlueButton
                        theme={theme}
                        style={{ marginBottom: '1rem' }}
                      >
                        Deposit Liquidity{' '}
                      </BlueButton>
                      {el.liquidity ? (
                        <BlueButton theme={theme}>
                          Withdraw Liquidity + Fees
                        </BlueButton>
                      ) : null}
                    </Row>
                  </Row>
                  <Row justify="space-between" width="40%" padding="0 0 0 4rem">
                    <Row align="flex-start" direction="column" width="60%">
                      <RowDataTdText
                        theme={theme}
                        fontFamily={'Avenir Next Medium'}
                        style={{ marginBottom: '2rem' }}
                      >
                        Farming
                      </RowDataTdText>
                      <RowDataTdText theme={theme}>
                        {el.liquidity ? (
                          <>
                            Stake your pool tokens to start
                            <span
                              style={{ color: '#A5E898', padding: '0 0.5rem' }}
                            >
                              RIN
                            </span>
                            farming
                          </>
                        ) : (
                          <>
                            Deposit liquidity to farm{' '}
                            <span style={{ color: '#A5E898' }}>RIN</span>
                          </>
                        )}
                      </RowDataTdText>
                    </Row>
                    {el.liquidity ? (
                      <Row direction="column" width="40%" align="flex-end">
                        {' '}
                        <RowDataTdText
                          theme={theme}
                          fontFamily={'Avenir Next Medium'}
                          style={{ marginBottom: '2rem' }}
                        >
                          <span
                            style={{ color: '#A5E898', padding: '0 0.5rem' }}
                          >
                            0
                          </span>{' '}
                          RIN
                        </RowDataTdText>
                        <GreenButton>Stake Pool Token</GreenButton>
                      </Row>
                    ) : null}
                  </Row>
                </RowContainer>
              ),
              colspan: 8,
            },
          },
        ],
      }
    })

  return processedAllPoolsData.filter((el) => !!el)
}
