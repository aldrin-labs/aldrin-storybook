import React, { useState } from 'react'
import { compose } from 'recompose'

import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import {
  TableHeader,
  TableRow,
  Table,
  BorderButton,
  RowTd,
  TextColumnContainer,
  RowDataTdTopText,
  RowDataTdText,
  RowDataTd,
} from '@sb/compositions/Pools/components/Tables/index.styles'

import { BlockTemplate } from '../../../index.styles'

import { TokenIconsContainer, SearchInputWithLoop } from '../components/index'

import TooltipIcon from '@icons/TooltipImg.svg'

import { Text } from '@sb/compositions/Addressbook/index'
import SvgIcon from '@sb/components/SvgIcon'
import { getPoolsInfo } from '@core/graphql/queries/pools/getPoolsInfo'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { useWallet } from '@sb/dexUtils/wallet'
import { Theme } from '@material-ui/core'
import {
  FeesEarned,
  PoolInfo,
  DexTokensPrices,
} from '@sb/compositions/Pools/index.types'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { filterDataBySymbolForDifferentDeviders } from '@sb/compositions/Chart/Inputs/SelectWrapper/SelectWrapper.utils'
import { getFeesEarnedByPool } from '@core/graphql/queries/pools/getFeesEarnedByPool'
import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'

const AllPoolsTable = ({
  theme,
  dexTokensPrices,
  getPoolsInfoQuery,
  getFeesEarnedByPoolQuery,
  selectPool,
  setIsCreatePoolPopupOpen,
  setIsAddLiquidityPopupOpen,
}: {
  theme: Theme
  dexTokensPrices: DexTokensPrices[]
  getPoolsInfoQuery: { getPoolsInfo: PoolInfo[] }
  getFeesEarnedByPoolQuery: { getFeesEarnedByPool: FeesEarned[] }
  selectPool: (pool: PoolInfo) => void
  setIsCreatePoolPopupOpen: (value: boolean) => void
  setIsAddLiquidityPopupOpen: (value: boolean) => void
}) => {
  const { wallet } = useWallet()
  const [searchValue, onChangeSearch] = useState('')

  const { getFeesEarnedByPool = [] } = getFeesEarnedByPoolQuery || {
    getFeesEarnedByPool: [],
  }

  const filteredData = getPoolsInfoQuery.getPoolsInfo.filter((el) =>
    filterDataBySymbolForDifferentDeviders({
      searchValue,
      symbol: el.parsedName,
    })
  )

  const feesPerPoolMap = new Map()

  getFeesEarnedByPool.forEach((feeEarnedByPool) => {
    feesPerPoolMap.set(feeEarnedByPool.pool, feeEarnedByPool.earnedUSD)
  })

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
          <Text theme={theme}>All Pools</Text>
          <Row
            style={{ flexWrap: 'nowrap' }}
            justify={'space-between'}
            width={'34%'}
          >
            <SearchInputWithLoop
              searchValue={searchValue}
              onChangeSearch={onChangeSearch}
              placeholder={'Search...'}
            />
            <BorderButton
              onClick={() => {
                if (wallet.connected) {
                  setIsCreatePoolPopupOpen(true)
                } else {
                  wallet.connect()
                }
              }}
              style={{ marginLeft: '2rem', whiteSpace: 'nowrap' }}
              padding={wallet.connected ? '0 2.6rem' : '0 2rem'}
              borderColor={'#A5E898'}
            >
              {wallet.connected ? 'Create pool' : 'Connect wallet'}
            </BorderButton>
          </Row>
        </RowContainer>
        <RowContainer>
          <Table>
            <TableHeader>
              <RowTd>Pool</RowTd>
              <RowTd>TVL</RowTd>
              <RowTd>Total Fees Paid</RowTd>
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
              <RowTd></RowTd>
            </TableHeader>
            {filteredData
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
              .map((el) => {
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

                const fees = feesPerPoolMap.get(el.swapToken) || 0
                const apy = el.apy24h || 0

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
                        ${stripDigitPlaces(fees, 6)}
                      </RowDataTdText>
                    </RowDataTd>
                    <RowDataTd>
                      <RowDataTdText theme={theme}>
                        {stripDigitPlaces(apy, 6)}%
                      </RowDataTdText>
                    </RowDataTd>
                    <RowTd>
                      <Row justify={'flex-end'} width={'100%'}>
                        <BorderButton
                          onClick={() => {
                            if (wallet.connected) {
                              selectPool(el)
                              setIsAddLiquidityPopupOpen(true)
                            } else {
                              wallet.connect()
                            }
                          }}
                          borderColor={'#366CE5'}
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
    name: 'getPoolsInfoQuery',
    query: getPoolsInfo,
    fetchPolicy: 'cache-and-network',
    pollInterval: 60000,
  }),
  queryRendererHoc({
    name: 'getFeesEarnedByPoolQuery',
    query: getFeesEarnedByPool,
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
    pollInterval: 60000,
  })
)(AllPoolsTable)
