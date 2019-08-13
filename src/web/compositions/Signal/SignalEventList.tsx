import React from 'react'
import moment from 'moment'

import QueryRenderer from '@core/components/QueryRenderer'
import { roundAndFormatNumber } from '@core/utils/PortfolioTableUtils'
import { GET_SIGNAL_EVENTS_QUERY } from '@core/graphql/queries/signals/getSignalEvents'

import { addMainSymbol, TableWithSort } from '@sb/components'
import { ContainerGrid } from './SignalPage.styles'

import { IState, IProps } from './SignalEventList.types'

const putDataInTable = (tableData) => {
  if (!tableData || tableData.length === 0) {
    return { head: [], body: [], footer: null }
  }

  return {
    head: [
      {
        id: 'timestamp',
        label: 'Timestamp',
      },
      { id: 'pair', label: 'Pair' },
      { id: 'exchangeA', label: 'Exchange A' },
      { id: 'exchangeB', label: 'Exchange B' },
      { id: 'amount', label: 'amount' },
      { id: 'spread', label: 'spread' },
      { id: 'pricea', label: 'pricea' },
      { id: 'priceb', label: 'priceb' },
      { id: 'status', label: 'Status' },
    ],
    body: transformData(tableData),
  }
}

const transformData = (data: any[]) => {
  const transformedData = data.map((row) => ({
    id: row._id,
    timestamp: {
      contentToSort: row.t,
      contentToCSV: row.t,
      render:
        (row.t && moment(row.t / 1000000).format('YYYY DD MMM h:mm:ss a')) ||
        '-',
    },
    pair: row.pair || '-',
    exchangeA: row.exchangea || '-',
    exchangeB: row.exchangeb || '-',
    amount: {
      contentToSort: row.amount,
      contentToCSV: roundAndFormatNumber(row.amount, 2, true),
      render: row.amount
        ? addMainSymbol(roundAndFormatNumber(row.amount, 2, true), true)
        : '-',
    },
    spread: {
      contentToSort: row.spread,
      contentToCSV: roundAndFormatNumber(row.spread, 2, false),
      render: row.spread
        ? `${roundAndFormatNumber(row.spread, 2, false)} %`
        : '-',
    },
    pricea: {
      contentToSort: row.pricea,
      contentToCSV: roundAndFormatNumber(row.pricea, 8, true),
      render: row.pricea ? roundAndFormatNumber(row.pricea, 8, true) : '-',
    },
    priceb: {
      contentToSort: row.priceb,
      contentToCSV: roundAndFormatNumber(row.priceb, 8, true),
      render: row.priceb ? roundAndFormatNumber(row.priceb, 8, true) : '-',
    },
    status: row.status || '-',
  }))

  return transformedData
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
  } = props

  const { body, head, footer = [] } = putDataInTable(events)

  return (
    <ContainerGrid container style={{ position: 'relative' }}>
      <TableWithSort
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
        style={{ height: '100%', overflowY: 'scroll' }}
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
            fontSize: '1rem',
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
        {...this.props}
        {...this.state}
      />
    )
  }
}
