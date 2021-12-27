import { COLORS } from '@variables/variables'
import React from 'react'

import { TableWithSort } from '@sb/components'
import { useConnection } from '@sb/dexUtils/connection'
import { useWallet } from '@sb/dexUtils/wallet'

import {
  combineRunningOrdersTable,
  runningOrdersColumnNames,
} from './RunningOrders.utils'

const RunninhOrdersTable = ({
  stylesForTable,
  tableBodyStyles,
  styles,
}: {
  stylesForTable?: {}
  tableBodyStyles?: {}
  styles?: {}
}) => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const runningOrdersProcessedData = combineRunningOrdersTable({
    wallet,
    connection,
  })

  return (
    <TableWithSort
      borderBottom
      style={{
        height: '60rem',
        overflowX: 'hidden',
        backgroundColor: COLORS.blockBackground,
        width: '100%',
        borderRadius: '1.8rem',
        ...styles,
      }}
      stylesForTable={{ backgroundColor: 'inherit' }}
      tableBodyStyles={{}}
      defaultSort={{
        sortColumn: 'date',
        sortDirection: 'desc',
      }}
      withCheckboxes={false}
      tableStyles={{
        cell: {
          color: COLORS.main,
          fontSize: '1.4rem',
          fontWeight: 'bold',
          letterSpacing: '.1rem',
          backgroundColor: COLORS.blockBackground,
          boxShadow: 'none',
          height: '10rem',
          fontFamily: 'Avenir Next Light',
        },
        heading: {
          backgroundColor: '#222429',
          fontSize: '1.4rem',
          fontFamily: 'Avenir Next Light',
          height: '4rem',
        },
        tab: {
          padding: 0,
          boxShadow: 'none',
        },
        row: {
          borderBottom: `0.1rem solid ${COLORS.background}`,
        },
      }}
      emptyTableText=" "
      data={{ body: runningOrdersProcessedData }}
      columnNames={runningOrdersColumnNames}
    />
  )
}

export default RunninhOrdersTable
