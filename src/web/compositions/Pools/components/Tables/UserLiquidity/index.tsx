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
  PoolsPrices,
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

const UserLiquitidyTable = ({
  theme,
  wallet,
  allTokensData,
  getPoolsInfoQuery: { getPoolsInfo },
  poolsPrices,
  getFeesEarnedByAccountQuery,
  selectPool,
  setIsWithdrawalPopupOpen,
  setIsAddLiquidityPopupOpen,
}: {
  theme: Theme
  wallet: WalletAdapter
  allTokensData: TokenInfo[]
  getPoolsInfoQuery: { getPoolsInfo: PoolInfo[] }
  poolsPrices: PoolsPrices[]
  getFeesEarnedByAccountQuery: { getFeesEarnedByAccount: FeesEarned[] }
  selectPool: (pool: PoolInfo) => void
  setIsWithdrawalPopupOpen: (value: boolean) => void
  setIsAddLiquidityPopupOpen: (value: boolean) => void
}) => {
  const userTokens = allTokensData.map((el) => el.mint)

  const usersPools = getPoolsInfo.filter((el) =>
    userTokens.includes(el.poolTokenMint)
  )

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
                    getTotalUserLiquidity({ usersPools, poolsPrices }),
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
                {getFeesEarnedByAccountQuery.getFeesEarnedByAccount.map(
                  (el: FeesEarned) => {
                    return el.earnedUSD
                  }
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
                  <SvgIcon
                    width={'1.2rem'}
                    height={'1.2rem'}
                    style={{ marginRight: '1rem' }}
                    src={TooltipIcon}
                  />
                  APY (24h)
                </div>
              </RowTd>
              <RowTd>Your Liquidity (Including Fees)</RowTd>
              <RowTd>Total Fees Earned</RowTd>
              <RowTd></RowTd>
            </TableHeader>
            {usersPools.map((el: PoolInfo) => {
              const baseSymbol = getTokenNameByMintAddress(el.tokenA)
              const quoteSymbol = getTokenNameByMintAddress(el.tokenB)

              const baseTokenPrice =
                poolsPrices.find((tokenInfo) => tokenInfo.symbol === baseSymbol)
                  ?.price || 10

              const quoteTokenPrice =
                poolsPrices.find(
                  (tokenInfo) => tokenInfo.symbol === quoteSymbol
                )?.price || 10

              const tvlUSD =
                baseTokenPrice * el.tvl.tokenA + quoteTokenPrice * el.tvl.tokenB

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
                    <RowDataTdText theme={theme}>{el.apy24h}%</RowDataTdText>
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
                      <RowDataTdTopText theme={theme}>$68.24m</RowDataTdTopText>
                      <RowDataTdText
                        theme={theme}
                        color={theme.palette.grey.new}
                      >
                        2000 SOL / 200 CCAI
                      </RowDataTdText>
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
      </BlockTemplate>
    </RowContainer>
  )
}

export default compose(
  queryRendererHoc({
    query: getPoolsInfo,
    name: 'getPoolsInfoQuery',
    fetchPolicy: 'cache-and-network',
  }),
  queryRendererHoc({
    query: getFeesEarnedByAccount,
    name: 'getFeesEarnedByAccountQuery',
    variables: (props) => ({
      account: props.wallet.publicKey.toString(),
    }),
    fetchPolicy: 'cache-and-network',
  })
)(UserLiquitidyTable)
