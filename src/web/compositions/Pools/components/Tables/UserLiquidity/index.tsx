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
  poolsInfo,
  dexTokensPricesMap,
  getFeesEarnedByAccountQuery,
  selectPool,
  setIsWithdrawalPopupOpen,
  setIsAddLiquidityPopupOpen,
}: {
  theme: Theme
  wallet: WalletAdapter
  allTokensData: TokenInfo[]
  poolsInfo: PoolInfo[]
  dexTokensPricesMap: Map<string, DexTokensPrices>
  getFeesEarnedByAccountQuery: { getFeesEarnedByAccount: FeesEarned[] }
  selectPool: (pool: PoolInfo) => void
  setIsWithdrawalPopupOpen: (value: boolean) => void
  setIsAddLiquidityPopupOpen: (value: boolean) => void
}) => {
  const allTokensDataMap = allTokensData.reduce(
    (acc, tokenData) => acc.set(tokenData.mint, tokenData),
    new Map()
  )

  const usersPools = poolsInfo.filter(
    (el) =>
      allTokensDataMap.has(el.poolTokenMint) &&
      allTokensDataMap.get(el.poolTokenMint).amount > 0
  )

  const { getFeesEarnedByAccount = [] } = getFeesEarnedByAccountQuery || {
    getFeesEarnedByAccountQuery: [],
  }
  // console.log('poolsInfo', poolsInfo)

  return (
    <RowContainer>
      <RowContainer>
        <Table>
          <TableHeader>
            <RowTd>Pool</RowTd>
            <RowTd>TVL</RowTd>
            <RowTd>
              <DarkTooltip
                title={
                  'Annualized, non-compounded return on investment based on the fees earned in the last 24 hours, relative to the size of the pool.'
                }
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <SvgIcon
                    width={'1.2rem'}
                    height={'1.2rem'}
                    style={{ marginRight: '1rem' }}
                    src={TooltipIcon}
                  />
                  APY (24h)
                </div>
              </DarkTooltip>
            </RowTd>
            <RowTd>Your Liquidity (Including Fees)</RowTd>
            <RowTd>Total Fees Earned</RowTd>
            <RowTd></RowTd>
          </TableHeader>
          {usersPools
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

              const baseTokenPrice =
                dexTokensPricesMap.get(baseSymbol)?.price || 10

              const quoteTokenPrice =
                dexTokensPricesMap.get(quoteSymbol)?.price || 10

              const tvlUSD =
                baseTokenPrice * el.tvl.tokenA + quoteTokenPrice * el.tvl.tokenB

              const {
                amount: poolTokenRawAmount,
                decimals: poolTokenDecimals,
              } = allTokensDataMap.get(el.poolTokenMint) || {
                amount: 0,
                decimals: 0,
              }

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
                        {wallet.connected ? 'Add Liquidity' : 'Connect wallet'}
                      </BorderButton>
                    </Row>
                  </RowTd>
                </TableRow>
              )
            })}
        </Table>
      </RowContainer>
    </RowContainer>
  )
}

export default compose(
  queryRendererHoc({
    query: getFeesEarnedByAccount,
    name: 'getFeesEarnedByAccountQuery',
    variables: (props) => ({
      account: props.wallet.publicKey?.toString() || '',
    }),
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
  })
)(UserLiquitidyTable)
