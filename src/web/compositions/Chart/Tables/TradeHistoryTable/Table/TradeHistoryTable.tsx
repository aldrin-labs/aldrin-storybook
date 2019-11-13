import React, { memo, PureComponent } from 'react'
import { withTheme } from '@material-ui/styles'

import { Row, Body, Head } from '@sb/components/OldTable/Table'
import { IProps, IState, ITicker } from './TradeHistoryTable.types'
import { TypographyFullWidth } from '@sb/styles/cssUtils'
import ChartCardHeader from '@sb/components/ChartCardHeader'

import {
  StyledTypography,
  StyledTitle,
  TradeHistoryTableCollapsible,
  StyledCell,
  StyledRow,
} from './TradeHistoryTable.styles'

import { StyledHeadCell } from '../../OrderBookTable/Tables/Asks/OrderBookTable.styles'

const OptimizedRow = memo(
  ({ ticker, numbersAfterDecimalForPrice }) => {
    return (
      <StyledRow background={'#fff'}>
        <StyledCell style={{ minWidth: '30%' }}>
          <StyledTypography
            textColor={ticker.fall ? '#DD6956' : '#29AC80'}
            variant="caption"
            align="left"
          >
            {(+ticker.price).toFixed(2)
              // .toFixed(numbersAfterDecimalForPrice)
            }
          </StyledTypography>
        </StyledCell>

        <StyledCell style={{ minWidth: '30%' }}>
          <TypographyFullWidth
            variant="caption"
            textColor={'#16253D'}
            align="left"
          >
            {(+ticker.size).toFixed(4)}
          </TypographyFullWidth>
        </StyledCell>

        <StyledCell style={{ minWidth: '40%' }}>
          <TypographyFullWidth
            // style={{ paddingRight: 0 }}
            textColor={'#16253D'}
            variant="caption"
            align="left"
          >
            {ticker.time}
          </TypographyFullWidth>
        </StyledCell>
      </StyledRow>
    )
  },
  (prevProps, nextProps) =>
    nextProps.ticker.id === prevProps.ticker.id &&
    nextProps.background === prevProps.background
)

const MemoizedHead = memo(() => (
  <>
    <ChartCardHeader>Trade history</ChartCardHeader>
    <Head background={'#fff'} style={{ height: 'auto', border: 'none' }}>
      <Row
        background={'#fff'}
        style={{
          height: 'auto',
          padding: '0',
        }}
      >
        <StyledHeadCell style={{ minWidth: '30%' }}>
          <StyledTitle variant="body2" align="left">
            Price
          </StyledTitle>
        </StyledHeadCell>

        <StyledHeadCell style={{ minWidth: '30%' }}>
          <StyledTitle variant="body2" align="left">
            Size
          </StyledTitle>
        </StyledHeadCell>

        <StyledHeadCell style={{ minWidth: '40%' }}>
          <StyledTitle
            variant="body2"
            align="left"
            style={{ paddingRight: 0 }}
          >
            Time
          </StyledTitle>
        </StyledHeadCell>
      </Row>
    </Head>
  </>
))

@withTheme
class TradeHistoryTable extends PureComponent<IProps, IState> {
  render() {
    const {
      numbersAfterDecimalForPrice,
      quote,
      data,
      theme: { palette, customPalette },
    } = this.props
    const { background, primary, type } = palette
    const { red, green } = customPalette

    return (
      <TradeHistoryTableCollapsible key={`trade_history_table-collapsible`}>
        <MemoizedHead
          {...{
            primary,
            type,
            palette,
            quote,
            key: 'tradehistory_head',
          }}
        />
        <Body
          data-e2e="tradeHistory__body"
          background={'#fff'}
          height="45vh"
        >
          {data.map((ticker: ITicker, i: number) => (
            <OptimizedRow
              key={`${ticker.time}${ticker.id}${ticker.price}${ticker.size}${
                ticker.fall
                }`}
              {...{
                ticker,
                background,
                numbersAfterDecimalForPrice,
                red,
                green,
              }}
            />
          ))}
        </Body>
      </TradeHistoryTableCollapsible>
    )
  }
}

export default TradeHistoryTable
