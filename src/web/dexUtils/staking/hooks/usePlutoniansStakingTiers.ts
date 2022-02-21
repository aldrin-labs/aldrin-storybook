import { PublicKey } from '@solana/web3.js'
import useSWR from 'swr'

import { COMMON_REFRESH_INTERVAL } from '@core/utils/config'

import { useConnection } from '../../connection'
import {
  PLUTONIANS_STAKING_ADDRESS,
  ProgramsMultiton,
} from '../../ProgramsMultiton'
import { useWallet } from '../../wallet'

export const usePlutoniansStakingTiers = () => {
  const { wallet } = useWallet()
  const connection = useConnection()
  const fetcher = async () => {
    try {
      const program = ProgramsMultiton.getProgramByAddress({
        programAddress: PLUTONIANS_STAKING_ADDRESS,
        wallet,
        connection,
      })
      console.log('program: ', program)
      const accs = await connection.getProgramAccounts(
        new PublicKey(PLUTONIANS_STAKING_ADDRESS)
        // {
        //   filters: [{ dataSize: 170 }],
        // }
      )
      console.log('Accs: ', accs)
      // window.PLUTO = program
      const pools = accs.map((acc) => {
        console.log('Decode acc: ', acc.account.data, acc.pubkey.toString())
        // return program.coder.accounts.decode('StakingPool', acc.account.data)
      })
      // const pools = await
      console.log('pools: ', pools)
    } catch (e) {
      console.warn('Unable to load pools: ', e)
      return []
    }
    return []
  }
  return useSWR(`plutonians-staking-tiers`, fetcher, {
    refreshInterval: COMMON_REFRESH_INTERVAL,
  })
}
