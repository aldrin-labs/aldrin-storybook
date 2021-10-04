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

import CrownIcon from '@icons/crownIcon.svg'
import ForbiddenIcon from '@icons/fobiddenIcon.svg'
import GreyArrow from '@icons/greyArrow.svg'
import Info from '@icons/TooltipImg.svg'
import { mock } from '../AllPools/AllPoolsTable.utils'
import { calculateWithdrawAmount } from '@sb/dexUtils/pools'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { TokenIcon } from '@sb/components/TokenIcon'
import { UserLiquidityDetails } from './components/UserLiquidityDetails'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'

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
  allTokensDataMap,
  earnedFeesInPoolForUserMap,
  selectPool,
  setIsWithdrawalPopupOpen,
  setIsAddLiquidityPopupOpen,
  setIsStakePopupOpen,
  setIsUnstakePopupOpen,
}: {
  theme: Theme
  dexTokensPricesMap: Map<string, DexTokensPrices>
  usersPools: any
  allTokensDataMap: Map<string, TokenInfo>
  earnedFeesInPoolForUserMap: Map<string, number>
  selectPool: (pool: PoolInfo) => void
  setIsWithdrawalPopupOpen: (value: boolean) => void
  setIsAddLiquidityPopupOpen: (value: boolean) => void
  setIsStakePopupOpen: (value: boolean) => void
  setIsUnstakePopupOpen: (value: boolean) => void
}) => {
  // const processedUserLiquidityData = usersPools
  const processedUserLiquidityData = mock.map((el: PoolInfo) => {
    const baseSymbol = getTokenNameByMintAddress(el.tokenA)
    const quoteSymbol = getTokenNameByMintAddress(el.tokenB)

    const baseTokenPrice = dexTokensPricesMap.get(baseSymbol)?.price || 10

    const quoteTokenPrice = dexTokensPricesMap.get(quoteSymbol)?.price || 10

    const tvlUSD =
      baseTokenPrice * el.tvl.tokenA + quoteTokenPrice * el.tvl.tokenB

    const {
      amount: poolTokenRawAmount,
      decimals: poolTokenDecimals,
    } = allTokensDataMap.get(el.poolTokenMint) || {
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
            $
            {stripDigitPlaces(
              earnedFeesInPoolForUserMap.get(el.swapToken) || 0,
              6
            )}
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
            {stripDigitPlaces(el.apy24h, 6)}%
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
                <span style={{ color: '#A5E898' }}>12</span> RIN/Day for each $
                <span style={{ color: '#A5E898' }}>1000</span>
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
                setIsStakePopupOpen={setIsStakePopupOpen}
                setIsUnstakePopupOpen={setIsUnstakePopupOpen}
                setIsWithdrawalPopupOpen={setIsWithdrawalPopupOpen}
                setIsAddLiquidityPopupOpen={setIsAddLiquidityPopupOpen}
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

  return processedUserLiquidityData.filter((el) => !!el)
}
