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
import { useWallet } from '@sb/dexUtils/wallet'
import { PoolInfo, FeesEarned } from '@sb/compositions/Pools/index.types'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'

const UserLiquitidyTable = ({
  theme,
  selectPool,
  setIsWithdrawalPopupOpen,
  setIsAddLiquidityPopupOpen,
  getPoolsInfoQuery,
  getFeesEarnedByAccountQuery,
}: {
  theme: Theme
  selectPool: (pool: PoolInfo) => void
  setIsWithdrawalPopupOpen: (value: boolean) => void
  setIsAddLiquidityPopupOpen: (value: boolean) => void
  getPoolsInfoQuery: { getPoolsInfo: PoolInfo[] }
  getFeesEarnedByAccountQuery: { getFeesEarnedByAccount: FeesEarned[] }
}) => {
  const { wallet } = useWallet()

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
                $32,874
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
            {getPoolsInfoQuery.getPoolsInfo.map((el: PoolInfo) => {
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
                    <RowDataTdText theme={theme}>{el.apy24h}%</RowDataTdText>
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
    variables: {
      pools: [''],
      account: '',
    },
    fetchPolicy: 'cache-and-network',
  })
)(UserLiquitidyTable)
