import React, { Component, memo } from 'react'
import { difference } from 'lodash-es'

import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { TypographyFullWidth } from '@sb/styles/cssUtils'
import { Row, Title, Head, HeadCell } from '@sb/components/OldTable/Table'
import OrderBookBody from './OrderBookBody/OrderBookBody'
import { EmptyCell } from '../../../SharedStyles'
import { TypographyWithCustomColor } from '@sb/styles/StyledComponents/TypographyWithCustomColor'
import { IProps } from './OrderBookTable.types'
import { AsksTable, SwitchTablesButton } from './OrderBookTable.styles'

const MemoHead = memo(
  ({ palette, primary, type, onButtonClick, background, quote }) => (
    <>
      {' '}
      <Title background={primary[type]}>
        <TypographyWithCustomColor
          textColor={palette.getContrastText(primary[type])}
          variant="subtitle2"
          align="center"
        >
          Order Book
        </TypographyWithCustomColor>
        <SwitchTablesButton
          onClick={onButtonClick}
          variant="outlined"
          color="default"
        >
          HISTORY
        </SwitchTablesButton>
      </Title>
      <Head background={background.default} border={palette.divider}>
        <Row isHead={true} background={background.default}>
          <EmptyCell width={'10%'} />
          <HeadCell width={'45%'}>
            <TypographyFullWidth
              textColor={palette.getContrastText(background.default)}
              variant="body2"
              color="default"
              align="right"
            >
              Trade Size
            </TypographyFullWidth>
          </HeadCell>
          <HeadCell width={'45%'}>
            <TypographyFullWidth
              textColor={palette.getContrastText(background.default)}
              variant="body2"
              noWrap={true}
              color="default"
              align="right"
            >
              Price {quote || 'Fiat'}
            </TypographyFullWidth>
          </HeadCell>
        </Row>
      </Head>
    </>
  ),
  (prevProps, nextProps) =>
    nextProps.quote === prevProps.quote && nextProps.type === prevProps.type
)

class OrderBookTable extends Component<IProps> {
  shouldComponentUpdate(nextProps: IProps) {
    const shouldUpdate =
      difference(nextProps.data, this.props.data).length > 0 ||
      nextProps.activeExchange.symbol !== this.props.activeExchange.symbol ||
      nextProps.currencyPair !== this.props.currencyPair ||
      (this.props.data.length > 0 && nextProps.data.length === 0) ||
      nextProps.tableExpanded !== this.props.tableExpanded

    return shouldUpdate
  }

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
          {...{ palette, primary, type, onButtonClick, background, quote, key: 'asks_headrow' }}
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
