import React from 'react'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import {
  BlockTemplate,
  LiquidityDataContainer,
} from '@sb/compositions/Pools/index.styles'

import { Text } from '@sb/compositions/Addressbook/index'

export const UserLiquitidyTable = ({ theme }: { theme: Theme }) => {
  return (
    <RowContainer>
      <BlockTemplate
        width={'100%'}
        height={'45rem'}
        padding="3rem"
        style={{ marginTop: '2rem' }}
        align={'start'}
        theme={theme}
      >
        <RowContainer justify={'space-between'} align="flex-start">
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
      </BlockTemplate>
    </RowContainer>
  )
}
