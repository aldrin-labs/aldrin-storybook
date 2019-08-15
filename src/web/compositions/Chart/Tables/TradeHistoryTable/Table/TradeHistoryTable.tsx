import React, { memo, PureComponent } from 'react'
import { withTheme } from '@material-ui/styles'

import { Row, Body, Head, HeadCell, Cell } from '@sb/components/OldTable/Table'
import { IProps, IState, ITicker } from './TradeHistoryTable.types'
import { TypographyFullWidth } from '@sb/styles/cssUtils'

import {
  StyledTypography,
  StyledArrow,
  StyledTitle,
  TradeHistoryTableCollapsible,
  TriggerTitle,
  CardTitle,
  StyledCell,
} from './TradeHistoryTable.styles'

const OptimizedRow = memo(
  ({ ticker, background, numbersAfterDecimalForPrice, red, green }) => {
    return (
      <Row background={'#fff'} style={{ justifyContent: 'space-between' }}>
        <StyledCell>
          {/* <StyledArrow
          fontSize="small"
          color={ticker.fall ? red.main : green.main}
          direction={ticker.fall ? 'down' : 'up'}
        /> */}
          <StyledTypography
            textColor={ticker.fall ? '#b93b2b' : '#2F7619'}
            variant="caption"
            align="right"
          >
            {(+ticker.price).toFixed(numbersAfterDecimalForPrice)}
          </StyledTypography>
        </StyledCell>

        <StyledCell>
          <TypographyFullWidth variant="caption" align="right">
            {(+ticker.size).toFixed(4)}
          </TypographyFullWidth>
        </StyledCell>

        <StyledCell>
          <TypographyFullWidth
            color="textSecondary"
            variant="caption"
            align="right"
          >
            {ticker.time}
          </TypographyFullWidth>
        </StyledCell>
      </Row>
    )
  },
  (prevProps, nextProps) =>
    nextProps.ticker.id === prevProps.ticker.id &&
    nextProps.background === prevProps.background
)

const MemoizedHead = memo(
  ({ primary, type, palette, quote }) => (
    <>
      <TriggerTitle
        data-e2e="tradeHistory__arrowButton"
        background={primary[type]}
      >
        <CardTitle
          textColor={palette.getContrastText(primary[type])}
          variant="subtitle2"
          align="center"
        >
          Trade history
        </CardTitle>
      </TriggerTitle>
      <Head background={'#fff'} style={{ height: 'auto', border: 'none' }}>
        <Row
          background={'#fff'}
          isHead={true}
          style={{
            height: 'auto',
            padding: '0',
            justifyContent: 'space-between',
          }}
        >
          <HeadCell style={{ padding: '0 0.32rem', width: 'auto' }}>
            <StyledTitle noWrap={true} variant="body2" align="left">
              Price
              {/* {quote || 'Fiat'} */}
            </StyledTitle>
          </HeadCell>

          <HeadCell style={{ padding: '0 ', width: 'auto' }}>
            <StyledTitle variant="body2" align="left" noWrap={true}>
              Size
            </StyledTitle>
          </HeadCell>

          <HeadCell
            style={{
              lineHeight: '32px',
              padding: '0 0.32rem',
              width: 'auto',
            }}
          >
            <StyledTitle variant="body2" style={{ textAlign: 'right' }}>
              Time
            </StyledTitle>
          </HeadCell>
        </Row>
      </Head>
    </>
  ),
  (prevProps, nextProps) =>
    nextProps.type === prevProps.type && nextProps.quote === prevProps.quote
)

@withTheme()
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
        <Body data-e2e="tradeHistory__body" background={background.default}>
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
