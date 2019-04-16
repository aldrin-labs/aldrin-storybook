import React, { Component, memo } from 'react'

import { CSS_CONFIG } from '@sb/config/cssConfig'
import { Row, Cell, Body } from '@sb/components/OldTable/Table'
import { Loading } from '@sb/components/Loading'
import {
  calculatePercentagesOfOrderSize,
  ScrollToBottom,
} from '@core/utils/chartPageUtils'
import { IProps } from './OrderBookBody.types'
import {
  EmptyCell,
  RowWithVolumeChart,
  StyledTypography,
} from '../../../../SharedStyles'
import { hexToRgbAWithOpacity } from '@sb/styles/helpers'

let objDiv: HTMLElement | null

const OptimizedRow = memo(
  ({
    order,
    data,
    background,
    red,
    digitsAfterDecimalForAsksSize,
    digitsAfterDecimalForAsksPrice,
    type,
  }) => (
    <Row background={'transparent'}>
      <RowWithVolumeChart
        volumeColor={hexToRgbAWithOpacity(red.main, 0.25)}
        colored={calculatePercentagesOfOrderSize(+order.size, data).toString()}
        background={background.default}
      >
        <EmptyCell width={'10%'} />
        <Cell width={'45%'}>
          <StyledTypography
            // style={{fontSize: '0.75rem'}}
            fontSize={CSS_CONFIG.chart.bodyCell.fontSize}
            textColor={red.main}
            color="default"
            noWrap={true}
            variant="body2"
            align="right"
          >
            {Number(order.size).toFixed(digitsAfterDecimalForAsksSize)}
          </StyledTypography>
        </Cell>
        <Cell width={'45%'}>
          <StyledTypography
            fontSize={CSS_CONFIG.chart.bodyCell.fontSize}
            // style={{fontSize: '0.75rem'}}
            textColor={red.main}
            color="default"
            noWrap={true}
            variant="body1"
            align="right"
          >
            {Number(order.price).toFixed(digitsAfterDecimalForAsksPrice)}
          </StyledTypography>
        </Cell>
      </RowWithVolumeChart>
    </Row>
  ),
  (prevProps, nextProps) =>
    nextProps.order.price === prevProps.order.price &&
    nextProps.type === prevProps.type
)

class ClassBody extends Component<IProps> {
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
      index,
      background,
      theme: {
        palette: { red, type },
      },
    } = this.props

    return (
      <Body id="body" height={'calc(100% - 44px)'}>
        {data.length === 0 ? (
          <Loading centerAligned={true} />
        ) : (
          <>
            {data.map(
              (
                order: { size: number | string; price: number | string },
                i: number
              ) => (
                <OptimizedRow
                  key={order.price}
                  {...{
                    type,
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
          </>
        )}
      </Body>
    )
  }
}

export default ClassBody
