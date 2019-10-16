import React from 'react'
import moment from 'moment'

import PortfolioSelectorPopup from '@sb/components/PortfolioSelectorPopup/PortfolioSelectorPopup'
import { roundAndFormatNumber } from '@core/utils/PortfolioTableUtils'
import { addMainSymbol } from '@sb/components'

export const accountsColors = [
  '#9A77F7',
  '#F29C38',
  '#4152AF',
  '#DEDB8E',
  '#ED6337',
  '#ABBAD1',
]

const typographyStyle = {
  fontFamily: 'DM Sans',
  textTransform: 'uppercase',
}

export const headingStyle = {
  ...typographyStyle,
  color: '#7284A0',
  fontSize: '1.2rem',
  fontWeight: 500,
  letterSpacing: '0.1rem',
  paddingTop: '1.2rem',
  paddingBottom: '1.2rem',
  borderBottom: '.1rem solid #e0e5ec',
}

export const cellStyle = {
  ...typographyStyle,
  color: '#7284A0',
  fontSize: '1.4rem',
  borderBottom: '.1rem solid #e0e5ec',
  paddingTop: '.4rem',
  paddingBottom: '.4rem',
}

const colorfulStyle = {
  fontWeight: 'bold',
  letterSpacing: '.5px',
}

const greenStyle = {
  ...colorfulStyle,
  color: '#29AC80',
}

const redStyle = {
  ...colorfulStyle,
  color: '#DD6956',
}

export const transformData = (data: any[]) => {
  return data.map((row, i) => {
    return {
      id: row._id,
      colorDot: {
        render: (
          <div
            style={{
              position: 'relative',
              left: '50%',
              backgroundColor:
                accountsColors[
                  i > accountsColors.length - 1 ? accountsColors.length - 1 : i
                ],
              borderRadius: '50%',
              width: '.8rem',
              height: '.8rem',
            }}
          />
        ),
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
            <span
              style={{
                display: 'block',
                marginBottom: '.2rem',
                fontSize: '1.3rem',
              }}
            >
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
            <span
              style={{
                display: 'block',
                marginBottom: '.2rem',
                fontSize: '1.3rem',
              }}
            >
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
      status: {
        render: (
          <span
            style={
              row.status.includes('initialized') && row.valid
                ? { ...greenStyle }
                : { ...redStyle }
            }
          >
            {row.status.includes('initialized') && row.valid
              ? 'initialized'
              : 'invalid'}
          </span>
        ),
      },
      autoRebalance: {
        render: (
          <span style={{ color: '#DD6956', fontWeight: 'bold' }}>disabled</span>
        ),
      },
      edit: {
        render: (
          <PortfolioSelectorPopup
            popupStyle={{ transform: 'translateX(-95%)' }}
            needPortal={true}
            dotsColor={'#7284A0'}
            data={row}
          />
        ),
      },
    }
  })
}

export const putDataInTable = (tableData: any[]) => {
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

export const formatValue = (value: number) => {
  return addMainSymbol(roundAndFormatNumber(value, true), true)
}

export const countAllPortfoliosValue = (allPortfolios) => {
  return allPortfolios.reduce(
    (acc, portfolio) => portfolio.portfolioValue + acc,
    0
  )
}
