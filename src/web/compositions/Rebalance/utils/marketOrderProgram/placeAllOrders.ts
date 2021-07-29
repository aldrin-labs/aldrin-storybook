import { OpenOrders } from '@project-serum/serum'
import { WalletAdapter } from '@sb/dexUtils/adapters'
import { DEX_PID } from '@sb/dexUtils/config'
import { sendAndConfirmTransactionViaWallet } from '@sb/dexUtils/token/utils/send-and-confirm-transaction-via-wallet'
import { Account, Connection, PublicKey, Transaction } from '@solana/web3.js'
import BN from 'bn.js'
import { TokensMapType, TransactionType } from '../../Rebalance.types'
import { getVariablesForPlacingOrder } from './getVariablesForPlacingOrder'

export const placeOrderForEachTransaction = async ({
  wallet,
  connection,
  transactions,
  tokensMap,
  marketOrderProgram,
}: {
  wallet: WalletAdapter
  connection: Connection
  transactions: TransactionType[]
  tokensMap: TokensMapType
  marketOrderProgram: any
}) => {
  // place max 2 orders in one transaction, if need to create oo - probably one, determine it.
  //
  const Side = { Ask: { ask: {} }, Bid: { bid: {} } }

  let commonTransaction = new Transaction()
  let i = 1

  for (const transaction of transactions) {
    const isBuySide = transaction.side === 'buy'
    const [base, quote] = transaction.symbol.split('_')

    const { address: tokenAccountA, decimals: tokenADecimals } = tokensMap[base]
    const { address: tokenAccountB, decimals: tokenBDecimals } = tokensMap[quote]

    const swapAmount = transaction.amount * (10 ** tokenADecimals)
    const swapTotal = transaction.total * (10 ** tokenBDecimals)

    console.log({
      tokenAccountA,
      tokenAccountB,
      swapAmount,
      swapTotal,
      wallet
    })

    const variablesForPlacingOrder = await getVariablesForPlacingOrder({
      wallet,
      connection,
      market: transaction.loadedMarket,
      side: transaction.side,
      tokenAccountA: new PublicKey(tokenAccountA),
      tokenAccountB: new PublicKey(tokenAccountB),
    })

    // create oo if no
    if (!variablesForPlacingOrder.market.openOrders) {
      const openOrdersAccount = new Account()

      commonTransaction.add(
        await OpenOrders.makeCreateAccountTransaction(
          connection,
          transaction.loadedMarket._decoded.ownAddress,
          wallet.publicKey,
          openOrdersAccount.publicKey,
          DEX_PID
        )
      )
    }

    commonTransaction.add(
      await marketOrderProgram.instruction.swap(
        isBuySide ? Side.Bid : Side.Ask,
        new BN(isBuySide ? swapTotal : swapAmount),
        new BN(isBuySide ? swapAmount : swapTotal),
        {
          accounts: variablesForPlacingOrder,
        }
      )
    )

    // if more than 2, split by 2 max in one transaction
    if (i % 2 === 0) {
      await sendAndConfirmTransactionViaWallet(wallet, connection, commonTransaction)
      commonTransaction = new Transaction()
    }
  }

  console.log('commonTransaction', commonTransaction)

  if (transactions.length % 2 === 0) {
    return
  } else {
    // send rest transactions
    await sendAndConfirmTransactionViaWallet(wallet, connection, commonTransaction)
  }
}
