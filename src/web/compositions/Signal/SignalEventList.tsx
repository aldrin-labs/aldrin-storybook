import React, { useState, useEffect } from 'react'
import moment from 'moment'

import QueryRenderer from '@core/components/QueryRenderer'
import { roundAndFormatNumber } from '@core/utils/PortfolioTableUtils'
import { GET_SIGNAL_EVENTS_QUERY } from '@core/graphql/queries/signals/getSignalEvents'

import { addMainSymbol, TableWithSort } from '@sb/components'
import { ContainerGrid } from './SignalPage.styles'

import { IState, IProps } from './SignalEventList.types'

const putDataInTable = (tableData, timers, updateTimers) => {
  if (!tableData || tableData.length === 0) {
    return { head: [], body: [], footer: null }
  }

  const [body, updateTimersInterval] = transformData(
    tableData,
    timers,
    updateTimers
  )

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
      { id: 'spreadA', label: 'Spread A' },
      { id: 'spreadB', label: 'Spread B' },
      { id: 'priceA', label: 'Price A' },
      { id: 'priceB', label: 'Price B' },
      { id: 'profit', label: 'Profit' },
      { id: 'status', label: 'Status' },
    ],
    body,
    updateTimersInterval,
  }
}

const transformData = (data: any[], timers, updateTimers) => {
  // update timer
  const countUp = ({ seconds, minutes, hours, days }) => {
    const pad = (num: number | string) => (+num < 10 ? '0' + num : num)

    let updatedSeconds = +seconds + 1
    if (updatedSeconds < 60) {
      return { seconds: pad(updatedSeconds), minutes, hours, days }
    }

    let updatedMinutes = +minutes + 1
    if (updatedMinutes < 60) {
      return { seconds: '00', minutes: pad(updatedMinutes), hours, days }
    }

    let updatedHours = +hours + 1
    if (updatedHours < 24) {
      return { seconds: '00', minutes: '00', hours: pad(updatedHours), days }
    }

    let updatedDays = +days + 1
    return {
      seconds: '00',
      minutes: '00',
      hours: '00',
      days: pad(updatedDays),
    }
  }

  // update for all signal events
  const updateTimersInterval = (timers) => {
    return timers.map((timer) => {
      return countUp(timer)
    })
  }

  // get start data
  const initializeState = (
    updatedAt: number
  ): { seconds: number; minutes: number; hours: number; days: number } => {
    let deltaSeconds = ((Date.now() / 1000) | 0) - updatedAt

    const days = Math.floor(deltaSeconds / (3600 * 24))
    deltaSeconds -= days * 3600 * 24

    const hours = Math.floor(deltaSeconds / 3600)
    deltaSeconds -= hours * 3600

    const minutes = Math.floor(deltaSeconds / 60)
    deltaSeconds = Math.floor(deltaSeconds - minutes * 60)

    return { days, hours, minutes, seconds: deltaSeconds }
  }

  const timersArray = []
  const transformedData = data.map((row, i) => {
    // get data to update state after cycle
    timersArray.push(initializeState(row.updatedAt))

    const { days, hours, minutes, seconds } = timers[i]
      ? timers[i]
      : { days: 0, hours: 0, minutes: 0, seconds: 0 }

    return {
      id: row._id,
      updatedAt: `${days}d ${hours}h ${minutes}m ${seconds}s`,
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
      exchangeA: row.exchangeA || '-',
      exchangeB: row.exchangeB || '-',
      amount: {
        contentToSort: row.amount,
        contentToCSV: roundAndFormatNumber(row.amount, 2, true),
        render: row.amount
          ? addMainSymbol(roundAndFormatNumber(row.amount, 2, true), true)
          : '-',
      },
      spreadA: {
        contentToSort: row.spreadA,
        contentToCSV: roundAndFormatNumber(row.spreadA, 2, false),
        render: row.spreadA
          ? `${roundAndFormatNumber(row.spreadA, 2, false)} %`
          : '-',
      },
      spreadB: {
        contentToSort: row.spreadB,
        contentToCSV: roundAndFormatNumber(row.spreadB, 2, false),
        render: row.spreadB
          ? `${roundAndFormatNumber(row.spreadB, 2, false)} %`
          : '-',
      },
      priceA: {
        contentToSort: row.priceA,
        contentToCSV: roundAndFormatNumber(row.priceA, 8, true),
        render: row.priceA ? roundAndFormatNumber(row.priceA, 8, true) : '-',
      },
      priceB: {
        contentToSort: row.priceB,
        contentToCSV: roundAndFormatNumber(row.priceB, 8, true),
        render: row.priceB ? roundAndFormatNumber(row.priceB, 8, true) : '-',
      },
      profit: {
        contentToSort: row.profit,
        contentToCSV: roundAndFormatNumber(row.profit, 3, true),
        render: row.profit ? roundAndFormatNumber(row.profit, 3, true) : '-',
      },
      status: row.status || '-',
      orderbook: {
        orders: row.ordersJson,
        ordersA: row.ordersJsonA,
        ordersB: row.ordersJsonB,
      },
    }
  })

  // update data
  if (timersArray.length > timers.length) {
    updateTimers(timersArray)
  }

  return [transformedData, updateTimersInterval]
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

  const smallScreen = window.outerWidth < 1500

  const [refetchTimerId, updateRefetchTimer] = useState(0)
  const [timers, updateTimers] = useState([])
  const [autoRefetch, toggleAutoRefetch] = useState(true)

  const { body, head, footer = [], updateTimersInterval } = putDataInTable(
    events,
    timers,
    // use to update data when initialize
    updateTimers
  )

  useEffect(() => {
    // update timers for all signals
    let id = setInterval(() => {
      updateTimers(updateTimersInterval(timers))
    }, 1000)

    return () => clearInterval(id)
  })

  useEffect(() => {
    // update timers for all signals
    autoRefetch
      ? updateRefetchTimer(
          setInterval(() => {
            refetch()
          }, 3000)
        )
      : clearInterval(refetchTimerId)

    return () => clearInterval(refetchTimerId)
  }, [autoRefetch])

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
          rowsPerPageOptions: [30, 50, 70, 100],
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
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontSize: smallScreen ? '.8rem' : '.9rem',
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
