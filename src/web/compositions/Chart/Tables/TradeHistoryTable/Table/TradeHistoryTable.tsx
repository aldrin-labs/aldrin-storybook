import React, { memo, PureComponent } from 'react'
import { withTheme } from '@material-ui/styles'

import {
  Row,
  Body,
  Head,
  HeadCell,
  Cell,
} from '@sb/components/OldTable/Table'
import { IProps, IState, ITicker } from './TradeHistoryTable.types'
import { TypographyFullWidth } from '@sb/styles/cssUtils'

import {
  StyledTypography,
  StyledArrow,
  TradeHistoryTableCollapsible,
  TriggerTitle
} from './TradeHistoryTable.styles'

const OptimizedRow = memo(
  ({ ticker, background, numbersAfterDecimalForPrice, red, green }) => (
    <Row background={background.default}>
      <Cell style={{ padding: '0 0.2rem' }} width={'30%'}>
        <TypographyFullWidth noWrap={true} variant="caption" align="right">
          {(+ticker.size).toFixed(4)}
        </TypographyFullWidth>
      </Cell>
      <Cell width={'40%'} style={{ padding: '0 0.2rem', display: 'flex' }}>
        <StyledArrow
          fontSize="small"
          color={ticker.fall ? red.main : green.main}
          direction={ticker.fall ? 'down' : 'up'}
        />
        <StyledTypography
          textColor={ticker.fall ? red.main : green.main}
          noWrap={true}
          variant="caption"
          align="right"
        >
          {(+ticker.price).toFixed(numbersAfterDecimalForPrice)}
        </StyledTypography>
      </Cell>
      <Cell style={{ padding: '0 0.2rem' }} width={'30%'}>
        <TypographyFullWidth
          color="textSecondary"
          noWrap={true}
          variant="caption"
          align="right"
        >
          {ticker.time}
        </TypographyFullWidth>
      </Cell>
    </Row>
  ),
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
        <TypographyFullWidth
          textColor={palette.getContrastText(primary[type])}
          variant="subtitle2"
          align="center"
        >
          Trade history
        </TypographyFullWidth>
      </TriggerTitle>
      <Head background={palette.background.default} border={palette.divider}>
        <Row
          background={palette.background.default}
          isHead={true}
          style={{ height: '100%' }}
        >
          <HeadCell style={{ padding: '0 ' }} color="#9ca2aa" width={'30%'}>
            <TypographyFullWidth
              textColor={palette.getContrastText(palette.background.default)}
              variant="body2"
              align="right"
              noWrap={true}
            >
              Trade Size
            </TypographyFullWidth>
          </HeadCell>
          <HeadCell
            color="#9ca2aa"
            style={{ padding: '0 0.2rem' }}
            width={'40%'}
          >
            <TypographyFullWidth
              noWrap={true}
              textColor={palette.getContrastText(palette.background.default)}
              variant="body2"
              align="right"
            >
              Price {quote || 'Fiat'}
            </TypographyFullWidth>
          </HeadCell>
          <HeadCell
            style={{
              lineHeight: '32px',
              padding: '0 0.2rem',
            }}
            width={'30%'}
          >
            <TypographyFullWidth
              variant="body2"
              textColor={palette.getContrastText(palette.background.default)}
              align="right"
            >
              Time
            </TypographyFullWidth>
          </HeadCell>
        </Row>
      </Head>
    </>
  ),
  (prevProps, nextProps) =>
    nextProps.type === prevProps.type &&
    nextProps.quote === prevProps.quote
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
    const { background, primary, type, } = palette
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
            background={background.default}
            height="calc((68vh - 59px) - 48px)"
          >
                {data.map((ticker: ITicker, i: number) => (
                  <OptimizedRow
                    key={`${ticker.time}${ticker.id}${ticker.price}${ticker.size}${ticker.fall}`}
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
