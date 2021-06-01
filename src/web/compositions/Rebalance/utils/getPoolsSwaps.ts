import { Account, PublicKey, Transaction, Connection } from '@solana/web3.js'
import { WalletAdapter } from '@sb/dexUtils/types'
import {
  TransactionType,
  TokenType,
  SwapsType,
} from '../Rebalance.types'


export const getPoolsSwaps = ({
  wallet,
  connection,
  transactionsList,
  tokensMap,
}: {
  wallet: WalletAdapter
  connection: Connection
  transactionsList: TransactionType[]
  tokensMap: { [key: string]: TokenType }
}): SwapsType[] => {
  const swaps = transactionsList.map((el) => {
    const [base, quote] = el.symbol.split('_')
    const baseSwapToken: 'tokenA' | 'tokenB'  = el.side === 'sell' ? 'tokenA' : 'tokenB'

    const baseAddress: string = tokensMap[base].address
    const quoteAddress: string = tokensMap[quote].address

    return {
      wallet,
      connection,
      swapAmountIn: el.amount * 10 ** 8,
      swapAmountOut: el.total * 10 ** 8,
      tokenSwapPublicKey: new PublicKey(el.tokenSwapPublicKey),
      userTokenAccountA: new PublicKey(baseAddress),
      userTokenAccountB: new PublicKey(quoteAddress),

      tokenSwapPublicKeyRaw: el.tokenSwapPublicKey,
      userTokenAccountARaw: tokensMap[base].address,
      userTokenAccountBRaw: tokensMap[quote].address,
      baseSwapToken: baseSwapToken,
    }
  })

  return swaps
}
