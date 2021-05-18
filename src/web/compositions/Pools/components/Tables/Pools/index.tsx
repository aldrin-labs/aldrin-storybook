import React, { useState } from 'react'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'

import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import {
  TableHeader,
  TableRow,
  Table,
  BorderButton,
  RowTd,
  TextColumnContainer,
} from '@sb/compositions/Pools/components/Tables/index.styles'

import { BlockTemplate } from '../../../index.styles'

import { TokenIconsContainer, SearchInputWithLoop } from '../components/index'

import TooltipIcon from '@icons/TooltipImg.svg'

import { Text } from '@sb/compositions/Addressbook/index'
import SvgIcon from '@sb/components/SvgIcon'
import { getPoolsInfo } from '@core/graphql/queries/pools/getPoolsInfo'

const AllPoolsTable = ({
  theme,
  changeCreatePoolPopupState,
  getPoolsInfoQuery,
  changeLiquidityPopupState,
}: {
  theme: Theme
  changeCreatePoolPopupState: any
  getPoolsInfoQuery: any
  changeLiquidityPopupState: any
}) => {
  const [searchValue, onChangeSearch] = useState('')

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
          <Row justify={'space-between'} width={'42%'}>
            <SearchInputWithLoop placeholder={'Search'} />
            <BorderButton
              onClick={() => {
                changeCreatePoolPopupState(true)
              }}
              padding={'0 2.6rem'}
              borderColor={'#A5E898'}
            >
              Create Pool
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
                    width={'12px'}
                    height={'12px'}
                    style={{ marginRight: '1rem' }}
                    src={TooltipIcon}
                  />
                  APY (24h)
                </div>
              </RowTd>{' '}
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
                        ${el.tvl.USD}
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
                      ${el.totalFeesPaid.USD}
                    </Text>
                  </RowTd>{' '}
                  <RowTd>
                    <Text
                      theme={theme}
                      style={{ whiteSpace: 'nowrap', paddingBottom: '1rem' }}
                    >
                      {el.apy24h}%
                    </Text>
                  </RowTd>{' '}
                  <RowTd>
                    <Row justify={'flex-end'} width={'100%'}>
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
  })
)(AllPoolsTable)
