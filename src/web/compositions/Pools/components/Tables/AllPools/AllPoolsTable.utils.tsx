import React, { useState } from 'react'
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
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { TokenIcon } from '@sb/components/TokenIcon'
import { StakePopup } from '../../Popups/Staking/StakePopup'
import { UserLiquidityDetails } from '../UserLiquidity/components/UserLiquidityDetails'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'

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
    apy24h: 900, //%
    supply: 120000,
    liquidity: 9835570,
    staked: 50,
    locked: true,
    executed: false,
  },
  {
    name:
      'E5ndSkaB17Dm7CsD22dvcjfrYSDLCxFcMd6z8ddCk5wp_EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    parsedName: 'RI8888N_U8SDC',
    tokenA: 'E5ndSkaB17Dm7CsD22dvcjfrYSDLCxFcMd6z8ddCk5wp',
    tokenB: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    swapToken: '55',
    poolTokenMint: 'E5ndSkaB17Dm7CsD22dvcjfrYSDLoxFcMd6z8ddCk5wp',
    tvl: {
      tokenA: 44,
      tokenB: 765,
    },
    apy24h: 900, //%
    supply: 120000,
    liquidity: 0,
    staked: 0,

    locked: false,
    executed: true,
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
    apy24h: 900, //%
    supply: 120000,
    liquidity: 935570,
    locked: false,
    executed: false,
    staked: 50,
  },
  {
    name:
      'A1BsqP5rH3HXhoFK6xLK6EFv9KsUzgR1UwBQhzMW9D2m_8wxoc2AnVsT6aLXDyA2G9PKfpx8mVT1Q5pPgvQLpCEVM',
    parsedName: 'PTA_PTB',
    tokenA: 'A1BsqP5rH3HXhoFK6xLK6EFv9KsUzgR1UwBQhzMW9D2m',
    tokenB: '8wxoc2AnVsT6aLXDyA2G9PKfpx8mVT1Q5pPgvQLpCEVM',
    swapToken: 'HwTyFCPy3xi842Be2PyU4ZPu3YmaxorV5RY4b77Pb898',
    poolTokenMint: '2TU6yyd8DSv2Xksz1oNe84D6qsxTCo7imiLBT2hsQVVY',
    tvl: {
      tokenA: 1099,
      tokenB: 4945509,
    },
    apy24h: 900, //%
    supply: 1099002507,
    liquidity: 935570,
    staked: 60,
    locked: false,
    executed: true,
    farmingStatePublicKey: 'Hg4hHQ2QZjS7bAGHXg9Kijvyw2mxDuBuqRFLajfPBTcr',
    farmingSnapshotQueue: 'CieRc6NeDoE3cnTVqsThrHdUkCP5LGeT2ibsuEJv25ri',
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
  allTokensDataMap,
  selectPool,
  setIsAddLiquidityPopupOpen,
  setIsWithdrawalPopupOpen,
  setIsStakePopupOpen,
  setIsUnstakePopupOpen,
}: {
  theme: Theme
  wallet: WalletAdapter
  poolsInfo: PoolInfo[]
  searchValue: string
  dexTokensPricesMap: Map<string, DexTokensPrices>
  feesPerPoolMap: Map<string, number>
  allTokensDataMap: Map<string, TokenInfo>
  selectPool: (pool: PoolInfo) => void
  setIsAddLiquidityPopupOpen: (value: boolean) => void
  setIsWithdrawalPopupOpen: (value: boolean) => void
  setIsStakePopupOpen: (value: boolean) => void
  setIsUnstakePopupOpen: (value: boolean) => void
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
            <Row
              justify="flex-start"
              style={{ width: '18rem', flexWrap: 'nowrap' }}
            >
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
          render: (
            <RowContainer justify="flex-start" theme={theme}>
              <Row margin="0 1rem 0 0" justify="flex-start">
                <TokenIcon
                  mint={el.tokenA}
                  width={'3rem'}
                  emojiIfNoLogo={false}
                  // isAwesomeMarket={isCustomUserMarket}
                  // isAdditionalCustomUserMarket={isPrivateCustomMarket}
                />
              </Row>
              <Row align="flex-start" direction="column">
                <RowDataTdText
                  fontFamily="Avenir Next Medium"
                  style={{ marginBottom: '1rem' }}
                  theme={theme}
                >
                  {getTokenNameByMintAddress(el.tokenA)}
                </RowDataTdText>
                <RowDataTdText>
                  <span style={{ color: '#A5E898' }}>12</span> RIN/Day for each
                  $<span style={{ color: '#A5E898' }}>1000</span>
                </RowDataTdText>
              </Row>
            </RowContainer>
          ),
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
                <UserLiquidityDetails
                  setIsWithdrawalPopupOpen={setIsWithdrawalPopupOpen}
                  setIsAddLiquidityPopupOpen={setIsAddLiquidityPopupOpen}
                  setIsStakePopupOpen={setIsStakePopupOpen}
                  setIsUnstakePopupOpen={setIsUnstakePopupOpen}
                  selectPool={selectPool}
                  allTokensDataMap={allTokensDataMap}
                  theme={theme}
                  pool={el}
                />
              ),
              colspan: 8,
            },
          },
        ],
      }
    })

  return processedAllPoolsData.filter((el) => !!el)
}