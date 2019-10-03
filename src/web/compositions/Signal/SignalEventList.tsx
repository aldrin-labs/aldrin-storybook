import React, { useState, useEffect } from 'react'
import moment from 'moment'

import QueryRenderer from '@core/components/QueryRenderer'
import { roundAndFormatNumber } from '@core/utils/PortfolioTableUtils'
import { GET_SIGNAL_EVENTS_QUERY } from '@core/graphql/queries/signals/getSignalEvents'

import { addMainSymbol, TableWithSort } from '@sb/components'
import { ContainerGrid } from './SignalPage.styles'

import { checkValue } from './utils'
import { IState, IProps } from './SignalEventList.types'

const putDataInTable = (tableData: any[]) => {
  if (!tableData || tableData.length === 0) {
    return { head: [], body: [], footer: null }
  }

  const [body] = transformData(tableData)

  return {
    head: [
      { id: 'updatedAt', label: 'Updated At' },
      {
        id: 'timestamp',
        label: 'Timestamp',
      },
      { id: 'pair', label: 'Pair' },
      { id: 'exchangeA', label: 'Exchange A' },
      { id: 'exchangeB', label: 'Exchange B' },
      { id: 'amount', label: 'Amount' },
      { id: 'spreadC', label: 'Spread C' },
      { id: 'spreadA', label: 'Spread A' },
      { id: 'spreadB', label: 'Spread B' },
      { id: 'priceC', label: 'Price C' },
      { id: 'priceA', label: 'Price A' },
      { id: 'priceB', label: 'Price B' },
      { id: 'profit', label: 'Profit' },
      { id: 'status', label: 'Status' },
    ],
    body,
  }
}

const transformData = (data: any[]) => {
  const transformedData = data.map((row) => {
    const deltaSeconds = Date.now() - row.updatedAt * 1000

    const date = [
      moment.duration(deltaSeconds).months(),
      moment.duration(deltaSeconds).days(),
      moment.duration(deltaSeconds).hours(),
      moment.duration(deltaSeconds).minutes(),
      moment.duration(deltaSeconds).seconds(),
    ]

    const [months, days, hours, minutes, seconds] = date

    // check it again, doesn't work
    // const spreadA = row.spreadA || row.spreadC
    // const priceA = row.priceA || row.priceC
    // const ordersA = row.ordersJsonA || row.ordersJsonC

    return {
      id: row._id,
      updatedAt: {
        render: `${
          months > 0 ? `${months}m ` : ''
        }${days}d ${hours}h ${minutes}m ${seconds}s`,
        style: { textTransform: 'lowercase' },
      },
      timestamp: {
        contentToSort: row.t,
        contentToCSV: row.t,
        render: row.t ? (
          <div>
            <span style={{ display: 'block' }}>
              {String(moment(row.t / 1000000).format('DD-MM-YYYY')).replace(
                /-/g,
                '.'
              )}
            </span>
            <span style={{ color: '#7284A0' }}>
              {moment(row.t / 1000000).format('LT')}
            </span>
          </div>
        ) : (
          '-'
        ),
      },
      pair: row.pair || '-',
      exchangeA: {
        render: row.exchangeA || '-',
        style: { textTransform: 'uppercase' },
      },
      exchangeB: {
        render: row.exchangeB || '-',
        style: { textTransform: 'uppercase' },
      },
      amount: {
        contentToSort: row.amount,
        contentToCSV: roundAndFormatNumber(row.amount, 2, true),
        render: checkValue(
          row.amount,
          addMainSymbol(roundAndFormatNumber(row.amount, 2, true), true)
        ),
      },
      spreadC: {
        contentToSort: row.spreadC,
        contentToCSV: roundAndFormatNumber(row.spreadC, 2, false),
        render: checkValue(
          row.spreadC,
          `${roundAndFormatNumber(row.spreadC, 2, false)} %`
        ),
      },
      spreadA: {
        contentToSort: row.spreadA,
        contentToCSV: roundAndFormatNumber(row.spreadA, 2, false),
        render: checkValue(
          row.spreadA,
          `${roundAndFormatNumber(row.spreadA, 2, false)} %`
        ),
      },
      spreadB: {
        contentToSort: row.spreadB,
        contentToCSV: roundAndFormatNumber(row.spreadB, 2, false),
        render: checkValue(
          row.spreadB,
          `${roundAndFormatNumber(row.spreadB, 2, false)} %`
        ),
      },
      priceC: {
        contentToSort: row.priceC,
        contentToCSV: roundAndFormatNumber(row.priceC, 8, true),
        render: checkValue(
          row.priceC,
          roundAndFormatNumber(row.priceC, 8, true)
        ),
      },
      priceA: {
        contentToSort: row.priceA,
        contentToCSV: roundAndFormatNumber(row.priceA, 8, true),
        render: checkValue(
          row.priceA,
          roundAndFormatNumber(row.priceA, 8, true)
        ),
      },
      priceB: {
        contentToSort: row.priceB,
        contentToCSV: roundAndFormatNumber(row.priceB, 8, true),
        render: checkValue(
          row.priceB,
          roundAndFormatNumber(row.priceB, 8, true)
        ),
      },
      profit: {
        contentToSort: row.profit,
        contentToCSV: roundAndFormatNumber(row.profit, 3, true),
        render: checkValue(
          row.profit,
          roundAndFormatNumber(row.profit, 3, true)
        ),
      },
      status: {
        render: row.status || '-',
        style: { textTransform: 'uppercase' },
      },
      orderbook: {
        orders: row.ordersJson,
        ordersA: row.ordersJsonA,
        ordersB: row.ordersJsonB,
        ordersC: row.ordersJsonC,
      },
    }
  })

  return [transformedData]
}

