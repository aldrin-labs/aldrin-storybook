import React, { memo, PureComponent } from 'react'
import { withTheme } from '@material-ui/styles'

import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { Row, Head } from '@sb/components/OldTable/Table'
import OrderBookBody from './OrderBookBody/OrderBookBody'
import ChartCardHeader from '@sb/components/ChartCardHeader'

import { IProps } from './OrderBookTable.types'
import { AsksTable, StyledHeadCell } from './OrderBookTable.styles'

import { StyledTitle } from '../../../TradeHistoryTable/Table/TradeHistoryTable.styles'

const MemoHead = memo(() => (
  <>
    <ChartCardHeader>Orderbook</ChartCardHeader>
    <Head background={'#fff'} style={{ height: 'auto', border: 'none' }}>
      <Row style={{ height: 'auto' }}>
        <StyledHeadCell>
          <StyledTitle variant="body2" color="default" align="left">
            Price
            {/* {quote || 'Fiat'} */}
          </StyledTitle>
        </StyledHeadCell>

        <StyledHeadCell isCenter={true}>
          <StyledTitle variant="body2" color="default" align="left">
            Size
          </StyledTitle>
        </StyledHeadCell>

        <StyledHeadCell>
          <StyledTitle
            variant="body2"
            color="default"
            align="right"
            style={{ paddingRight: 0 }}
          >
            Total
          </StyledTitle>
        </StyledHeadCell>
      </Row>
    </Head>
  </>
))

@withTheme
class OrderBookTable extends PureComponent<IProps> {
  render() {
    const {
      onButtonClick,
      quote,
      theme: { palette },
    } = this.props

    const { background, action, type, primary } = palette

    return (
      <AsksTable>
        <MemoHead
          {...{
            palette,
            primary,
            type,
            onButtonClick,
            background,
            quote,
            key: 'asks_headrow',
          }}
        />
        {/* hack to autoscroll to bottom */}
        <OrderBookBody
          {...{
            background,
            action,
            ...this.props,
            key: 'asks_body',
          }}
        />
      </AsksTable>
    )
  }
}

export default withErrorFallback(OrderBookTable)
