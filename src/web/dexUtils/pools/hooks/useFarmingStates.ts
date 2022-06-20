import { useCallback } from 'react'
import useSwr from 'swr'

import { BlockchainFarmingState } from '@sb/dexUtils/common/types'
import { RefreshFunction } from '@sb/dexUtils/types'

import {
  ProgramsMultiton,
  POOLS_PROGRAM_ADDRESS,
  POOLS_V2_PROGRAM_ADDRESS,
} from '@core/solana'

import { groupBy } from '../../../utils'
import { useConnection } from '../../connection'
import { useWallet } from '../../wallet'

export const useFarmingStates = (): [
  Map<string, BlockchainFarmingState[]>, // Farming states groupped by pool PK
  RefreshFunction
] => {
  // TODO: rewrite layout parsing without wallet usage,
  // move connection out of context
  const { wallet } = useWallet()
  const connection = useConnection()

  const fetcher = useCallback(async () => {
    const program = ProgramsMultiton.getProgramByAddress({
      wallet,
      connection,
      programAddress: POOLS_PROGRAM_ADDRESS,
    })

    const programv2 = ProgramsMultiton.getProgramByAddress({
      wallet,
      connection,
      programAddress: POOLS_V2_PROGRAM_ADDRESS,
    })

    const [farmingStates, v2FarmingStates] = await Promise.all([
      program.account.farmingState.all(),
      programv2.account.farmingState.all(),
    ])

    const allStates: BlockchainFarmingState[] = [
      ...farmingStates,
      ...v2FarmingStates,
    ].map((p) => {
      const state = p.account as BlockchainFarmingState
      return {
        ...state,
        farmingState: p.publicKey,
      }
    })

    return groupBy(allStates, (state) => state.pool.toBase58())
  }, [])

  const states = useSwr('ammmfarmingstates', fetcher)

  return [
    states.data || new Map<string, BlockchainFarmingState[]>(),
    states.mutate,
  ]
}
