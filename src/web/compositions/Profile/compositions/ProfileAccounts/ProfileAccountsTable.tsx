import React from 'react'
import moment from 'moment'

import { roundAndFormatNumber } from '@core/utils/PortfolioTableUtils'
import { addMainSymbol, TableWithSort } from '@sb/components'

const typographyStyle = {
  fontFamily: 'DM Sans',
  textTransform: 'uppercase',
}

const headingStyle = {
  ...typographyStyle,
  color: '#7284A0',
  fontSize: '1.2rem',
  fontWeight: 500,
  letterSpacing: '0.1rem',
  paddingTop: '1.2rem',
  paddingBottom: '1.2rem',
  borderBottom: '.1rem solid #e0e5ec',
}

const cellStyle = {
  ...typographyStyle,
  color: '#7284A0',
}

const putDataInTable = (tableData: any[]) => {
  if (!tableData || tableData.length === 0) {
    return { head: [], body: [] }
  }

  const body = transformData(tableData)

  return {
    head: [
      {
        id: 'colorDot',
        label: ' ',
        style: { borderTopLeftRadius: '1.5rem' },
        isSortable: false,
      },
      {
        id: 'exchange',
        label: 'exchange',
        // isNumber: true,
        isSortable: true,
      },
      { id: 'name', label: 'name', isSortable: true },
      { id: 'value', label: 'value', isSortable: true },
      {
        id: 'added',
        label: 'added',
        // isNumber: true,
        isSortable: true,
      },
      {
        id: 'lastUpdate',
        label: 'last update',
        // isNumber: true,
        isSortable: true,
      },
      { id: 'status', label: 'status', isSortable: true },
      { id: 'autoRebalance', label: 'auto-rebalance', isSortable: true },
      {
        id: 'edit',
        label: '',
        style: { borderTopRightRadius: '1.5rem' },
        isSortable: false,
      },
    ],
    body,
  }
}

const transformData = (data: any[]) => {
  return data.map((row) => {
    return {
      id: row._id,
      colorDot: {
        render: '.',
      },
      exchange: {
        render: row.exchange,
        // isNumber: true,
      },
      name: row.name,
      value: {
        render: row.value || '-',
        style: { textAlign: 'center' },
      },
      // amount: {
      //   contentToSort: row.amount,
      //   contentToCSV: roundAndFormatNumber(row.amount, 2, true),
      //   render: addMainSymbol(roundAndFormatNumber(row.amount, 2, true), true),
      // },
      added: {
        render: (
          <div>
            <span style={{ display: 'block', marginBottom: '.3rem' }}>
              {String(
                moment.unix(row.date / 1000).format('MMM, DD, YYYY')
              ).replace(/-/g, '.')}
            </span>
            <span style={{ color: '#ABBAD1' }}>
              {moment.unix(row.date / 1000).format('LT')}
            </span>
          </div>
        ),
        contentToSort: row.date,
        // isNumber: true,
      },
      lastUpdate: {
        render: (
          <div>
            <span style={{ display: 'block', marginBottom: '.3rem' }}>
              {String(
                moment.unix(row.lastUpdate).format('MMM, DD, YYYY')
              ).replace(/-/g, '.')}
            </span>
            <span style={{ color: '#ABBAD1' }}>
              {moment.unix(row.lastUpdate).format('LT')}
            </span>
          </div>
        ),
        contentToSort: row.lastUpdate,
        // isNumber: true,
      },
      status: row.status,
      autoRebalance: 'disabled',
      edit: {
        render: '...',
      },
    }
  })
}

const ProfileAccountsTable = ({ accounts }) => {
  console.log('accs', accounts)
  const { body, head } = putDataInTable(accounts)

  return (
    <TableWithSort
      columnNames={head}
      data={{ body }}
      padding="dense"
      id="ProfileAccountsTable"
      emptyTableText="No accounts"
      style={{
        height: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        borderRadius: '1.5rem',
      }}
      tableStyles={{
        heading: {
          ...headingStyle,
        },
        cell: {
          ...cellStyle,
        },
      }}
    />
  )
}

export default ProfileAccountsTable
