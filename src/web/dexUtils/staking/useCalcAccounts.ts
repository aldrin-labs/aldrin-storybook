import useSwr from 'swr'

import {
  ProgramsMultiton,
  STAKING_PROGRAM_ADDRESS,
  getCalcAccounts,
} from '@core/solana'

import { FarmingCalc } from '../common/types'
import { useConnection } from '../connection'
import { useWallet } from '../wallet'

export const useStakingCalcAccounts = () => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const fetcher = async (): Promise<FarmingCalc[]> => {
    if (wallet.publicKey) {
      const program = ProgramsMultiton.getProgramByAddress({
        programAddress: STAKING_PROGRAM_ADDRESS,
        connection,
        wallet,
      })
      return getCalcAccounts(program, wallet.publicKey)
    }
    return []
  }

  return useSwr(
    `staking-calc-accounts-${wallet.publicKey?.toString()}`,
    fetcher
  )
}
