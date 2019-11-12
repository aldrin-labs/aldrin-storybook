import React, { memo, PureComponent } from 'react'
import { withTheme } from '@material-ui/styles'

import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { Row, Head } from '@sb/components/OldTable/Table'

import ChartCardHeader from '@sb/components/ChartCardHeader'
import { TypographyFullWidth } from '@sb/styles/cssUtils'
import {
  Wrapper,
  StyledBody,
  StyledHeadCell,
  StyledBodyCell,
} from './OrderbookTable.styles'
import { StyledTitle } from '@sb/compositions/Chart/Tables/TradeHistoryTable/Table/TradeHistoryTable.styles'

const MemoHead = memo(({ title }) => (
  <>
    <ChartCardHeader>{title}</ChartCardHeader>
    <Head background={'#fff'} style={{ height: 'auto', border: 'none' }}>
      <Row>
        <StyledHeadCell>
          <StyledTitle variant="body2" color="default" align="left">
            Price
            {/* {quote || 'Fiat'} */}
          </StyledTitle>
        </StyledHeadCell>

        <StyledHeadCell>
          <StyledTitle
            variant="body2"
            color="default"
            align="right"
            style={{ paddingRight: 0 }}
          >
            Amount
          </StyledTitle>
        </StyledHeadCell>
      </Row>
    </Head>
  </>
))

const Table = ({ type, data }: { type: string; data: any }) => {
  return (
    <StyledBody>
      {data.map((order: number[], i: number) => (
        <OptimizedRow
          key={`${order[0]}${order[1]}${i}`}
          order={order}
          type={type}
        />
      ))}
    </StyledBody>
  )
}

// row in table
const OptimizedRow = memo(
  ({ type, order: [price, amount] }) => (
    <Row background={'transparent'} style={{ height: '1.5rem' }}>
      <StyledBodyCell style={{ minWidth: '50%' }}>
        <TypographyFullWidth
          textColor={type === 'asks' ? '#B93B2B' : '#2F7619'}
          variant="body1"
          align="left"
        >
          {
            price
            // .toFixed(digitsAfterDecimalForAsksPrice)
          }
        </TypographyFullWidth>
      </StyledBodyCell>

      <StyledBodyCell style={{ minWidth: '50%' }}>
        <TypographyFullWidth
          textColor={'#7284A0'}
          variant="body1"
          align="right"
          style={{ paddingRight: 0 }}
        >
          {
            amount
            // .toFixed(digitsAfterDecimalForAsksPrice)
          }
        </TypographyFullWidth>
      </StyledBodyCell>
    </Row>
  ),
  (prevProps, nextProps) => nextProps.order.price === prevProps.order.price
)

// whole table with label and asks + bids
@withTheme
class OrderBookTable extends PureComponent {
  render() {
    const { title, data } = this.props

    const asksExist = !!data.asks
    const bidsExist = !!data.bids
    const allDataExists = asksExist && bidsExist

    return (
      <Wrapper>
        <MemoHead title={title} />
        {asksExist ? (
          <Table data={data.asks || []} key={'asks_body'} type={'asks'} />
        ) : null}
        {allDataExists ? (
          <div
            style={{ width: '100%', height: '1rem', background: '#F2F4F6' }}
          />
        ) : null}
        {bidsExist ? (
          <Table data={data.bids || []} key={'bids_body'} type={'bids'} />
        ) : null}
      </Wrapper>
    )
  }
}

export default withErrorFallback(OrderBookTable)
