import { Program, ProgramAccount } from 'anchor024'
import useSWR from 'swr'

import { PLUTONIANS_STAKING_ADDRESS, ProgramsMultiton } from '@core/solana'

import { toMap } from '../../../utils'
import { useConnection } from '../../connection'
import { useWallet } from '../../wallet'
import { SRinUserAccount } from './types'

const USER_KEY_OFFSET = 8

// Returns staking accounts mapped by tier
export const useSrinStakingAccounts = () => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const fetcher = async () => {
    if (!wallet.publicKey) {
      return new Map<string, ProgramAccount<SRinUserAccount>>()
    }
    const program = ProgramsMultiton.getProgramByAddress({
      programAddress: PLUTONIANS_STAKING_ADDRESS,
      wallet,
      connection,
    }) as any as Program // TODO:

    const accounts = await (program.account.userStakingAccount.all([
      {
        memcmp: {
          offset: USER_KEY_OFFSET,
          bytes: wallet.publicKey.toString(),
        },
      },
    ]) as Promise<any> as Promise<ProgramAccount<SRinUserAccount>[]>)

    return toMap(accounts, (acc) => acc.account.stakingTier.toString())
  }

  return useSWR(
    `srin-staking-accounts-${wallet.publicKey?.toString()}`,
    fetcher
  )
}
