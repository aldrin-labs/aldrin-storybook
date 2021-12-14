import useSWR from 'swr'
import { blob, struct, u8 } from '@solana/buffer-layout'
import { PublicKey } from '@solana/web3.js'
import { useMultiEndpointConnection } from '../../connection'
import { publicKey, uint64 } from '../../layout'
import { Vesting, VestingWithPk } from '../types'
import { VESTING_PROGRAM_ADDRESS } from '../../ProgramsMultiton/utils'
import { RefreshFunction } from '../../types'

const vestingAddress = new PublicKey(VESTING_PROGRAM_ADDRESS)

const VESTING_LAYOUT = struct([
  blob(8, 'padding'),
  publicKey('beneficiary'),
  publicKey('mint'),
  publicKey('vault'),
  publicKey('grantor'),
  uint64('outstanding'),
  uint64('startBalance'),
  uint64('createdTs', true),
  uint64('startTs', true),
  uint64('endTs', true),
  uint64('periodCount', true),
  uint64('whitelistOwned'),
  u8('nonce'),
  struct([publicKey('program'), publicKey('metadata')], 'realizor'),
])

export const useVestings = (): [VestingWithPk[], RefreshFunction] => {
  const connection = useMultiEndpointConnection()

  // Since program has only type of accounts, we don't need some filters
  const fetcher = async (): Promise<VestingWithPk[]> => {
    const data = await connection
      .getConnection()
      .getProgramAccounts(vestingAddress)

    return data
      .map((d) => {
        const decoded = VESTING_LAYOUT.decode(d.account.data) as Vesting

        return {
          ...decoded,
          vesting: d.pubkey,
        }
      })
      .filter((vesting) => vesting.createdTs > 0)
  }
  const { data, mutate } = useSWR('vestings', fetcher, {
    refreshInterval: 60_000,
  })
  return [data || [], mutate]
}
