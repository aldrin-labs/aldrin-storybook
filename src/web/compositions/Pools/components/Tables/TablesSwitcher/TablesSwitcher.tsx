import React, { useEffect, useState } from 'react'

import { Theme } from '@material-ui/core'

import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BlockTemplate } from '@sb/compositions/Pools/index.styles'
import { SearchInputWithLoop } from '../components'
import { getPoolsInfo } from '@core/graphql/queries/pools/getPoolsInfo'
import { compose } from 'recompose'
import { queryRendererHoc } from '@core/components/QueryRenderer'

import AllPoolsTable from '../AllPools/AllPoolsTable'
import UserLiquitidyTable from '../UserLiquidity/UserLiquidityTable'

import {
  DexTokensPrices,
  FeesEarned,
  PoolInfo,
} from '@sb/compositions/Pools/index.types'
import { getDexTokensPrices } from '@core/graphql/queries/pools/getDexTokensPrices'
import { AddLiquidityPopup, WithdrawalPopup } from '../../Popups'
import { useWallet } from '@sb/dexUtils/wallet'
import { useConnection } from '@sb/dexUtils/connection'
import { getAllTokensData } from '@sb/compositions/Rebalance/utils'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { TableModeButton } from './TablesSwitcher.styles'
import { StakePopup } from '../../Popups/Staking/StakePopup'
import { UnstakePopup } from '../../Popups/Unstaking/UnstakePopup'
import {
  FarmingTicket,
  getParsedUserFarmingTickets,
} from '@sb/dexUtils/pools/endFarming'
import { getFeesEarnedByAccount } from '@core/graphql/queries/pools/getFeesEarnedByAccount'
import { withPublicKey } from '@core/hoc/withPublicKey'
import { addAmountToClaimForFarmingTickets } from '@sb/dexUtils/pools/addAmountToClaimForFarmingTickets'

