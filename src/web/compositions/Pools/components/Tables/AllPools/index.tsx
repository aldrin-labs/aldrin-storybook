import React, { useState } from 'react'
import { compose } from 'recompose'

import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import {
  TableHeader,
  TableRow,
  Table,
  BorderButton,
  RowTd,
  TextColumnContainer,
  RowDataTdTopText,
  RowDataTdText,
  RowDataTd,
} from '@sb/compositions/Pools/components/Tables/index.styles'

import { BlockTemplate } from '../../../index.styles'

import { TokenIconsContainer, SearchInputWithLoop } from '../components/index'

import TooltipIcon from '@icons/TooltipImg.svg'

import { Text } from '@sb/compositions/Addressbook/index'
import SvgIcon from '@sb/components/SvgIcon'
import { getPoolsInfo } from '@core/graphql/queries/pools/getPoolsInfo'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { useWallet } from '@sb/dexUtils/wallet'
import { Theme } from '@material-ui/core'
import {
  FeesEarned,
  PoolInfo,
  DexTokensPrices,
} from '@sb/compositions/Pools/index.types'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { filterDataBySymbolForDifferentDeviders } from '@sb/compositions/Chart/Inputs/SelectWrapper/SelectWrapper.utils'
import { getFeesEarnedByPool } from '@core/graphql/queries/pools/getFeesEarnedByPool'
import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import AllPoolsTableComponent from './AllPoolsTable'

const AllPoolsTable = ({
  theme,
  dexTokensPrices,
  getPoolsInfoQuery,
  getFeesEarnedByPoolQuery,
  selectPool,
  // setIsCreatePoolPopupOpen,
  setIsAddLiquidityPopupOpen,
}: {
  theme: Theme
  dexTokensPrices: DexTokensPrices[]
  getPoolsInfoQuery: { getPoolsInfo: PoolInfo[] }
  getFeesEarnedByPoolQuery: { getFeesEarnedByPool: FeesEarned[] }
  selectPool: (pool: PoolInfo) => void
  // setIsCreatePoolPopupOpen: (value: boolean) => void
  setIsAddLiquidityPopupOpen: (value: boolean) => void
}) => {
  const { wallet } = useWallet()
  const [searchValue, onChangeSearch] = useState('')

  const { getFeesEarnedByPool = [] } = getFeesEarnedByPoolQuery || {
    getFeesEarnedByPool: [],
  }

  const filteredData = getPoolsInfoQuery.getPoolsInfo.filter((el) =>
    filterDataBySymbolForDifferentDeviders({
      searchValue,
      symbol: el.parsedName,
    })
  )

  const feesPerPoolMap = new Map()

  getFeesEarnedByPool.forEach((feeEarnedByPool) => {
    feesPerPoolMap.set(feeEarnedByPool.pool, feeEarnedByPool.earnedUSD)
  })

  return (
    <RowContainer>
      <AllPoolsTableComponent
        dexTokensPrices={dexTokensPrices}
        feesPerPoolMap={feesPerPoolMap}
        theme={theme}
      />
    </RowContainer>
  )
}

export default compose(
  queryRendererHoc({
    name: 'getFeesEarnedByPoolQuery',
    query: getFeesEarnedByPool,
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
    pollInterval: 60000,
  })
)(AllPoolsTable)
