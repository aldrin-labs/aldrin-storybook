import React, { PureComponent, Component, memo } from 'react'

import { CSS_CONFIG } from '@sb/config/cssConfig'
import { Row, Cell, Body } from '@sb/components/OldTable/Table'
import {
  calculatePercentagesOfOrderSize,
  ScrollToBottom,
} from '@core/utils/chartPageUtils'
import { IProps } from './OrderBookBody.types'
// import {
//   EmptyCell,
//   RowWithVolumeChart,
//   StyledTypography,
// } from '../../../../SharedStyles'
import { hexToRgbAWithOpacity } from '@sb/styles/helpers'

import { TypographyFullWidth } from '@sb/styles/cssUtils'

import {
  StyledTypography,
  StyledArrow,
  StyledTitle,
  TradeHistoryTableCollapsible,
  TriggerTitle,
  CardTitle,
  StyledCell,
} from '../../../../TradeHistoryTable/Table/TradeHistoryTable.styles'

let objDiv: HTMLElement | null

const OptimizedRow = memo(
  ({
    order,
    data,
    background,
    red,
    digitsAfterDecimalForAsksSize,
    digitsAfterDecimalForAsksPrice,
    // type,
  }) => (
    <Row background={'transparent'} style={{ justifyContent: 'space-between' }}>
      {/* <RowWithVolumeChart
        volumeColor={hexToRgbAWithOpacity(red.main, 0.25)}
        colored={calculatePercentagesOfOrderSize(+order.size, data).toString()}
        background={background.default}
      > */}
      {/* <EmptyCell width={'10%'} /> */}
      <StyledCell style={{ maxWidth: '25%' }}>
        <TypographyFullWidth textColor={'#b93b2b'} variant="body1">
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
  ),
  (prevProps, nextProps) => nextProps.order.price === prevProps.order.price
  // nextProps.type === prevProps.type
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
    const {
      data,
      digitsAfterDecimalForAsksPrice,
      digitsAfterDecimalForAsksSize,
      action,
      background,
      theme: {
        palette: { red, type },
      },
    } = this.props

    return (
      <Body id="body" height={'calc(100% - 44px)'}>
        {data.map(
          (
            order: {
              size: number | string
              price: number | string
              total: number | string
            },
            i: number
          ) => (
            <OptimizedRow
              key={`${order.price}${order.size}${order.total}`}
              {...{
                order,
                data,
                action,
                background,
                red,
                digitsAfterDecimalForAsksSize,
                digitsAfterDecimalForAsksPrice,
              }}
            />
          )
        )}
      </Body>
    )
  }
}

export default ClassBody
