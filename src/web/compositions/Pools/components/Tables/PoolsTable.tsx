import React, { useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { DataTable, NoDataBlock } from '@sb/components/DataTable'
import { useFarmersAccountInfo, useFarmsInfo } from '@sb/dexUtils/farming'
import { getTokenName, getTokenNameByMintAddress } from '@sb/dexUtils/markets'
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
  } = props

  const tokenMap = useTokenInfos()
  const [columns] = useState(mergeColumns(addColumns))

  const { data: calcAccounts } = useFarmingCalcAccounts()

  const wallet = useWallet()
  const history = useHistory()
  const { data: farms } = useFarmsInfo()
  const { data: farmers } = useFarmersAccountInfo()

  const [vestings] = useVestings()

  const vestingsByMint = toMap(vestings, (v) => v.mint.toBase58())

  const walletPk = wallet.wallet.publicKey?.toBase58() || ''

  const generateTestId = (extraData?: string) => {
    return `amm-pools-table-${suffix}-${extraData}`
  }

  const filterPools = ({
    tokenA,
    tokenB,
  }: {
    tokenA: string
    tokenB: string
  }) => {
    const tokenAName = getTokenName({
      address: tokenA,
      tokensInfoMap: tokenMap,
    })
    const tokenBName = getTokenName({
      address: tokenB,
      tokensInfoMap: tokenMap,
    })
    return (
      symbolIncludesSearch(`${tokenAName}_${tokenBName}`, searchValue) ||
      symbolIncludesSearch(
        `${getTokenNameByMintAddress(tokenA)}_${getTokenNameByMintAddress(
          tokenB
        )}`,
        searchValue
      )
    )
  }

  const data = useMemo(
    () =>
      pools
        .filter((pool) =>
          filterPools({ tokenA: pool.tokenA, tokenB: pool.tokenB })
        )
        .map((pool) =>
          preparePoolTableCell({
            pool,
            tokenPrices,
            prepareMore,
            walletPk,
            vestings: vestingsByMint,
            tokenMap,
            farms,
            farmers,
          })
        ),
    [pools, tokenPrices, walletPk, calcAccounts, vestingsByMint, tokenMap]
  )

  return (
    <DataTable
      name={`amm_pools_table_${suffix}`}
      generateTestId={generateTestId}
      data={data}
      columns={columns}
      onRowClick={({ rowData }) => {
        const tokenAName = getTokenName({
          address: rowData.extra.tokenA,
          tokensInfoMap: tokenMap,
        })
        const tokenBName = getTokenName({
          address: rowData.extra.tokenB,
          tokensInfoMap: tokenMap,
        })

        history.push(`/pools/${tokenAName}_${tokenBName}`)
      }}
      noDataText={
        noDataText || (
          <NoDataBlock justifyContent="center">No pools available.</NoDataBlock>
        )
      }
    />
  )
}