const SignalEventList = (props) => {
  const {
    page,
    perPage,
    handleChangeRowsPerPage,
    handleChangePage,
    data: {
      getSignalEvents: { count, events },
    },
    onTrClick,
    refetch,
  } = props

  const [_, forceUpdate] = useState([])
  const [autoRefetch, toggleAutoRefetch] = useState(true)

  const { body, head, footer = [] } = putDataInTable(events)

  useEffect(() => {
    // update timers for all signals
    let id = setInterval(() => {
      forceUpdate([])
    }, 1000)

    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    // auto-refetch
    const id = autoRefetch
      ? setInterval(() => {
          refetch()
        }, 10000)
      : 0

    return () => clearInterval(id)
  }, [autoRefetch, refetch])

  return (
    <ContainerGrid container style={{ position: 'relative' }}>
      <TableWithSort
        onTrClick={onTrClick}
        needRefetch={true}
        autoRefetch={autoRefetch}
        toggleAutoRefetch={toggleAutoRefetch}
        pagination={{
          fakePagination: false,
          totalCount: count,
          enabled: true, // toogle page nav panel in the footer
          page: page,
          rowsPerPage: perPage,
          rowsPerPageOptions: [30, 50, 70, 100, 500, 1000],
          handleChangePage: handleChangePage,
          handleChangeRowsPerPage: handleChangeRowsPerPage,
        }}
        style={{
          height: '100%',
          overflowY: 'scroll',
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'column',
        }}
        id="SignalSocialTable"
        // title="Signal"
        columnNames={head}
        data={{ body, footer }}
        padding="dense"
        emptyTableText="No assets"
        tableStyles={{
          heading: {
            margin: '0',
            // padding: '0 0 0 1rem',
            textAlign: 'left',
            maxWidth: '14px',
            background: '#F2F4F6',
            fontFamily: "'DM Sans'",
            fontSize: '0.9rem',
            color: '#7284A0',
            lineHeight: '31px',
            letterSpacing: '1.5px',
          },
          cell: {
            textAlign: 'left',
            maxWidth: '14px',
            fontFamily: 'DM Sans',
            fontStyle: 'normal',
            fontWeight: '500',
            letterSpacing: '0.5px',
            fontSize: '.9rem',
            padding: '0 0 0 .3rem',
            '&:before': {
              content: '',
              display: 'block',
              width: 5,
              height: 5,
              backgroundColor: 'red',
              position: 'relative',
              top: 0,
              left: 0,
            },
          },
        }}
      />
    </ContainerGrid>
  )
}

export default class SignalEventListDataWrapper extends React.PureComponent<
  IProps,
  IState
> {
  state: IState = {
    page: 0,
    perPage: 30,
  }

  handleChangePage = (
    event: React.ChangeEvent<HTMLInputElement>,
    page: number
  ) => {
    this.setState({ page })
  }

  handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ perPage: +event.target.value })
  }

  render() {
    const { page, perPage } = this.state
    const { signalId } = this.props

    return (
      <QueryRenderer
        {...this.props}
        {...this.state}
        fetchPolicy="network-only"
        component={SignalEventList}
        query={GET_SIGNAL_EVENTS_QUERY}
        variables={{
          signalId: signalId,
          page: page,
          perPage: perPage,
        }}
        handleChangePage={this.handleChangePage}
        handleChangeRowsPerPage={this.handleChangeRowsPerPage}
      />
    )
  }
}
