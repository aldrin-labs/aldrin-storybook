import { Theme } from '@material-ui/core'
import withTheme from '@material-ui/core/styles/withTheme'
import { COLORS } from '@variables/variables'
import React from 'react'
import { compose } from 'recompose'

import { TableWithSort } from '@sb/components'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { DexTokensPrices } from '@sb/compositions/Pools/index.types'
import { useConnection } from '@sb/dexUtils/connection'
import { PairSettings } from '@sb/dexUtils/twamm/types'
import { useWallet } from '@sb/dexUtils/wallet'

import {
  combineRunningOrdersTable,
  runningOrdersColumnNames,
} from './RunningOrders.utils'

const RunningOrdersTable = ({
  theme,
  pairSettings,
  stylesForTable,
  tableBodyStyles,
  styles,
  getDexTokensPricesQuery,
  setIsConnectWalletPopupOpen,
}: {
  theme: Theme
  pairSettings: PairSettings[]
  stylesForTable?: {}
  tableBodyStyles?: {}
  styles?: {}
  getDexTokensPricesQuery: { getDexTokensPrices: DexTokensPrices[] }
  setIsConnectWalletPopupOpen: (value: boolean) => void
}) => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const rinTokenPrice =
    getDexTokensPricesQuery?.getDexTokensPrices?.filter(
      (el) => el.symbol === 'RIN'
    )[0]?.price || 0

  const getTokenPriceByName = (name: string) => {
    return (
      getDexTokensPricesQuery?.getDexTokensPrices?.filter(
        (el) => el.symbol === name
      )[0]?.price || 0
    )
  }

  const runningOrdersProcessedData = combineRunningOrdersTable({
    wallet,
    connection,
    getDexTokensPricesQuery,
    getTokenPriceByName,
    rinTokenPrice,
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
          wallet.connected ? (
            'You have no running orders'
          ) : (
            <BtnCustom
              theme={theme}
              onClick={() => setIsConnectWalletPopupOpen(true)}
              needMinWidth={false}
              btnWidth="100%"
              height="5.5rem"
              fontSize="1.4rem"
              padding="2rem 8rem"
              borderRadius="1.1rem"
              borderColor={theme.palette.blue.serum}
              btnColor="#fff"
              backgroundColor={theme.palette.blue.serum}
              textTransform="none"
              margin="2rem 0 0 0"
              transition="all .4s ease-out"
              style={{ whiteSpace: 'nowrap' }}
            >
              Connect wallet
            </BtnCustom>
          )
        }
        data={{ body: runningOrdersProcessedData }}
        columnNames={runningOrdersColumnNames}
      />
    </>
  )
}

export default compose(withTheme())(RunningOrdersTable)
