import React, { memo, PureComponent } from 'react'

import { calculatePercentagesOfOrderSize } from '@core/utils/chartPageUtils'
import {
  Row,
  Cell,
  Body,
} from '@sb/components/OldTable/Table'
import { SpreadreadTableWrapper } from './SpreadTable.styles'
import { hexToRgbAWithOpacity } from '@sb/styles/helpers'
import {
  EmptyCell,
  StyledTypography,
  RowWithVolumeChart,
} from '../../../SharedStyles'
import { IProps } from './SpreadTable.types'
import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { CSS_CONFIG } from '@sb/config/cssConfig'
import { withTheme } from '@material-ui/styles'

const RowFunc = ({
  order,
  data,
  action,
  background,
  digitsAfterDecimalForBidsSize,
  green,
  digitsAfterDecimalForBidsPrice,
}) => (
  <Row background={'transparent'} key={order.price}>
    <RowWithVolumeChart
      volumeColor={hexToRgbAWithOpacity(green.main, 0.25)}
      colored={calculatePercentagesOfOrderSize(order.size, data).toString()}
      hoverBackground={action.hover}
      background={background.default}
    >
      <EmptyCell width={'10%'} />

      <Cell width={'45%'}>
        <StyledTypography
          fontSize={CSS_CONFIG.chart.bodyCell.fontSize}
          textColor={green.main}
          color="default"
          noWrap={true}
          variant="body1"
          align="right"
        >
          {(order.size).toFixed(digitsAfterDecimalForBidsSize)}
        </StyledTypography>
      </Cell>
      <Cell width={'45%'}>
        <StyledTypography
          fontSize={CSS_CONFIG.chart.bodyCell.fontSize}
          textColor={green.main}
          color="default"
          noWrap={true}
          variant="body1"
          align="right"
        >
          {(order.price).toFixed(digitsAfterDecimalForBidsPrice)}
        </StyledTypography>
      </Cell>
    </RowWithVolumeChart>
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
