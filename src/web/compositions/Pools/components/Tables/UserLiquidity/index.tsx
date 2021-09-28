import React from 'react'
import { compose } from 'recompose'

import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import {
  TableRow,
  Table,
} from '@sb/compositions/Pools/components/Tables/index.styles'

import { TokenIconsContainer } from '../components/index'

import TooltipIcon from '@icons/TooltipImg.svg'

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

import UserLiquidityTableComponent from './UserLiquidityTable'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { calculateWithdrawAmount } from '@sb/dexUtils/pools'
import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'
import { WalletAdapter } from '@sb/dexUtils/types'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { getUserPoolsFromAll } from '@sb/compositions/Pools/utils/getUserPoolsFromAll'

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
  const usersPools = getUserPoolsFromAll({ poolsInfo, allTokensData })

  const { getFeesEarnedByAccount = [] } = getFeesEarnedByAccountQuery || {
    getFeesEarnedByAccountQuery: [],
  }
  // console.log('poolsInfo', poolsInfo)

  return (
    <RowContainer>
      <RowContainer>
        <Table>
          <TableRow>
            {/* <RowTd>
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
                  </RowTd> */}
            <UserLiquidityTableComponent
              usersPools={usersPools}
              dexTokensPricesMap={dexTokensPricesMap}
              allTokensData={allTokensData}
              theme={theme}
            />
          </TableRow>
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
