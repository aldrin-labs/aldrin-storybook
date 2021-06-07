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
    const baseSwapToken: 'tokenA' | 'tokenB' = el.side === 'sell' ? 'tokenA' : 'tokenB'
    const baseAddress: string = tokensMap[base].address
    const quoteAddress: string = tokensMap[quote].address
    const baseDecimals = tokensMap[base].decimals
    const quoteDecimals = tokensMap[quote].decimals

    return {
      wallet,
      connection,
      ...(el.side === 'sell' ? {
        swapAmountIn: el.amount * (10 ** baseDecimals),
        swapAmountOut: el.total * (10 ** quoteDecimals),

        swapAmountInRaw: el.amount,
        swapAmountOutRaw: el.total,
      } : {
        swapAmountIn: el.total * (10 ** quoteDecimals),
        swapAmountOut: el.amount * (10 ** baseDecimals),

        swapAmountInRaw: el.total,
        swapAmountOutRaw: el.amount,
      }),

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
