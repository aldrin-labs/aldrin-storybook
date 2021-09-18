import { OpenOrders } from '@project-serum/serum'
import { WRAPPED_SOL_MINT } from '@project-serum/serum/lib/token-instructions'
import { WalletAdapter } from '@sb/dexUtils/adapters'
import { DEX_PID } from '@core/config/dex'
import {
  createSOLAccountAndClose,
  transferSOLToWrappedAccountAndClose,
} from '@sb/dexUtils/pools'
import { sendTransaction } from '@sb/dexUtils/send'
import { Account, Connection, PublicKey, Transaction } from '@solana/web3.js'
import BN from 'bn.js'
import { TokensMapType, TransactionType } from '../../Rebalance.types'
import { getVariablesForPlacingOrder } from './getVariablesForPlacingOrder'

export const placeAllOrders = async ({
  wallet,
  connection,
  transactions,
  tokensMap,
  marketOrderProgram,
  setNumberOfCompletedTransactions,
}: {
  wallet: WalletAdapter
  connection: Connection
  transactions: TransactionType[]
  tokensMap: TokensMapType
  marketOrderProgram: any
  setNumberOfCompletedTransactions: (n: number) => void
}) => {
  // place max 2 orders in one transaction, if need to create oo - probably one, determine it.
  // 2 orders + 1 create OO, or 1 order + sol token address, if no extra instructions - 2 orders
  const Side = { Ask: { ask: {} }, Bid: { bid: {} } }
  const createdOpenOrdersAccounts: { [marketName: string]: PublicKey } = {}

  let commonTransaction = new Transaction()
  let commonSigners: Account[] = []
  let i = 0

  let transactionIndex = 0

  const sendSavedTransaction = async () => {
    if (commonTransaction.instructions.length > 0) {
      const result = await sendTransaction({
        wallet,
        connection,
        transaction: commonTransaction,
        signers: commonSigners,
        focusPopup: true,
      })

      if (!result) {
        throw Error('Error confirming transaction in rebalance')
      }

      await setNumberOfCompletedTransactions(transactionIndex)

      commonTransaction = new Transaction()
      commonSigners = []
      i = 0
    }
  }

  const filteredTransactions = transactions.filter(
    (transaction) => !!transaction.amount
  )

  for (const transaction of filteredTransactions) {
    const isBuySide = transaction.side === 'buy'
    // const market = transaction.loadedMarket

    const [base, quote] = transaction.symbol.split('_')

    let {
      address: tokenAccountA,
      decimals: tokenADecimals,
      mint: tokenAMint,
    } = tokensMap[base]

    let {
      address: tokenAccountB,
      decimals: tokenBDecimals,
      mint: tokenBMint,
    } = tokensMap[quote]

    const isTransactionWithNativeSOL =
      tokenAMint === WRAPPED_SOL_MINT.toString() ||
      tokenBMint === WRAPPED_SOL_MINT.toString()

    const swapAmount = +(transaction.amount * 10 ** tokenADecimals).toFixed(0)
    const swapTotal = +(transaction.total * 10 ** tokenBDecimals).toFixed(0)


    const afterSwapTransaction = new Transaction()

    // create sol token account if native used - 160 weight
    if (isTransactionWithNativeSOL) {
      // due to exceeding the limit in case of concating 2 market orders + sol token creation
      // we need to place prev market order, because we cannot concat with current market order
      await sendSavedTransaction()

      const isSOLBaseAccount = tokenAMint === WRAPPED_SOL_MINT.toString()
      const needTransferSOL = isSOLBaseAccount
        ? transaction.side === 'sell'
        : isBuySide

      let result

      if (needTransferSOL) {
        result = await transferSOLToWrappedAccountAndClose({
          wallet,
          connection,
          amount: isSOLBaseAccount ? swapAmount : swapTotal,
        })
      } else {
        result = await createSOLAccountAndClose({
          wallet,
          connection,
        })
      }

      // change account to use from native to wrapped
      const [
        SOLTokenAddress,
        createWrappedAccountTransaction,
        createWrappedAccountTransactionSigner,
        closeAccountTransaction,
      ] = result

      // set new sol accout
      if (isSOLBaseAccount) {
        tokenAccountA = SOLTokenAddress.toString()
      } else {
        tokenAccountB = SOLTokenAddress.toString()
      }

      commonTransaction.add(createWrappedAccountTransaction)
      commonSigners.push(createWrappedAccountTransactionSigner)

      afterSwapTransaction.add(closeAccountTransaction)
    }

    const variablesForPlacingOrder = await getVariablesForPlacingOrder({
      wallet,
      connection,
      market: transaction.loadedMarket,
      vaultSigner: transaction.vaultSigner,
      openOrders: transaction.openOrders,
      side: transaction.side,
      tokenAccountA: new PublicKey(tokenAccountA),
      tokenAccountB: new PublicKey(tokenAccountB),
    })

    // check if openOrdersAccount created in prev transactions
    if (
      !variablesForPlacingOrder.market.openOrders &&
      createdOpenOrdersAccounts[transaction.symbol]
    ) {
      // use created one
      variablesForPlacingOrder.market.openOrders =
        createdOpenOrdersAccounts[transaction.symbol]
    }

    // create openOrders account if no created already
    // 32 weight uniq, in total without next transaction same keys 128
    if (!variablesForPlacingOrder.market.openOrders) {
      // 2 market orders + create 2 openOrders account => exceed limit
      if (
        !isTransactionWithNativeSOL &&
        commonTransaction.instructions.length > 1
      ) {
        await sendSavedTransaction()
      }

      const openOrdersAccount = new Account()
      variablesForPlacingOrder.market.openOrders = openOrdersAccount.publicKey
      createdOpenOrdersAccounts[transaction.symbol] =
        openOrdersAccount.publicKey

      commonSigners.push(openOrdersAccount)
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

    // 544 weight
    commonTransaction.add(
      await marketOrderProgram.instruction.swap(
        isBuySide ? Side.Bid : Side.Ask,
        new BN(isBuySide ? swapTotal : swapAmount),
        new BN(isBuySide ? swapAmount : swapTotal),
        {
          accounts: variablesForPlacingOrder,
        }
      ),
      afterSwapTransaction
    )

    i++
    transactionIndex++
    // if more than 2, split by 2 max in one transaction
    if (i % 2 === 0 || isTransactionWithNativeSOL) {
      await sendSavedTransaction()
    }
  }

  if (commonTransaction.instructions.length > 0) {
    await sendSavedTransaction()
  }
}
