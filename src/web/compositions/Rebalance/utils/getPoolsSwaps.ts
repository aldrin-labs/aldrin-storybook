import { Account, PublicKey, Transaction, Connection } from '@solana/web3.js'
import { WalletAdapter } from '@sb/dexUtils/types'
import { TransactionType, TokenType, SwapsType } from '../Rebalance.types'

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
    const baseSwapToken: 'tokenA' | 'tokenB' =
      el.side === 'sell' ? 'tokenA' : 'tokenB'
    const baseAddress: string = tokensMap[base].address
    const quoteAddress: string = tokensMap[quote].address
    const baseDecimals = tokensMap[base].decimals
    const quoteDecimals = tokensMap[quote].decimals

    return {
      wallet,
      connection,
      // We need toFixed there because of FPS iee754 of js
      // e.g. 0.00002000 * (10 ** 8) -> 2000.0000000000002, while pool expects 2000
      ...(el.side === 'sell'
        ? {
            swapAmountIn: +(el.amount * 10 ** baseDecimals).toFixed(),
            swapAmountOut: +(el.total * 10 ** quoteDecimals).toFixed(),

            // swapAmountInRaw: el.amount,
            // swapAmountOutRaw: el.total,
          }
        : {
            swapAmountIn: +(el.total * 10 ** quoteDecimals).toFixed(),
            swapAmountOut: +(el.amount * 10 ** baseDecimals).toFixed(),

            // swapAmountInRaw: el.total,
            // swapAmountOutRaw: el.amount,
          }),
      tokenSwapPublicKey: new PublicKey(el.tokenSwapPublicKey),
      userTokenAccountA: new PublicKey(baseAddress),
      userTokenAccountB: new PublicKey(quoteAddress),

      tokenSwapPublicKeyRaw: el.tokenSwapPublicKey,
      baseSwapToken,
    }
  })

  return swaps
}
