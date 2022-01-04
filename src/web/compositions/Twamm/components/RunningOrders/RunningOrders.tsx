import { COLORS } from '@variables/variables'
import React, {useState} from 'react'

import { TableWithSort } from '@sb/components'
import { DexTokensPrices } from '@sb/compositions/Pools/index.types'
import { useConnection } from '@sb/dexUtils/connection'
import { useWallet } from '@sb/dexUtils/wallet'

import {
  combineRunningOrdersTable,
  runningOrdersColumnNames,
} from './RunningOrders.utils'
import {FeedbackPopup} from "@sb/compositions/Chart/components/UsersFeedbackPopup";
import {StopOrderPopup} from "@sb/compositions/Twamm/components/StopOrderPopup/StopOrderPopup";
import {PairSettings} from "@sb/dexUtils/twamm/types";

const RunningOrdersTable = ({
  pairSettings,
  stylesForTable,
  tableBodyStyles,
  styles,
  getDexTokensPricesQuery,
}: {
  pairSettings: PairSettings[]
  stylesForTable?: {}
  tableBodyStyles?: {}
  styles?: {}
  getDexTokensPricesQuery: { getDexTokensPrices: DexTokensPrices[] },
}) => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const rinTokenPrice =
    getDexTokensPricesQuery?.getDexTokensPrices?.filter(
      (el) => el.symbol === 'RIN'
    )[0]?.price || 0

  console.log('rinTokenPrice', rinTokenPrice)

  const getTokenPriceByName = (name: string) => {
    return getDexTokensPricesQuery?.getDexTokensPrices?.filter(
      (el) => el.symbol === name
    )[0]?.price || 0
  }

  const runningOrdersProcessedData = combineRunningOrdersTable({
    wallet,
    connection,
    getDexTokensPricesQuery,
    getTokenPriceByName,
    rinTokenPrice
  })

  return (
    <>
      <TableWithSort
        borderBottom
        style={{
          height: '46rem',
          overflowX: 'hidden',
          backgroundColor: COLORS.blockBackground,
          width: '100%',
          borderRadius: '1.8rem',
          position: 'relative',
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
        emptyTableText={
          wallet.connected ? 'You have no running orders' : 'Connect wallet'
        }
        data={{ body: runningOrdersProcessedData }}
        columnNames={runningOrdersColumnNames}
      />
    </>
  )
}

export default RunningOrdersTable
