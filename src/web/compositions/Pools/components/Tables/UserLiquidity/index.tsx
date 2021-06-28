import React from 'react'
import { compose } from 'recompose'

import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import {
  LiquidityDataContainer,
  TableHeader,
  TableRow,
  Table,
  BorderButton,
  RowTd,
  RowDataTd,
  RowDataTdText,
  TextColumnContainer,
  RowDataTdTopText,
} from '@sb/compositions/Pools/components/Tables/index.styles'

import { BlockTemplate } from '../../../index.styles'

import { TokenIconsContainer } from '../components/index'

import TooltipIcon from '@icons/TooltipImg.svg'

import { Text } from '@sb/compositions/Addressbook/index'
import SvgIcon from '@sb/components/SvgIcon'
import { getPoolsInfo } from '@core/graphql/queries/pools/getPoolsInfo'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getFeesEarnedByAccount } from '@core/graphql/queries/pools/getFeesEarnedByAccount'
import { Theme } from '@material-ui/core'
import {
  PoolInfo,
  FeesEarned,
  DexTokensPrices,
} from '@sb/compositions/Pools/index.types'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { calculateWithdrawAmount } from '@sb/dexUtils/pools'
import { getTokenDataByMint } from '@sb/compositions/Pools/utils/getTokenDataByMint'
import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'
import { WalletAdapter } from '@sb/dexUtils/types'
import { getTotalUserLiquidity } from './utils'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'

