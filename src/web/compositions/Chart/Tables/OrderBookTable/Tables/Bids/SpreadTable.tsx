import React, { memo, PureComponent } from 'react'

import { calculatePercentagesOfOrderSize } from '@core/utils/chartPageUtils'
import { Row, Cell, Body } from '@sb/components/OldTable/Table'
import { SpreadreadTableWrapper } from './SpreadTable.styles'
import { hexToRgbAWithOpacity } from '@sb/styles/helpers'
// import {
//   EmptyCell,
//   StyledTypography,
//   RowWithVolumeChart,
// } from '../../../SharedStyles'
import { IProps } from './SpreadTable.types'
import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { CSS_CONFIG } from '@sb/config/cssConfig'
import { withTheme } from '@material-ui/styles'

import { TypographyFullWidth } from '@sb/styles/cssUtils'

import {
  StyledTypography,
  StyledArrow,
  StyledTitle,
  TradeHistoryTableCollapsible,
  TriggerTitle,
  CardTitle,
  StyledCell,
} from '../../../TradeHistoryTable/Table/TradeHistoryTable.styles'

const RowFunc = ({
  order,
  data,
  action,
  background,
  digitsAfterDecimalForBidsSize,
  green,
  digitsAfterDecimalForBidsPrice,
}) => (
  <Row background={'transparent'} style={{ justifyContent: 'space-between' }}>
    {/* <RowWithVolumeChart
    volumeColor={hexToRgbAWithOpacity(red.main, 0.25)}
    colored={calculatePercentagesOfOrderSize(+order.size, data).toString()}
    background={background.default}
  > */}
    {/* <EmptyCell width={'10%'} /> */}
    <StyledCell style={{ maxWidth: '25%' }}>
      <TypographyFullWidth textColor={'#2F7619'} variant="body1">
        {
          order.price
          // .toFixed(digitsAfterDecimalForAsksPrice)
        }
      </TypographyFullWidth>
    </StyledCell>

    <StyledCell style={{ maxWidth: '35%' }}>
      <TypographyFullWidth textColor={'#7284A0'} variant="body2" align="left">
        {
          order.size
          // .toFixed(digitsAfterDecimalForAsksSize)
        }
      </TypographyFullWidth>
    </StyledCell>

    <StyledCell style={{ maxWidth: '40%' }}>
      <TypographyFullWidth textColor={'#7284A0'} variant="body1" align="left">
        {
          order.total
          // .toFixed(digitsAfterDecimalForAsksPrice)
        }
      </TypographyFullWidth>
    </StyledCell>
    {/* </RowWithVolumeChart> */}
  </Row>
)

const MemoizedRow = memo(
  RowFunc,
  (prevProps, nextProps) =>
    nextProps.order.price === prevProps.order.price &&
    nextProps.type === prevProps.type
)

@withTheme()
class SpreadTable extends PureComponent<IProps> {
  render() {
    const {
      data,
      digitsAfterDecimalForBidsSize,
      digitsAfterDecimalForBidsPrice,
      theme: { palette, customPalette },
    } = this.props

    const { background, action, type } = palette
    const { green } = customPalette

    return (
      <SpreadreadTableWrapper>
        <Body height="calc(100% - 26px)">
          {data.map(
            (
              order: { size: number; price: number; type: string },
              i: number
            ) => (
              <MemoizedRow
                key={`${order.price}${order.size}${order.type}`}
                {...{
                  type,
                  order,
                  data,
                  action,
                  background,
                  digitsAfterDecimalForBidsSize,
                  green,
                  digitsAfterDecimalForBidsPrice,
                }}
              />
            )
          )}
        </Body>
      </SpreadreadTableWrapper>
    )
  }
}

export default withErrorFallback(SpreadTable)
