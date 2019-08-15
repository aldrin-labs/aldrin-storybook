import React, { memo, PureComponent } from 'react'
import { withTheme } from '@material-ui/styles'

import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { TypographyFullWidth } from '@sb/styles/cssUtils'
import { Row, Title, Head, HeadCell } from '@sb/components/OldTable/Table'
import OrderBookBody from './OrderBookBody/OrderBookBody'
import { EmptyCell } from '../../../SharedStyles'
import { TypographyWithCustomColor } from '@sb/styles/StyledComponents/TypographyWithCustomColor'
import { IProps } from './OrderBookTable.types'
import { AsksTable, SwitchTablesButton } from './OrderBookTable.styles'

import {
  StyledTypography,
  StyledArrow,
  StyledTitle,
  TradeHistoryTableCollapsible,
  TriggerTitle,
  CardTitle,
  StyledCell,
} from '../../../TradeHistoryTable/Table/TradeHistoryTable.styles'

const MemoHead = memo(
  ({ palette, primary, type, onButtonClick, background, quote }) => (
    <>
      {/* {' '} */}
      <TriggerTitle background={primary[type]}>
        <CardTitle
          textColor={palette.getContrastText(primary[type])}
          variant="subtitle2"
          align="center"
        >
          Order Book
        </CardTitle>
        {/* <SwitchTablesButton
          onClick={onButtonClick}
          variant="outlined"
          color="default"
        >
          HISTORY
        </SwitchTablesButton> */}
      </TriggerTitle>
      <Head background={'#fff'} style={{ height: 'auto', border: 'none' }}>
        <Row isHead={true} background={background.default}>
          <HeadCell style={{ width: 'auto' }}>
            <StyledTitle variant="body2" color="default" align="right">
              Price
              {/* {quote || 'Fiat'} */}
            </StyledTitle>
          </HeadCell>

          <HeadCell style={{ width: 'auto' }}>
            <StyledTitle variant="body2" color="default" align="right">
              Size
            </StyledTitle>
          </HeadCell>

          <HeadCell style={{ width: 'auto' }}>
            <StyledTitle variant="body2" color="default" align="right">
              Total
            </StyledTitle>
          </HeadCell>
        </Row>
      </Head>
    </>
  ),
  (prevProps, nextProps) =>
    nextProps.quote === prevProps.quote && nextProps.type === prevProps.type
)

@withTheme()
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
