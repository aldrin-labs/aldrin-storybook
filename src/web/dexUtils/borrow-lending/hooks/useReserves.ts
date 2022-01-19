import { PublicKey } from '@solana/web3.js'
import useSWR from 'swr'

import { useConnection } from '../../connection'
import {
  BORROW_LENDING_PROGRAM_ADDRESS,
  ProgramsMultiton,
} from '../../ProgramsMultiton'
import { useWallet } from '../../wallet'
import { Obligation } from '../types'

export const useReserves = () => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const fetcher = async (): Promise<Obligation[] | null> => {
    if (!wallet.publicKey) {
      return null
    }

    const program = ProgramsMultiton.getProgramByAddress({
      wallet,
      connection,
      programAddress: BORROW_LENDING_PROGRAM_ADDRESS,
    })

    console.log('size: ', program.account.reserve.size)
    const accounts = await connection.getProgramAccounts(
      new PublicKey(BORROW_LENDING_PROGRAM_ADDRESS),
      {
        filters: [{ dataSize: program.account.reserve.size }],
      }
    )

    return accounts
      .map((acc) => {
        try {
          const decoded = program.coder.accounts.decode(
            'Reserve',
            acc.account.data
          )
          console.log('decoded: ', decoded)
          return decoded
        } catch (e) {
          console.warn('Unable to decode reserve: ', e)
          return null
        }
      })
      .filter((acc) => !!acc)
  }

  return useSWR(`borrow-reserves`, fetcher)
}
