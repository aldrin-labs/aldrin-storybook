import React from 'react'
import { Theme } from '@material-ui/core'

import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { Text } from '@sb/compositions/Addressbook/index'

export const PopupFooter = ({
  totalFeesUSD,
  theme,
}: {
  totalFeesUSD: number
  theme: Theme
}) => (
  <RowContainer justify={'space-between'}>
    <Text
      theme={theme}
      color={theme.palette.grey.new}
      style={{
        whiteSpace: 'nowrap',
        fontSize: '1.6rem',
      }}
    >
      Est. Fees Amount
    </Text>
    <Row>
      <Text
        theme={theme}
        fontFamily={'Avenir Next Demi'}
        style={{
          whiteSpace: 'nowrap',
          fontSize: '1.9rem',
        }}
      >
        $
      </Text>

      <Text
        theme={theme}
        color={'#A5E898'}
        fontFamily={'Avenir Next Demi'}
        style={{
          whiteSpace: 'nowrap',
          fontSize: '1.9rem',
        }}
      >
        {totalFeesUSD.toFixed(2)}
      </Text>
    </Row>
  </RowContainer>
)
