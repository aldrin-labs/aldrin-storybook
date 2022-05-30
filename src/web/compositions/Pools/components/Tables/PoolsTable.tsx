import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

import { DataTable, NoDataBlock } from '@sb/components/DataTable'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { useFarmingCalcAccounts } from '@sb/dexUtils/pools/hooks'
import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'
import { useVestings } from '@sb/dexUtils/vesting'
import { useWallet } from '@sb/dexUtils/wallet'
import { toMap } from '@sb/utils'

import { PoolsTableProps } from './types'
import {
  symbolIncludesSearch,
  preparePoolTableCell,
  mergeColumns,
} from './utils'

export const PoolsTable: React.FC<PoolsTableProps> = (props) => {
  const {
    pools,
    tokenPrices,
    addColumns,
    searchValue = '',
    prepareCell: prepareMore,
    suffix,
    noDataText,
    farmingTicketsMap,
  } = props

  const tokenMap = useTokenInfos()
  const [columns] = useState(mergeColumns(addColumns))

  const { data: calcAccounts } = useFarmingCalcAccounts()

  const wallet = useWallet()
  const history = useHistory()

  const [vestings] = useVestings()

  const vestingsByMint = toMap(vestings, (v) => v.mint.toBase58())

  const walletPk = wallet.wallet.publicKey?.toBase58() || ''

  const data = pools
    .filter((pool) =>
      symbolIncludesSearch(
        `${getTokenNameByMintAddress(pool.tokenA)}_${getTokenNameByMintAddress(
          pool.tokenB
        )}`,
        searchValue
      )
    )
    .map((pool) =>
      preparePoolTableCell({
        pool,
        tokenPrices,
        prepareMore,
        walletPk,
        calcAccounts,
        vestings: vestingsByMint,
        farmingTicketsMap,
        tokenMap,
      })
    )

  return (
    <DataTable
      name={`amm_pools_table_${suffix}`}
      data={data}
      columns={columns}
      onRowClick={({ rowData }) =>
        history.push(`/pools/${rowData.extra.parsedName}`)
      }
      noDataText={
        noDataText || (
          <NoDataBlock justifyContent="center">No pools available.</NoDataBlock>
        )
      }
    />
  )
}
