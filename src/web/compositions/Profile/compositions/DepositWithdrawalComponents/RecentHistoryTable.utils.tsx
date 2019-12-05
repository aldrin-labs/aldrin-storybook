import React from 'react'
import copy from 'clipboard-copy'
import moment from 'moment'
import { Theme, Grid } from '@material-ui/core'

import copyIcon from '@icons/copy.svg'

import SvgIcon from '@sb/components/SvgIcon'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import { ActionType, PortfolioAction } from './RecentHistoryTable.types'

export const columnNames = [
  {
    isNumber: false,
    label: 'Status',
    id: 'status',
    isSortable: true,
  },
  { isNumber: false, label: 'Coin', id: 'coin', isSortable: true },
  { isNumber: true, label: 'Amount', id: 'amount', isSortable: true },
  { isNumber: true, label: 'Date', id: 'date', isSortable: true },
  { isNumber: true, label: 'Address', id: 'address', isSortable: true },
  { isNumber: false, label: 'Txid', id: 'txId', isSortable: true },
]

export const combineRecentHistoryTable = (
  transactionsData: PortfolioAction,
  isDepositPage: boolean,
  theme?: Theme
) => {
  if (!transactionsData.trades && !Array.isArray(transactionsData.trades)) {
    return []
  }

  const getStatusColor = (status: string) => (status === 'ok' ? 'green' : 'green')
  const getStatusText = (status: string) => status === 'ok' ? 'Completed' : 'In Process'

  const filtredTransactions = transactionsData.trades
  .filter(el => isDepositPage ? el.type === 'deposit' : el.type === 'withdrawal')

  const processedOpenOrdersData = filtredTransactions.map(
    (el: ActionType, i: number) => {
      const { _id, type, base, amount, date, status, address, txId } = el

      const statusColor = getStatusColor(status)

      return {
        id: _id,
        status: {
        render: <Grid style={{ color: statusColor }}>{getStatusText(status)}</Grid>,
          contentToSort: status,
        },
        coin: base,
        amount: stripDigitPlaces(amount, 8),
        date: {
          render: (
            <div>
              <span style={{ display: 'block' }}>
                {String(moment(date * 1000).format('DD-MM-YYYY')).replace(/-/g, '.')}
              </span>
              <span style={{ color: '#7284A0' }}>
                {moment(date * 1000).format('LT')}
              </span>
            </div>
          ),
          style: { whiteSpace: 'nowrap' },
          contentToSort: date,
        },
        address: {
          render: (
            <Grid container direction="column">
              <Grid item>{address}</Grid>
              <Grid item style={{ cursor: 'pointer', paddingLeft: '0.1rem' }}>
                <SvgIcon src={copyIcon} width="11px" height="auto" onClick={() => copy(address)} />
              </Grid>
            </Grid>
          ),
          contentToSort: address,
        },
        txId: {
          render: (
            <Grid container direction="column">
              <Grid item>{txId}</Grid>
              <Grid item style={{ cursor: 'pointer', paddingLeft: '0.1rem' }}>
                <SvgIcon src={copyIcon} width="12px" height="auto" onClick={() => copy(txId)} />
              </Grid>
            </Grid>
          ),
          contentToSort: txId,
        }
      }
    }
  )

  return processedOpenOrdersData
}
