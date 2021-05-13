import React from 'react'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import {
  BlockTemplate,
  LiquidityDataContainer,
  TableHeader,
  TableRow,
  Table,
  BorderButton,
  RowTd,
  TextColumnContainer,
  TokenIconsContainer,
} from '@sb/compositions/Pools/index.styles'

import TooltipIcon from '@icons/TooltipImg.svg'

import { Text } from '@sb/compositions/Addressbook/index'
import SvgIcon from '@sb/components/SvgIcon'

export const AllPoolsTable = ({ theme }: { theme: Theme }) => {
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
          <Row width={'33%'}></Row>
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
                  APY (30d)
                </div>
              </RowTd>{' '}
              <RowTd></RowTd>
            </TableHeader>
            <TableRow>
              <RowTd>
                <TokenIconsContainer />
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
                <Text
                  theme={theme}
                  style={{ whiteSpace: 'nowrap', paddingBottom: '1rem' }}
                >
                  $14,252{' '}
                </Text>
              </RowTd>{' '}
              <RowTd>
                <Text
                  theme={theme}
                  style={{ whiteSpace: 'nowrap', paddingBottom: '1rem' }}
                >
                  24%
                </Text>
              </RowTd>{' '}
              <RowTd>
                <Row justify={'flex-end'} width={'100%'}>
                  <BorderButton borderColor={'#366CE5'}>
                    Add Liquidity
                  </BorderButton>
                </Row>
              </RowTd>
            </TableRow>
            <TableRow>
              <RowTd>
                <TokenIconsContainer />
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
                <Text
                  theme={theme}
                  style={{ whiteSpace: 'nowrap', paddingBottom: '1rem' }}
                >
                  $14,252{' '}
                </Text>
              </RowTd>{' '}
              <RowTd>
                <Text
                  theme={theme}
                  style={{ whiteSpace: 'nowrap', paddingBottom: '1rem' }}
                >
                  24%
                </Text>
              </RowTd>{' '}
              <RowTd>
                <Row justify={'flex-end'} width={'100%'}>
                  <BorderButton borderColor={'#366CE5'}>
                    Add Liquidity
                  </BorderButton>
                </Row>
              </RowTd>
            </TableRow>
            <TableRow>
              <RowTd>
                <TokenIconsContainer />
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
                <Text
                  theme={theme}
                  style={{ whiteSpace: 'nowrap', paddingBottom: '1rem' }}
                >
                  $14,252{' '}
                </Text>
              </RowTd>{' '}
              <RowTd>
                <Text
                  theme={theme}
                  style={{ whiteSpace: 'nowrap', paddingBottom: '1rem' }}
                >
                  24%
                </Text>
              </RowTd>{' '}
              <RowTd>
                <Row justify={'flex-end'} width={'100%'}>
                  <BorderButton borderColor={'#366CE5'}>
                    Add Liquidity
                  </BorderButton>
                </Row>
              </RowTd>
            </TableRow>
          </Table>
        </RowContainer>
      </BlockTemplate>
    </RowContainer>
  )
}