const TablesSwitcher = ({
  theme,
  getPoolsInfoQuery: { getPoolsInfo = [] },
  getDexTokensPricesQuery: { getDexTokensPrices = [] },
  getFeesEarnedByAccountQuery: { getFeesEarnedByAccount = [] },
}: {
  theme: Theme
  getPoolsInfoQuery: { getPoolsInfo: PoolInfo[] }
  getDexTokensPricesQuery: { getDexTokensPrices: DexTokensPrices[] }
  getFeesEarnedByAccountQuery: { getFeesEarnedByAccount: FeesEarned[] }
}) => {
  const [allTokensData, setAllTokensData] = useState<TokenInfo[]>([])

  const [farmingTicketsMap, setFarmingTicketsMap] = useState<
    Map<string, FarmingTicket[]>
  >(new Map())

  const [selectedPool, selectPool] = useState<PoolInfo | null>(null)
  const [searchValue, onChangeSearch] = useState('')
  const [selectedTable, setSelectedTable] = useState<'all' | 'userLiquidity'>(
    'all'
  )

  const [isAddLiquidityPopupOpen, setIsAddLiquidityPopupOpen] = useState(false)
  const [isWithdrawalPopupOpen, setIsWithdrawalPopupOpen] = useState(false)
  const [isUnstakePopupOpen, setIsUnstakePopupOpen] = useState(false)
  const [isStakePopupOpen, setIsStakePopupOpen] = useState(false)

  const [
    refreshAllTokensDataCounter,
    setRefreshAllTokensDataCounter,
  ] = useState<number>(0)

  const { wallet } = useWallet()
  const connection = useConnection()

  const refreshAllTokensData = () =>
    setRefreshAllTokensDataCounter(refreshAllTokensDataCounter + 1)

  useEffect(() => {
    const fetchData = async () => {
      const allTokensData = await getAllTokensData(wallet.publicKey, connection)
      const allUserFarmingTickets = await getParsedUserFarmingTickets({
        wallet,
        connection,
      })

      const allUserFarmingTicketsWithAmountToClaim = await addAmountToClaimForFarmingTickets(
        {
          pools: getPoolsInfo,
          wallet,
          connection,
          allUserFarmingTickets,
        }
      )

      const farmingTicketsMap = allUserFarmingTicketsWithAmountToClaim.reduce(
        (acc, farmingTicket) => {
          const { pool } = farmingTicket

          if (acc.has(pool)) {
            acc.set(pool, [...acc.get(pool), farmingTicket])
          } else {
            acc.set(pool, [farmingTicket])
          }

          return acc
        },
        new Map()
      )

      await setAllTokensData(allTokensData)
      await setFarmingTicketsMap(farmingTicketsMap)

      const getFarmingTokenMintsMap = async (pools) => {
    
        const farmingTokenVaults = pools.reduce((acc, pool) => {
          const isFarmingForPoolExists = pool.farming && Array.isArray(pool.farming) && pool.farming.length
    
          if (isFarmingForPoolExists) {
            pool.farming.forEach((farming) => {
              acc.push(farming.farmingTokenVault)
            })
          }
          
          return acc
        }, [])
    
        const farmingTokenVaultsData = await connection._rpcRequest('getMultipleAccounts', [farmingTokenVaults.map(el => el.toString()), { encoding: 'jsonParsed' }])
    
        const farmingTokenMintsMap = farmingTokenVaultsData.result.value.reduce((acc, el) => {
          console.log('el', el)
          // const infoData = el.data.parsed.info
          // const mintAuthority = infoData.mintAuthority
          // const supply = infoData.supply
    
          // acc[mintAuthority] = supply
    
          return acc
        }, {})
    
        return farmingTokenMintsMap
    }

    const map = getFarmingTokenMintsMap(getPoolsInfo)
    
    }

    if (!!wallet?.publicKey) {
      fetchData()
    }
  }, [wallet?.publicKey, refreshAllTokensDataCounter])

  const isAllPoolsSelected = selectedTable === 'all'

  const dexTokensPricesMap = getDexTokensPrices.reduce(
    (acc, tokenPrice) => acc.set(tokenPrice.symbol, tokenPrice),
    new Map()
  )

  const allTokensDataMap = allTokensData.reduce(
    (acc, tokenData) => acc.set(tokenData.mint, tokenData),
    new Map()
  )

  const earnedFeesInPoolForUserMap = getFeesEarnedByAccount.reduce(
    (acc, feesEarned) => acc.set(feesEarned.pool, feesEarned.earnedUSD),
    new Map()
  )

  console.log('getPoolsInfo', getPoolsInfo)

  return (
    <RowContainer>
      <BlockTemplate
        width={'100%'}
        height={'auto'}
        style={{ marginTop: '2rem', borderRadius: '1.6rem' }}
        align={'start'}
        theme={theme}
        direction={'column'}
        justify={'end'}
      >
        <RowContainer padding="2rem" justify={'space-between'} align="center">
          <Row>
            <TableModeButton
              theme={theme}
              isActive={isAllPoolsSelected}
              onClick={() => setSelectedTable('all')}
            >
              All Pools
            </TableModeButton>
            <TableModeButton
              theme={theme}
              isActive={!isAllPoolsSelected}
              onClick={() => setSelectedTable('userLiquidity')}
            >
              Your liquidity
            </TableModeButton>
          </Row>
          <Row
            style={{ flexWrap: 'nowrap' }}
            justify={'flex-end'}
            width={'calc(100% / 3)'}
          >
            <SearchInputWithLoop
              searchValue={searchValue}
              onChangeSearch={onChangeSearch}
              placeholder={'Search...'}
            />
          </Row>
        </RowContainer>

        {selectedTable === 'all' ? (
          <AllPoolsTable
            theme={theme}
            searchValue={searchValue}
            poolsInfo={getPoolsInfo}
            allTokensDataMap={allTokensDataMap}
            dexTokensPricesMap={dexTokensPricesMap}
            farmingTicketsMap={farmingTicketsMap}
            earnedFeesInPoolForUserMap={earnedFeesInPoolForUserMap}
            selectPool={selectPool}
            setIsAddLiquidityPopupOpen={setIsAddLiquidityPopupOpen}
            setIsWithdrawalPopupOpen={setIsWithdrawalPopupOpen}
            setIsStakePopupOpen={setIsStakePopupOpen}
            setIsUnstakePopupOpen={setIsUnstakePopupOpen}
          />
        ) : (
          <UserLiquitidyTable
            allTokensDataMap={allTokensDataMap}
            poolsInfo={getPoolsInfo}
            theme={theme}
            searchValue={searchValue}
            dexTokensPricesMap={dexTokensPricesMap}
            farmingTicketsMap={farmingTicketsMap}
            earnedFeesInPoolForUserMap={earnedFeesInPoolForUserMap}
            selectPool={selectPool}
            setIsAddLiquidityPopupOpen={setIsAddLiquidityPopupOpen}
            setIsWithdrawalPopupOpen={setIsWithdrawalPopupOpen}
            setIsStakePopupOpen={setIsStakePopupOpen}
            setIsUnstakePopupOpen={setIsUnstakePopupOpen}
          />
        )}

        {selectedPool && isAddLiquidityPopupOpen && (
          <AddLiquidityPopup
            theme={theme}
            dexTokensPricesMap={dexTokensPricesMap}
            selectedPool={selectedPool}
            allTokensData={allTokensData}
            close={() => setIsAddLiquidityPopupOpen(false)}
            open={isAddLiquidityPopupOpen}
            refreshAllTokensData={refreshAllTokensData}
          />
        )}

        {selectedPool && isWithdrawalPopupOpen && (
          <WithdrawalPopup
            theme={theme}
            selectedPool={selectedPool}
            dexTokensPricesMap={dexTokensPricesMap}
            allTokensData={allTokensData}
            close={() => setIsWithdrawalPopupOpen(false)}
            open={isWithdrawalPopupOpen}
            refreshAllTokensData={refreshAllTokensData}
          />
        )}

        {selectedPool && isStakePopupOpen && (
          <StakePopup
            theme={theme}
            open={isStakePopupOpen}
            pool={selectedPool}
            close={() => setIsStakePopupOpen(false)}
            allTokensData={allTokensData}
            refreshAllTokensData={refreshAllTokensData}
          />
        )}

        {selectedPool && isUnstakePopupOpen && (
          <UnstakePopup
            theme={theme}
            open={isUnstakePopupOpen}
            pool={selectedPool}
            close={() => setIsUnstakePopupOpen(false)}
            allTokensData={allTokensData}
            refreshAllTokensData={refreshAllTokensData}
          />
        )}
      </BlockTemplate>
    </RowContainer>
  )
}

export default compose(
  withPublicKey,
  queryRendererHoc({
    query: getDexTokensPrices,
    name: 'getDexTokensPricesQuery',
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
    pollInterval: 60000,
  }),
  queryRendererHoc({
    name: 'getPoolsInfoQuery',
    query: getPoolsInfo,
    fetchPolicy: 'cache-and-network',
    pollInterval: 60000,
  }),
  queryRendererHoc({
    query: getFeesEarnedByAccount,
    name: 'getFeesEarnedByAccountQuery',
    variables: (props) => ({
      account: props.wallet.publicKey?.toString() || '',
    }),
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
  })
)(TablesSwitcher)
