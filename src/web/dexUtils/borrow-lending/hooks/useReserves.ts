import { PublicKey } from '@solana/web3.js'
import useSWR from 'swr'

import { useConnection } from '../../connection'
import {
  BORROW_LENDING_PROGRAM_ADDRESS,
  ProgramsMultiton,
} from '../../ProgramsMultiton'
import { useWallet } from '../../wallet'
import { Reserve, ReserveDecoded } from '../types'
import { u192ToBN } from '../U192-converting'

export const useReserves = () => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const fetcher = async (): Promise<Reserve[] | null> => {
    if (!wallet.publicKey) {
      return null
    }

    const program = ProgramsMultiton.getProgramByAddress({
      wallet,
      connection,
      programAddress: BORROW_LENDING_PROGRAM_ADDRESS,
    })

    const accounts = await connection.getProgramAccounts(
      new PublicKey(BORROW_LENDING_PROGRAM_ADDRESS),
      {
        filters: [{ dataSize: 408 }],
      }
    )

    return accounts.map((acc) => {
      const decoded = program.coder.accounts.decode<ReserveDecoded>(
        'Reserve',
        acc.account.data
      )
      return {
        ...decoded,
        reserve: acc.pubkey,
        config: {
          ...decoded.config,
          fees: {
            ...decoded.config.fees,
            borrowFee: u192ToBN(decoded.config.fees.borrowFee),
            flashLoanFee: u192ToBN(decoded.config.fees.flashLoanFee),
          },
        },
        liquidity: {
          ...decoded.liquidity,
          borrowedAmount: u192ToBN(decoded.liquidity.borrowedAmount),
          cumulativeBorrowRate: u192ToBN(
            decoded.liquidity.cumulativeBorrowRate
          ),
          marketPrice: u192ToBN(decoded.liquidity.marketPrice),
        },
      }
    })
  }

  return useSWR(`borrow-reserves`, fetcher)
}
