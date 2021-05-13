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

export const UserLiquitidyTable = ({ theme }: { theme: Theme }) => {
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
                $32,874
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
                  24%
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
                  <BorderButton style={{ marginRight: '2rem' }}>
                    Withdraw liquidity + fees
                  </BorderButton>
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
                  24%
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
                  <BorderButton style={{ marginRight: '2rem' }}>
                    Withdraw liquidity + fees
                  </BorderButton>
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
                  24%
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
                  <BorderButton style={{ marginRight: '2rem' }}>
                    Withdraw liquidity + fees
                  </BorderButton>
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