const UserLiquitidyTable = ({
  theme,
  wallet,
  allTokensData,
  getPoolsInfoQuery: { getPoolsInfo },
  dexTokensPrices,
  getFeesEarnedByAccountQuery,
  selectPool,
  setIsWithdrawalPopupOpen,
  setIsAddLiquidityPopupOpen,
}: {
  theme: Theme
  wallet: WalletAdapter
  allTokensData: TokenInfo[]
  getPoolsInfoQuery: { getPoolsInfo: PoolInfo[] }
  dexTokensPrices: DexTokensPrices[]
  getFeesEarnedByAccountQuery: { getFeesEarnedByAccount: FeesEarned[] }
  selectPool: (pool: PoolInfo) => void
  setIsWithdrawalPopupOpen: (value: boolean) => void
  setIsAddLiquidityPopupOpen: (value: boolean) => void
}) => {
  const allTokensDataMap = new Map()

  allTokensData.forEach((el) => allTokensDataMap.set(el.mint, el))

  const usersPools = getPoolsInfo.filter(
    (el) =>
      allTokensDataMap.has(el.poolTokenMint) &&
      allTokensDataMap.get(el.poolTokenMint).amount > 0
  )

  const { getFeesEarnedByAccount = [] } = getFeesEarnedByAccountQuery || {
    getFeesEarnedByAccountQuery: [],
  }

  return (
    <RowContainer>
      <BlockTemplate
        width={'100%'}
        height={'auto'}
        style={{ marginTop: '2rem' }}
        align={'start'}
        theme={theme}
        direction={'column'}
        justify={'end'}
      >
        <RowContainer padding="2rem" justify={'space-between'} align="center">
          <Text theme={theme}>Your Liquidity</Text>
          <Row width={'33%'}>
            <LiquidityDataContainer>
              <RowDataTdText theme={theme} color={theme.palette.grey.new}>
                Liquidity (Including Fees)
              </RowDataTdText>
              <Text
                theme={theme}
                color={theme.palette.green.new}
                fontFamily={'Avenir Next Demi'}
              >
                $
                {formatNumberToUSFormat(
                  stripDigitPlaces(
                    getTotalUserLiquidity({ usersPools, dexTokensPrices }),
                    2
                  )
                )}
              </Text>
            </LiquidityDataContainer>
            <LiquidityDataContainer style={{ paddingLeft: '3rem' }}>
              <RowDataTdText theme={theme} color={theme.palette.grey.new}>
                Fees Earned (Cumulative)
              </RowDataTdText>
              <Text
                theme={theme}
                color={theme.palette.green.new}
                fontFamily={'Avenir Next Demi'}
              >
                $
                {stripDigitPlaces(
                  getFeesEarnedByAccount.reduce((acc, el: FeesEarned) => {
                    return acc + el.earnedUSD
                  }, 0),
                  3
                )}
              </Text>
            </LiquidityDataContainer>
          </Row>
        </RowContainer>
        <RowContainer>
          <Table>
            <TableHeader>
              <RowTd>Pool</RowTd>
              <RowTd>TVL</RowTd>
              <RowTd>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <DarkTooltip
                    title={
                      'Annualized, non-compounded return on investment based on the fees earned in the last 24 hours, relative to the size of the pool.'
                    }
                  >
                    <SvgIcon
                      width={'1.2rem'}
                      height={'1.2rem'}
                      style={{ marginRight: '1rem' }}
                      src={TooltipIcon}
                    />
                  </DarkTooltip>
                  APY (24h)
                </div>
              </RowTd>
              <RowTd>Your Liquidity (Including Fees)</RowTd>
              <RowTd>Total Fees Earned</RowTd>
              <RowTd></RowTd>
            </TableHeader>
            {usersPools
              .sort((poolA: PoolInfo, poolB: PoolInfo) => {
                const [poolABaseTokenPrice, poolBBaseTokenPrice] = [
                  dexTokensPrices.find(
                    (tokenInfo) =>
                      tokenInfo.symbol ===
                      getTokenNameByMintAddress(poolA.tokenA)
                  )?.price || 10,
                  dexTokensPrices.find(
                    (tokenInfo) =>
                      tokenInfo.symbol ===
                      getTokenNameByMintAddress(poolB.tokenA)
                  )?.price || 10,
                ]

                const [poolAQuoteTokenPrice, poolBQuoteTokenPrice] = [
                  dexTokensPrices.find(
                    (tokenInfo) =>
                      tokenInfo.symbol ===
                      getTokenNameByMintAddress(poolA.tokenB)
                  )?.price || 10,
                  dexTokensPrices.find(
                    (tokenInfo) =>
                      tokenInfo.symbol ===
                      getTokenNameByMintAddress(poolB.tokenB)
                  )?.price || 10,
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

                const baseTokenPrice =
                  dexTokensPrices.find(
                    (tokenInfo) => tokenInfo.symbol === baseSymbol
                  )?.price || 10

                const quoteTokenPrice =
                  dexTokensPrices.find(
                    (tokenInfo) => tokenInfo.symbol === quoteSymbol
                  )?.price || 10

                const tvlUSD =
                  baseTokenPrice * el.tvl.tokenA +
                  quoteTokenPrice * el.tvl.tokenB

                const {
                  amount: poolTokenRawAmount,
                  decimals: poolTokenDecimals,
                } = getTokenDataByMint(allTokensData, el.poolTokenMint)

                const poolTokenAmount =
                  poolTokenRawAmount * 10 ** poolTokenDecimals

                const [
                  userAmountTokenA,
                  userAmountTokenB,
                ] = calculateWithdrawAmount({
                  selectedPool: el,
                  poolTokenAmount: poolTokenAmount,
                })

                const userLiquidityUSD =
                  baseTokenPrice * userAmountTokenA +
                  quoteTokenPrice * userAmountTokenB

                return (
                  <TableRow>
                    <RowTd>
                      <TokenIconsContainer
                        tokenA={el.tokenA}
                        tokenB={el.tokenB}
                      />
                    </RowTd>
                    <RowDataTd>
                      <TextColumnContainer>
                        <RowDataTdTopText theme={theme}>
                          ${formatNumberToUSFormat(stripDigitPlaces(tvlUSD, 2))}
                        </RowDataTdTopText>
                        <RowDataTdText
                          theme={theme}
                          color={theme.palette.grey.new}
                        >
                          {formatNumberToUSFormat(
                            stripDigitPlaces(el.tvl.tokenA, 2)
                          )}{' '}
                          {getTokenNameByMintAddress(el.tokenA)} /{' '}
                          {formatNumberToUSFormat(
                            stripDigitPlaces(el.tvl.tokenB, 2)
                          )}{' '}
                          {getTokenNameByMintAddress(el.tokenB)}
                        </RowDataTdText>
                      </TextColumnContainer>
                    </RowDataTd>
                    <RowDataTd>
                      <RowDataTdText theme={theme}>
                        {stripDigitPlaces(el.apy24h, 6)}%
                      </RowDataTdText>
                    </RowDataTd>
                    <RowDataTd>
                      <TextColumnContainer>
                        <RowDataTdTopText theme={theme}>
                          $
                          {formatNumberToUSFormat(
                            stripDigitPlaces(userLiquidityUSD, 2)
                          )}
                        </RowDataTdTopText>
                        <RowDataTdText
                          theme={theme}
                          color={theme.palette.grey.new}
                        >
                          {formatNumberToUSFormat(
                            stripDigitPlaces(userAmountTokenA, 8)
                          )}{' '}
                          {baseSymbol} /{' '}
                          {formatNumberToUSFormat(
                            stripDigitPlaces(userAmountTokenB, 8)
                          )}{' '}
                          {quoteSymbol}
                        </RowDataTdText>
                      </TextColumnContainer>
                    </RowDataTd>
                    <RowDataTd>
                      <TextColumnContainer>
                        <RowDataTdTopText theme={theme}>
                          $
                          {stripDigitPlaces(
                            getFeesEarnedByAccount.find(
                              (feesEarned) => feesEarned.pool === el.swapToken
                            )?.earnedUSD || 0,
                            3
                          )}
                        </RowDataTdTopText>
                      </TextColumnContainer>
                    </RowDataTd>
                    <RowTd>
                      <Row justify="flex-end" width={'100%'}>
                        <BorderButton
                          style={{ marginRight: '2rem' }}
                          onClick={() => {
                            if (wallet.connected) {
                              selectPool(el)
                              setIsWithdrawalPopupOpen(true)
                            } else {
                              wallet.connect()
                            }
                          }}
                        >
                          {wallet.connected
                            ? 'Withdraw liquidity + fees'
                            : 'Connect wallet'}
                        </BorderButton>
                        <BorderButton
                          onClick={() => {
                            if (wallet.connected) {
                              selectPool(el)
                              setIsAddLiquidityPopupOpen(true)
                            } else {
                              wallet.connect()
                            }
                          }}
                          borderColor={theme.palette.blue.serum}
                        >
                          {wallet.connected
                            ? 'Add Liquidity'
                            : 'Connect wallet'}
                        </BorderButton>
                      </Row>
                    </RowTd>
                  </TableRow>
                )
              })}
          </Table>
        </RowContainer>
      </BlockTemplate>
    </RowContainer>
  )
}

export default compose(
  queryRendererHoc({
    query: getPoolsInfo,
    name: 'getPoolsInfoQuery',
    fetchPolicy: 'cache-and-network',
    pollInterval: 60000,
  }),
  queryRendererHoc({
    query: getFeesEarnedByAccount,
    name: 'getFeesEarnedByAccountQuery',
    variables: (props) => ({
      account: props.wallet.publicKey.toString(),
    }),
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
  })
)(UserLiquitidyTable)
