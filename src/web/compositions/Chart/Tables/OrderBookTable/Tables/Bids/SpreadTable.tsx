import React, { Component, memo } from 'react'
import styled from 'styled-components'
import { difference } from 'lodash-es'

import { calculatePercentagesOfOrderSize } from '@core/utils/chartPageUtils'
import {
  Table,
  Row,
  Head,
  Cell,
  HeadCell,
  Body,
} from '@storybook/components/OldTable/Table'
import { Loading } from '@storybook/components/Loading'
import { TypographyFullWidth } from '@storybook/styles/cssUtils'
import { hexToRgbAWithOpacity } from '@storybook/styles/helpers'
import {
  EmptyCell,
  StyledTypography,
  RowWithVolumeChart,
} from '../../../SharedStyles'
import { IProps } from './SpreadTable.types'
import { withErrorFallback } from '@core/hoc/withErrorFallback'

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
          textColor={green.main}
          color="default"
          noWrap={true}
          variant="body1"
          align="right"
        >
          {Number(order.size).toFixed(digitsAfterDecimalForBidsSize)}
        </StyledTypography>
      </Cell>
      <Cell width={'45%'}>
        <StyledTypography
          textColor={green.main}
          color="default"
          noWrap={true}
          variant="body1"
          align="right"
        >
          {Number(order.price).toFixed(digitsAfterDecimalForBidsPrice)}
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

const HeadRowWithMemo = memo(
  ({ primary, type, palette, quote, spread, digitsAfterDecimalForSpread }) => (
    <Head
      background={primary[type]}
      style={{ height: '2.875rem' }}
      border={'none'}
    >
      <TriggerRow isHead={true} background={primary[type]}>
        <EmptyCell width="10%" />
        <HeadCell width={'45%'}>
          <TypographyFullWidth
            textColor={palette.getContrastText(primary[type])}
            variant="body1"
            align="right"
          >
            {quote || 'Fiat'} spread{' '}
          </TypographyFullWidth>
        </HeadCell>
        <HeadCell width={'45%'}>
          <TypographyFullWidth
            textColor={palette.getContrastText(primary[type])}
            variant="body1"
            align="right"
            color="secondary"
          >
            {+spread.toFixed(digitsAfterDecimalForSpread) <= 0
              ? '~ 0'
              : spread.toFixed(digitsAfterDecimalForSpread)}
          </TypographyFullWidth>
        </HeadCell>
      </TriggerRow>
    </Head>
  ),
  (prevProps, nextProps) =>
    nextProps.spread === prevProps.spread &&
    nextProps.quote === prevProps.quote &&
    nextProps.type === prevProps.type
)

class SpreadTable extends Component<IProps> {
  shouldComponentUpdate(nextProps: IProps) {
    const shouldUpdate =
      difference(nextProps.data, this.props.data).length > 0 ||
      nextProps.currencyPair !== this.props.currencyPair ||
      (this.props.data.length > 0 && nextProps.data.length === 0)

    return shouldUpdate
  }

  render() {
    const {
      digitsAfterDecimalForSpread,
      spread,
      theme: { palette },
      quote,
      data,
      digitsAfterDecimalForBidsSize,
      digitsAfterDecimalForBidsPrice,
    } = this.props
    const { background, action, primary, type, green } = palette

    return (
      <SpreadreadTableWrapper>
        <HeadRowWithMemo
          {...{
            primary,
            type,
            palette,
            quote,
            spread,
            digitsAfterDecimalForSpread,
          }}
        />
        <Body background={background.default} height="calc(100% - 26px)">
          {data.length === 0 ? (
            <Loading centerAligned={true} />
          ) : (
            <>
              {data.map((order: { size: number; price: number }, i: number) => (
                <MemoizedRow
                  key={order.price}
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
              ))}
            </>
          )}
        </Body>
      </SpreadreadTableWrapper>
    )
  }
}

const TriggerRow = styled(Row)`
  display: flex;
`

const SpreadreadTableWrapper = styled(Table)`
  height: 50%;
  @media (max-width: 1080px) {
    bottom: 40px;
  }
`

export default withErrorFallback(SpreadTable)
