import useSwr from 'swr'

import {
  ProgramsMultiton,
  POOLS_PROGRAM_ADDRESS,
  POOLS_V2_PROGRAM_ADDRESS,
  getCalcAccounts,
} from '@core/solana'

import { groupBy } from '../../../utils'
import { FarmingCalc } from '../../common/types'
import { useConnection } from '../../connection'
import { useWallet } from '../../wallet'

/**
 *
 * @returns Calc accounts groupped by farmingState key
 */
export const useFarmingCalcAccounts = () => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const fetcher = async (): Promise<Map<string, FarmingCalc[]>> => {
    if (wallet.publicKey) {
      const programV1 = ProgramsMultiton.getProgramByAddress({
        programAddress: POOLS_PROGRAM_ADDRESS,
        connection,
        wallet,
      })
      const programV2 = ProgramsMultiton.getProgramByAddress({
        programAddress: POOLS_V2_PROGRAM_ADDRESS,
        connection,
        wallet,
      })
      const accounts = await Promise.all([
        getCalcAccounts(programV1, wallet.publicKey),
        getCalcAccounts(programV2, wallet.publicKey),
      ])

      return groupBy(accounts.flat(), (acc) => acc.farmingState.toString())
    }
    return new Map<string, FarmingCalc[]>()
  }

  return useSwr(
    `farming-calc-accounts-${wallet.publicKey?.toString()}`,
    fetcher
  )
}
