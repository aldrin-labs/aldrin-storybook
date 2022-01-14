import useSwr from 'swr'

import { getCalcAccounts } from '../common/getCalcAccountsForWallet'
import { FarmingCalc } from '../common/types'
import { useConnection } from '../connection'
import { ProgramsMultiton, STAKING_PROGRAM_ADDRESS } from '../ProgramsMultiton'
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
    fetcher,
    {
      refreshInterval: 15 * 60_000,
    }
  )
}
