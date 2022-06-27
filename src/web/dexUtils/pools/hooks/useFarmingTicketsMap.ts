import useSwr from 'swr'

import { PoolInfo } from '@sb/compositions/Pools/index.types'
import {
  FarmingTicket,
  PoolAddress,
  SnapshotQueue,
} from '@sb/dexUtils/common/types'
import { RefreshFunction } from '@sb/dexUtils/types'

import {
  getParsedUserFarmingTickets,
  addFarmingRewardsToTickets,
} from '@core/solana'
import { COMMON_REFRESH_INTERVAL } from '@core/utils/config'

import { groupBy } from '../../../utils'
import { walletAdapterToWallet } from '../../common'
import { useConnection } from '../../connection'
import { useWallet } from '../../wallet'

/**
 *
 * @param
 * @returns tickets groupped by pool address
 */

interface UseFarmingTicketsMapParams {
  pools: PoolInfo[]
  snapshotQueues: SnapshotQueue[]
}

const EMPTY_MAP = new Map<PoolAddress, FarmingTicket[]>()

export const useFarmingTicketsMap = (
  params: UseFarmingTicketsMapParams
): [Map<string, FarmingTicket[]>, RefreshFunction] => {
  const { pools, snapshotQueues } = params
  const { wallet } = useWallet()
  const connection = useConnection()
  const fetcher = async () => {
    if (!wallet.publicKey || !pools?.length || !snapshotQueues?.length) {
      return EMPTY_MAP
    }
    const w = walletAdapterToWallet(wallet)
    const allUserFarmingTickets = await getParsedUserFarmingTickets({
      wallet: w,
      connection,
    })

    const allUserFarmingTicketsWithAmountsToClaim = addFarmingRewardsToTickets({
      pools,
      farmingTickets: allUserFarmingTickets,
      snapshotQueues,
    })

    return groupBy(
      allUserFarmingTicketsWithAmountsToClaim,
      (ticket) => ticket.pool
    )
  }
  const swr = useSwr(
    `farming-tickets-${wallet.publicKey?.toString()}`,
    fetcher,
    {
      refreshInterval: COMMON_REFRESH_INTERVAL,
    }
  )

  return [swr.data || EMPTY_MAP, swr.mutate]
}
