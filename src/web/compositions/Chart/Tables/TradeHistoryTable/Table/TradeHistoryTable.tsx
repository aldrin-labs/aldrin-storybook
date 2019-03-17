import React, { memo, PureComponent } from 'react'

import {
  Table,
  Row,
  Title,
  Body,
  Head,
  HeadCell,
  Cell,
} from '@sb/components/OldTable/Table'
import { IProps, IState, ITicker } from './TradeHistoryTable.types'
import { Loading } from '@sb/components/Loading'
import { TypographyFullWidth } from '@sb/styles/cssUtils'
import { StyledTypography, CollapseWrapper, StyledArrow, StyledArrowSign, TradeHistoryTableCollapsible, TriggerTitle } from './TradeHistoryTable.styles'

const OptimizedRow = memo(
  ({ ticker, background, numbersAfterDecimalForPrice, red, green }) => (
    <Row background={background.default}>
      <Cell style={{ padding: '0 0.2rem' }} width={'30%'}>
        <TypographyFullWidth noWrap={true} variant="caption" align="right">
          {Number(ticker.size).toFixed(4)}
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
          {Number(ticker.price).toFixed(numbersAfterDecimalForPrice)}
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
  ({ tableExpanded, primary, type, palette, onClick, quote }) => (
    <>
      <TriggerTitle
        data-e2e="tradeHistory__arrowButton"
        background={primary[type]}
        onClick={onClick}
      >
        <TypographyFullWidth
          textColor={palette.getContrastText(primary[type])}
          variant="subtitle1"
          align="center"
        >
          Trade history
        </TypographyFullWidth>

        <StyledArrowSign
          variant={{
            tableCollapsed: !tableExpanded,
            up: !tableExpanded,
          }}
          style={{
            marginRight: '0.5rem',
            color: palette.secondary.main,
          }}
        />
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
    nextProps.tableExpanded === prevProps.tableExpanded &&
    nextProps.type === prevProps.type &&
    nextProps.quote === prevProps.quote
)

class TradeHistoryTable extends PureComponent<IProps, IState> {
  state = {
    tableExpanded: true,
  }

  onClick = () => {
    this.setState((prevState) => ({
      tableExpanded: !prevState.tableExpanded,
    }))
  }

  render() {
    const {
      numbersAfterDecimalForPrice,
      quote,
      data,
      theme: { palette },
    } = this.props
    const { tableExpanded } = this.state
    const { background, primary, type, red, green } = palette
    const { onClick } = this

    return (
      <TradeHistoryTableCollapsible tableExpanded={tableExpanded}>
        <CollapseWrapper in={tableExpanded} collapsedHeight="2.5rem">
          <MemoizedHead
            {...{
              tableExpanded,
              primary,
              type,
              palette,
              onClick,
              quote,
            }}
          />
          <Body
            data-e2e="tradeHistory__body"
            background={background.default}
            height="42vh"
          >
            {data.length === 0 && tableExpanded ? (
              <Loading centerAligned={true} />
            ) : (
              <>
                {data.map((ticker: ITicker, i: number) => (
                  <OptimizedRow
                    key={ticker.id}
                    {...{
                      ticker,
                      background,
                      numbersAfterDecimalForPrice,
                      red,
                      green,
                    }}
                  />
                ))}
              </>
            )}
          </Body>
        </CollapseWrapper>
      </TradeHistoryTableCollapsible>
    )
  }
}

export default TradeHistoryTable
