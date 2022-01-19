import { PublicKey } from '@solana/web3.js'
import BN from 'bn.js'
import useSWR from 'swr'

import { useConnection } from '../../connection'
import {
  BORROW_LENDING_PROGRAM_ADDRESS,
  ProgramsMultiton,
} from '../../ProgramsMultiton'
import { useWallet } from '../../wallet'
import { Obligation, ObligationInner, Reserve, U192 } from '../types'
import { u192ToBN } from '../U192-converting'

const USER_KEY_OFFSET = 1 + 16 + 32

const reserve192ToBn = (reserve: Reserve<U192>): Reserve<BN> => {
  if (reserve.collateral) {
    return {
      collateral: {
        ...reserve.collateral,
        inner: {
          ...reserve.collateral.inner,
          marketValue: u192ToBN(reserve.collateral.inner.marketValue),
        },
      },
    }
  }
  if (reserve.liquidity) {
    return {
      liquidity: {
        inner: {
          ...reserve.liquidity.inner,
          cumulativeBorrowRate: u192ToBN(
            reserve.liquidity.inner.cumulativeBorrowRate
          ),
          borrowedAmount: u192ToBN(reserve.liquidity.inner.borrowedAmount),
          marketValue: u192ToBN(reserve.liquidity.inner.marketValue),
        },
      },
    }
  }
  return { empty: {} }
}

export const useUserObligations = () => {
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

    const accounts = await connection.getProgramAccounts(
      new PublicKey(BORROW_LENDING_PROGRAM_ADDRESS),
      {
        filters: [
          {
            memcmp: {
              offset: USER_KEY_OFFSET,
              bytes: wallet.publicKey.toString(),
            },
          },
          { dataSize: program.account.obligation.size },
        ],
      }
    )

    return accounts
      .map((acc) => {
        try {
          const decoded = program.coder.accounts.decode<ObligationInner>(
            'Obligation',
            acc.account.data
          )
          console.log('decoded obligation: ', decoded)
          return {
            ...decoded,
            allowedBorrowValue: u192ToBN(decoded.allowedBorrowValue),
            borrowedValue: u192ToBN(decoded.borrowedValue),
            depositedValue: u192ToBN(decoded.depositedValue),
            unhealthyBorrowValue: u192ToBN(decoded.unhealthyBorrowValue),
            reserves: decoded.reserves.map(reserve192ToBn),
            obligation: acc.pubkey,
          }
        } catch (e) {
          console.warn('Unable to decode obligation: ', e)
          return null
        }
      })
      .filter((acc): acc is Obligation => !!acc)
  }

  return useSWR(`obligations-${wallet.publicKey?.toString()}`, fetcher)
}
