import React from 'react'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'

import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import {
  LiquidityDataContainer,
  TableHeader,
  TableRow,
  Table,
  BorderButton,
  RowTd,
  TextColumnContainer,
} from '@sb/compositions/Pools/components/Tables/index.styles'

import { BlockTemplate } from '../../../index.styles'

import { TokenIconsContainer } from '../components/index'

import TooltipIcon from '@icons/TooltipImg.svg'

import { Text } from '@sb/compositions/Addressbook/index'
import SvgIcon from '@sb/components/SvgIcon'
import { getPoolsInfo } from '@core/graphql/queries/pools/getPoolsInfo'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getFeesEarnedByAccount } from '@core/graphql/queries/pools/getFeesEarnedByAccount'

const UserLiquitidyTable = ({
  theme,
  changeLiquidityPopupState,
  changeWithdrawalPopupState,
  getPoolsInfoQuery,
  getFeesEarnedByAccountQuery,
}: {
  theme: Theme
  changeLiquidityPopupState: any
  changeWithdrawalPopupState: any
  getPoolsInfoQuery: any
  getFeesEarnedByAccountQuery: any
}) => {
  console.log(
    'getFeesEarnedByAccountQuery',
    getFeesEarnedByAccountQuery.getFeesEarnedByAccount
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
              <Text
                theme={theme}
                color={theme.palette.grey.new}
                style={{ whiteSpace: 'nowrap' }}
              >
                Liquidity (Including Fees)
              </Text>
              <Text
                theme={theme}
                color={theme.palette.green.new}
                fontFamily={'Avenir Next Demi'}
              >
                $32,874
              </Text>
            </LiquidityDataContainer>
            <LiquidityDataContainer style={{ paddingLeft: '3rem' }}>
              <Text
                theme={theme}
                color={theme.palette.grey.new}
                style={{ whiteSpace: 'nowrap' }}
              >
                Fees Earned (Cumulative)
              </Text>
              <Text
                theme={theme}
                color={theme.palette.green.new}
                fontFamily={'Avenir Next Demi'}
              >
                $
                {getFeesEarnedByAccountQuery.getFeesEarnedByAccount.map(
                  (el) => {
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
                    width={'12px'}
                    height={'12px'}
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
            {getPoolsInfoQuery.getPoolsInfo.map((el) => {
              return (
                <TableRow>
                  <RowTd>
                    <TokenIconsContainer
                      tokenA={el.tokenA}
                      tokenB={el.tokenB}
                    />
                  </RowTd>
                  <RowTd>
                    <TextColumnContainer>
                      <Text
                        theme={theme}
                        style={{ whiteSpace: 'nowrap', paddingBottom: '1rem' }}
                      >
                        {el.tvl.USD}
                      </Text>
                      <Text
                        theme={theme}
                        color={theme.palette.grey.new}
                        style={{ whiteSpace: 'nowrap', paddingBottom: '1rem' }}
                      >
                        {el.tvl.tokenA} {el.tokenA} / {el.tvl.tokenB}{' '}
                        {el.tokenB}
                      </Text>
                    </TextColumnContainer>
                  </RowTd>
                  <RowTd>
                    <Text
                      theme={theme}
                      style={{ whiteSpace: 'nowrap', paddingBottom: '1rem' }}
                    >
                      {el.apy24h}%
                    </Text>
                  </RowTd>
                  <RowTd>
                    <TextColumnContainer>
                      <Text
                        theme={theme}
                        style={{ whiteSpace: 'nowrap', paddingBottom: '1rem' }}
                      >
                        $68.24m
                      </Text>
                      <Text
                        theme={theme}
                        color={theme.palette.grey.new}
                        style={{ whiteSpace: 'nowrap', paddingBottom: '1rem' }}
                      >
                        2000 SOL / 200 CCAI
                      </Text>
                    </TextColumnContainer>
                  </RowTd>
                  <RowTd>
                    <TextColumnContainer>
                      <Text
                        theme={theme}
                        style={{ whiteSpace: 'nowrap', paddingBottom: '1rem' }}
                      >
                        $68.24m
                      </Text>
                      <Text
                        theme={theme}
                        color={theme.palette.grey.new}
                        style={{ whiteSpace: 'nowrap', paddingBottom: '1rem' }}
                      >
                        2000 SOL / 200 CCAI
                      </Text>
                    </TextColumnContainer>
                  </RowTd>
                  <RowTd>
                    <Row justify="flex-end" width={'100%'}>
                      <BorderButton
                        style={{ marginRight: '2rem' }}
                        onClick={() => changeWithdrawalPopupState(true)}
                      >
                        Withdraw liquidity + fees
                      </BorderButton>
                      <BorderButton
                        onClick={() => changeLiquidityPopupState(true)}
                        borderColor={'#366CE5'}
                      >
                        Add Liquidity
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
  graphql(getPoolsInfo, {
    name: 'getPoolsInfoQuery',
  }),
  queryRendererHoc({
    query: getFeesEarnedByAccount,
    name: 'getFeesEarnedByAccountQuery',
    variables: {
      pools: '',
      accountPublicKey: '',
    },
    fetchPolicy: 'only-network',
  })
)(UserLiquitidyTable)
