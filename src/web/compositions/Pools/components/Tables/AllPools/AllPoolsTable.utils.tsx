import React from 'react'
import { Theme } from '@sb/types/materialUI'
import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'
import { filterDataBySymbolForDifferentDeviders } from '@sb/compositions/Chart/Inputs/SelectWrapper/SelectWrapper.utils'

import { DexTokensPrices, PoolInfo } from '@sb/compositions/Pools/index.types'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'

import { SvgIcon } from '@sb/components'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BlueButton } from '@sb/compositions/Chart/components/WarningPopup'
import { TokenIconsContainer } from '../components'
import {
  GreenButton,
  RowDataTdText,
  RowDataTdTopText,
  TextColumnContainer,
} from '../index.styles'

import GreyArrow from '@icons/greyArrow.svg'
import Info from '@icons/TooltipImg.svg'
import CrownIcon from '@icons/crownIcon.svg'
import ForbiddenIcon from '@icons/fobiddenIcon.svg'

import { WalletAdapter } from '@sb/dexUtils/types'

export const mock = [
  {
    name:
      'E5ndSkaB17Dm7CsD22dvcjfrYSDLCxFcMd6z8ddCk5wp_EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    parsedName: 'RIN_USDC',
    tokenA: 'E5ndSkaB17Dm7CsD22dvcjfrYSDLCxFcMd6z8ddCk5wp',
    tokenB: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    swapToken: '55',
    poolTokenMint: 'E5ndSkaB17Dm7CsD22dvcjfrYSDLCxFcMd6z8ddCk5wp',
    tvl: {
      tokenA: 45,
      tokenB: 2,
    },
    apy24h: 0.21, //%
    supply: 120000,
    liquidity: 9835570,
  },
  {
    name:
      'E5ndSkaB17Dm7CsD22dvcjfrYSDLCxFcMd6z8ddCk5wp_EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    parsedName: 'RIN_USDC',
    tokenA: 'E5ndSkaB17Dm7CsD22dvcjfrYSDLCxFcMd6z8ddCk5wp',
    tokenB: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    swapToken: '55',
    poolTokenMint: 'E5ndSkaB17Dm7CsD22dvcjfrYSDLoxFcMd6z8ddCk5wp',
    tvl: {
      tokenA: 44,
      tokenB: 765,
    },
    apy24h: 0.21, //%
    supply: 120000,
    liquidity: 0,
  },
  {
    name:
      'E5ndSkaB17Dm7CsD22dvcjfrYSDLCxFcMd6z8ddCk5wp_EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    parsedName: 'RIN_USDC',
    tokenA: 'E5ndSkaB17Dm7CsD22dvcjfrYSDLCxFcMd6z8ddCk5wp',
    tokenB: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    swapToken: '55',
    poolTokenMint: 'E5ndSkaB17Dm7CsD22dvcjfrYkDLCxFcMd6z8ddCk5wp',
    tvl: {
      tokenA: 44,
      tokenB: 765,
    },
    apy24h: 0.21, //%
    supply: 120000,
    liquidity: 935570,
  },
  {
    name:
      'A1BsqP5rH3HXhoFK6xLK6EFv9KsUzgR1UwBQhzMW9D2m_EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    parsedName: 'PTA_PTB',
    tokenA: 'A1BsqP5rH3HXhoFK6xLK6EFv9KsUzgR1UwBQhzMW9D2m',
    tokenB: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    swapToken: 'HwTyFCPy3xi842Be2PyU4ZPu3YmaxorV5RY4b77Pb898',
    poolTokenMint: '2TU6yyd8DSv2Xksz1oNe84D6qsxTCo7imiLBT2hsQVVY',
    tvl: {
      tokenA: 44,
      tokenB: 765,
    },
    apy24h: 0.21, //%
    supply: 120000,
    liquidity: 935570,
  },
]

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
  wallet,
  poolsInfo,
  searchValue,
  dexTokensPricesMap,
  feesPerPoolMap,
  selectPool,
  setIsAddLiquidityPopupOpen,
  setIsWithdrawalPopupOpen,
}: {
  theme: Theme
  wallet: WalletAdapter
  poolsInfo: PoolInfo[]
  searchValue: string
  dexTokensPricesMap: Map<string, DexTokensPrices>
  feesPerPoolMap: Map<string, number>
  selectPool: (pool: PoolInfo) => void
  setIsAddLiquidityPopupOpen: (value: boolean) => void
  setIsWithdrawalPopupOpen: (value: boolean) => void
}) => {
  // const processedAllPoolsData = poolsInfo
  const processedAllPoolsData = mock
    .filter((el) =>
      filterDataBySymbolForDifferentDeviders({
        searchValue,
        symbol: el.parsedName,
      })
    )
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
            <Row style={{ width: '18rem', flexWrap: 'nowrap' }}>
              <TokenIconsContainer tokenA={el.tokenA} tokenB={el.tokenB} />{' '}
              {el.locked ? (
                <SvgIcon
                  style={{ marginLeft: '1rem' }}
                  width="2rem"
                  height="auto"
                  src={CrownIcon}
                />
              ) : el.executed ? (
                <DarkTooltip
                  title={
                    'RIN token founders complained about this pool, it will be excluded from the catalog and AMM. You can withdraw liquidity and deposit it in the official pool at "All Pools" tab.'
                  }
                >
                  <div>
                    <SvgIcon
                      style={{ marginLeft: '1rem' }}
                      width="2rem"
                      height="auto"
                      src={ForbiddenIcon}
                    />
                  </div>
                </DarkTooltip>
              ) : null}
            </Row>
          ),
        },
        tvl: {
          render: (
            <TextColumnContainer>
              <RowDataTdTopText theme={theme}>
                ${formatNumberToUSFormat(stripDigitPlaces(tvlUSD, 2))}
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
                        onClick={() => {
                          if (!wallet.connected) {
                            wallet.connect()
                            return
                          }

                          selectPool(el)
                          setIsAddLiquidityPopupOpen(true)
                        }}
                      >
                        {wallet.connected
                          ? 'Deposit Liquidity'
                          : 'Connect Wallet'}
                      </BlueButton>
                      {el.liquidity ? (
                        <BlueButton
                          theme={theme}
                          onClick={() => {
                            if (!wallet.connected) {
                              wallet.connect()
                              return
                            }

                            selectPool(el)
                            setIsWithdrawalPopupOpen(true)
                          }}
                        >
                          {wallet.connected
                            ? 'Withdraw Liquidity + Fees'
                            : 'Connect Wallet'}
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
                        <GreenButton
                          onClick={() => {
                            if (!wallet.connected) {
                              wallet.connect()
                              return
                            }
                          }}
                        >
                          {wallet.connected
                            ? 'Stake Pool Token'
                            : 'Connect Wallet'}
                        </GreenButton>
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
