import React, { PureComponent, Component, memo } from 'react'

import { CSS_CONFIG } from '@sb/config/cssConfig'
import { Row, Cell, Body } from '@sb/components/OldTable/Table'
import {
  calculatePercentagesOfOrderSize,
  ScrollToBottom,
} from '@core/utils/chartPageUtils'
import { IProps } from './OrderBookBody.types'

import { hexToRgbAWithOpacity } from '@sb/styles/helpers'
import { TypographyFullWidth } from '@sb/styles/cssUtils'

import { StyledCell } from '../../../../TradeHistoryTable/Table/TradeHistoryTable.styles'

let objDiv: HTMLElement | null

const OptimizedRow = memo(
  ({ order, data }) => (
    <Row background={'transparent'}>
      <StyledCell style={{ minWidth: '30%' }}>
        <TypographyFullWidth textColor={'#b93b2b'} variant="body1" align="left">
          {
            order.price
            // .toFixed(digitsAfterDecimalForAsksPrice)
          }
        </TypographyFullWidth>
      </StyledCell>

      <StyledCell style={{ minWidth: '30%' }}>
        <TypographyFullWidth textColor={'#7284A0'} variant="body2" align="left">
          {
            order.size
            // .toFixed(digitsAfterDecimalForAsksSize)
          }
        </TypographyFullWidth>
      </StyledCell>

      <StyledCell style={{ minWidth: '40%' }}>
        <TypographyFullWidth
          textColor={'#7284A0'}
          variant="body1"
          align="right"
          style={{ paddingRight: 0 }}
        >
          {order.total.toFixed(0)
          // .toFixed(digitsAfterDecimalForAsksPrice)
          }
        </TypographyFullWidth>
      </StyledCell>
    </Row>
  ),
  (prevProps, nextProps) => nextProps.order.price === prevProps.order.price
)

class ClassBody extends PureComponent<IProps> {
  componentDidMount() {
    objDiv = document.getElementById('body')
    ScrollToBottom(objDiv)
  }

  componentDidUpdate() {
    if (
      objDiv &&
      objDiv.scrollHeight - objDiv.scrollTop - objDiv.clientHeight < 45
    ) {
      ScrollToBottom(objDiv)
    }
  }

  render() {
    const { data } = this.props

    return (
      <Body id="body" height={'calc(100% - 44px)'}>
        {data.map(
          (
            order: {
              size: number | string
              price: number | string
              total: number | string
            },
            i: number
          ) => (
            <OptimizedRow
              key={`${order.price}${order.size}${order.total}`}
              {...{
                order,
                data,
              }}
            />
          )
        )}
      </Body>
    )
  }
}

export default ClassBody
