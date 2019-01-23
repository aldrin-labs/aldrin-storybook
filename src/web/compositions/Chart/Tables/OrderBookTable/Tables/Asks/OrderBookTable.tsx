import React, { Component, memo } from 'react'
import styled from 'styled-components'
import { Button } from '@material-ui/core'
import { difference } from 'lodash-es'

import { TypographyFullWidth } from '@storybook/styles/cssUtils'
import { Table, Row, Title, Head, HeadCell } from '@storybook/components/OldTable/Table'
import OrderBookBody from './OrderBookBody/OrderBookBody'
import { EmptyCell } from '../../../SharedStyles'
import { TypographyWithCustomColor } from '@storybook/styles/StyledComponents/TypographyWithCustomColor'
import { IProps } from './OrderBookTable.types'
import { withErrorFallback } from '@core/hoc/withErrorFallback'

let index: number | null = null

const MemoHead = memo(
  ({ palette, primary, type, onButtonClick, background, quote }) => (
    <>
      {' '}
      <Title background={primary[type]}>
        <TypographyWithCustomColor
          textColor={palette.getContrastText(primary[type])}
          variant="subtitle1"
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
      nextProps.activeExchange.index !== this.props.activeExchange.index ||
      nextProps.currencyPair !== this.props.currencyPair ||
      (this.props.data.length > 0 && nextProps.data.length === 0) ||
      nextProps.tableExpanded !== this.props.tableExpanded

    return shouldUpdate
  }

  componentDidUpdate(prevProps: IProps) {
    index =
      this.props.data &&
      this.props.data.findIndex(
        (el) => el === difference(this.props.data, prevProps.data)[0]
      )
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
          {...{ palette, primary, type, onButtonClick, background, quote }}
        />
        {/* hack to autoscroll to bottom */}
        <OrderBookBody
          {...{
            background,
            action,
            index,
            ...this.props,
          }}
        />
      </AsksTable>
    )
  }
}

const AsksTable = styled(Table)`
  height: 50%;
  flex-wrap: nowrap;
  flex-direction: column;
  justify-content: flex-start;
  display: flex;
`

const SwitchTablesButton = styled(Button)`
  && {
    display: none;

    @media (max-width: 1080px) {
      display: block;
    }
  }
`

export default withErrorFallback(OrderBookTable)
