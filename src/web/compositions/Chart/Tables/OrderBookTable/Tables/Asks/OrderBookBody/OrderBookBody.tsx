import React, { PureComponent, memo } from 'react'
import { Body } from '@sb/components/OldTable/Table'
import { ScrollToBottom } from '@core/utils/chartPageUtils'
import { IProps } from './OrderBookBody.types'
import { TypographyFullWidth } from '@sb/styles/cssUtils'
import {
  StyledCell,
  StyledRow,
} from '../../../../TradeHistoryTable/Table/TradeHistoryTable.styles'

let objDiv: HTMLElement | null

const OptimizedRow = memo(
  ({ order, digits }) => {
    const [price, values] = order
    const [size, total] = values

    return <StyledRow background={'transparent'}>
      <StyledCell style={{ minWidth: '30%' }}>
        <TypographyFullWidth textColor={'#DD6956'} variant="body1" align="left">
          {
            Number(price).toFixed(digits)
            // .toFixed(digitsAfterDecimalForAsksPrice)
          }
        </TypographyFullWidth>
      </StyledCell>

      <StyledCell style={{ minWidth: '30%' }}>
        <TypographyFullWidth textColor={'#16253D;'} variant="body2" align="left">
          {
            size
            // .toFixed(digitsAfterDecimalForAsksSize)
          }
        </TypographyFullWidth>
      </StyledCell>

      <StyledCell style={{ minWidth: '40%' }}>
        <TypographyFullWidth
          textColor={'#16253D;'}
          variant="body1"
          align="left"
        >
          {Number(price * size).toFixed(digits)
            // .toFixed(digitsAfterDecimalForAsksPrice)
          }
        </TypographyFullWidth>
      </StyledCell>
    </StyledRow>
  },
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
    const { data, digits } = this.props

    return (
      <Body id="body" height={'calc(100% - 44px)'}>
        {[...data.entries()].map(
          (
            order,
            i: number
          ) => {
            const [price, values] = order
            const [size, total] = values

            return <OptimizedRow
              key={`${price}${size}${total}`}
              {...{
                digits,
                order,
                data,
              }}
            />
          }
        )}
      </Body>
    )
  }
}

export default ClassBody
