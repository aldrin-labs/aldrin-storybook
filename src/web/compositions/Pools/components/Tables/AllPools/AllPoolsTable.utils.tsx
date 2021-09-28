import React from 'react'
import { Theme } from '@sb/types/materialUI'
import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'

import { DexTokensPrices, PoolInfo } from '@sb/compositions/Pools/index.types'
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

import { mock } from './AllPoolsTable'
import { SvgIcon } from '@sb/components'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BlueButton } from '@sb/compositions/Chart/components/WarningPopup'

export const allPoolsTableColumnsNames = [
  { label: 'Pool', id: 'pool' },
  { label: 'Total Value Locked', id: 'tvl' },
  {
    label: (
      <>
        <span>Volume</span>{' '}
        <span style={{ color: '#96999C', padding: '0 0 0 0.5rem' }}> 24h</span>
      </>
    ),
    id: 'vol24h',
  },
  {
    label: (
      <>
        <span>Volume</span>{' '}
        <span style={{ color: '#96999C', padding: '0 0 0 0.5rem' }}> 7d</span>
      </>
    ),
    id: 'vol7d',
  },
  {
    label: (
      <>
        <span>Fees</span>{' '}
        <span style={{ color: '#96999C', padding: '0 0 0 0.5rem' }}> 24h</span>
      </>
    ),
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

export const combineAllPoolsData = ({
  theme,
  dexTokensPricesMap,
  feesPerPoolMap,
}: {
  theme: Theme
  dexTokensPricesMap: Map<string, DexTokensPrices>
  feesPerPoolMap: any
}) => {
  const processedAllPoolsData = mock
    // .sort((poolA: PoolInfo, poolB: PoolInfo) => {
    //   const [poolABaseTokenPrice, poolBBaseTokenPrice] = [
    //     dexTokensPricesMap.get(getTokenNameByMintAddress(poolA.tokenA))
    //       ?.price || 10,
    //     dexTokensPricesMap.get(getTokenNameByMintAddress(poolB.tokenA))
    //       ?.price || 10,
    //   ]

    //   const [poolAQuoteTokenPrice, poolBQuoteTokenPrice] = [
    //     dexTokensPricesMap.get(getTokenNameByMintAddress(poolA.tokenB))
    //       ?.price || 10,
    //     dexTokensPricesMap.get(getTokenNameByMintAddress(poolB.tokenB))
    //       ?.price || 10,
    //   ]

    //   const poolATvlUSD =
    //     poolABaseTokenPrice * poolA.tvl.tokenA +
    //     poolAQuoteTokenPrice * poolA.tvl.tokenB

    //   const poolBTvlUSD =
    //     poolBBaseTokenPrice * poolB.tvl.tokenA +
    //     poolBQuoteTokenPrice * poolB.tvl.tokenB

    //   return poolBTvlUSD - poolATvlUSD
    // })
    .map((el) => {
      const baseSymbol = getTokenNameByMintAddress(el.tokenA)
      const quoteSymbol = getTokenNameByMintAddress(el.tokenB)

      const baseTokenPrice = dexTokensPricesMap.get(baseSymbol)?.price || 10
      const quoteTokenPrice = dexTokensPricesMap.get(quoteSymbol)?.price || 10

      const tvlUSD =
        baseTokenPrice * el.tvl.tokenA + quoteTokenPrice * el.tvl.tokenB

      const fees = feesPerPoolMap.get(el.swapToken) || 0
      const apy = el.apy24h || 0
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
        vol24h: {
          render: (
            <RowDataTdText theme={theme}>
              ${formatNumberToUSFormat(stripDigitPlaces(2000000, 2))}
            </RowDataTdText>
          ),
          style: { textAlign: 'left' },
          contentToSort: '',
          showOnMobile: false,
        },

        vol7d: {
          render: (
            <RowDataTdText theme={theme}>
              ${formatNumberToUSFormat(stripDigitPlaces(2000000, 2))}
            </RowDataTdText>
          ),
          style: { textAlign: 'left' },
          contentToSort: '',
          showOnMobile: false,
        },
        fees: {
          render: (
            <RowDataTdText theme={theme}>
              ${stripDigitPlaces(fees, 6)}
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
              {stripDigitPlaces(apy, 6)}%
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
                    <Row align="flex-start" direction="column" width="30%">
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
                        100 RIN / 2 SOL ($1,000){' '}
                      </RowDataTdText>
                    </Row>
                    {el.liquidity ? (
                      <Row align="flex-start" direction="column" width="30%">
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
                          100 RIN / 2 SOL ($1,000){' '}
                        </RowDataTdText>
                      </Row>
                    ) : null}
                    <Row direction="column" width="30%">
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
