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
import { PoolInfo, PoolsPrices } from '@sb/compositions/Pools/index.types'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { filterDataBySymbolForDifferentDeviders } from '@sb/compositions/Chart/Inputs/SelectWrapper/SelectWrapper.utils'

const AllPoolsTable = ({
  theme,
  poolsPrices,
  getPoolsInfoQuery,
  selectPool,
  setIsCreatePoolPopupOpen,
  setIsAddLiquidityPopupOpen,
}: {
  theme: Theme
  poolsPrices: PoolsPrices[]
  getPoolsInfoQuery: { getPoolsInfo: PoolInfo[] }
  selectPool: (pool: PoolInfo) => void
  setIsCreatePoolPopupOpen: (value: boolean) => void
  setIsAddLiquidityPopupOpen: (value: boolean) => void
}) => {
  const [searchValue, onChangeSearch] = useState('')

  const { wallet } = useWallet()

  const filteredData = getPoolsInfoQuery.getPoolsInfo.filter((el) =>
    filterDataBySymbolForDifferentDeviders({ searchValue, symbol: el.name })
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
              <RowTd></RowTd>
            </TableHeader>
            {filteredData.map((el) => {
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
                        ${el.tvl.USD}
                      </RowDataTdTopText>
                      <RowDataTdText
                        theme={theme}
                        color={theme.palette.grey.new}
                      >
                        {el.tvl.tokenA} {getTokenNameByMintAddress(el.tokenA)} /{' '}
                        {el.tvl.tokenB} {getTokenNameByMintAddress(el.tokenB)}
                      </RowDataTdText>
                    </TextColumnContainer>
                  </RowDataTd>
                  <RowDataTd>
                    <RowDataTdText theme={theme}>
                      ${el.totalFeesPaid.USD}
                    </RowDataTdText>
                  </RowDataTd>
                  <RowDataTd>
                    <RowDataTdText theme={theme}>{el.apy24h}%</RowDataTdText>
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
    name: 'getPoolsInfoQuery',
    query: getPoolsInfo,
    fetchPolicy: 'cache-and-network',
  })
)(AllPoolsTable)
