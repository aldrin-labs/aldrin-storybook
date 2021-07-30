import { roundDown } from '@core/utils/chartPageUtils'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import { OpenOrders } from '@project-serum/serum'
import { WRAPPED_SOL_MINT } from '@project-serum/serum/lib/token-instructions'
import { WalletAdapter } from '@sb/dexUtils/adapters'
import { DEX_PID } from '@sb/dexUtils/config'
import { transferSOLToWrappedAccountAndClose } from '@sb/dexUtils/pools'
import { sendAndConfirmTransactionViaWallet } from '@sb/dexUtils/token/utils/send-and-confirm-transaction-via-wallet'
import { getDecimalCount } from '@sb/dexUtils/utils'
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
}: {
  wallet: WalletAdapter
  connection: Connection
  transactions: TransactionType[]
  tokensMap: TokensMapType
  marketOrderProgram: any
}) => {
  // place max 2 orders in one transaction, if need to create oo - probably one, determine it.
  // 2 orders + 2 create OO, or 1 order + sol token address, if no extra transactions - 2 orders
  const Side = { Ask: { ask: {} }, Bid: { bid: {} } }

  let commonTransaction = new Transaction()
  let commonSigners: Account[] = []
  let i = 0

  const sendTransaction = async () => {
    if (commonTransaction.instructions.length > 0) {
      await sendAndConfirmTransactionViaWallet(
        wallet,
        connection,
        commonTransaction,
        ...commonSigners
      )

      commonTransaction = new Transaction()
      commonSigners = []
      i = 0
    }
  }

  for (const transaction of transactions) {
    const isBuySide = transaction.side === 'buy'
    const market = transaction.loadedMarket

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

    console.log({
      tokenAccountA,
      tokenAccountB,
      swapAmount,
      swapTotal,
      wallet,
    })

    const afterSwapTransaction = new Transaction()

    // create sol token account if native used - 160 weight
    if (isTransactionWithNativeSOL) {
      // due to exceeding the limit in case of concating 2 market orders + sol token creation
      // we need to place prev market order, because we cannot concat with current market order
      await sendTransaction()

      const isSOLBaseAccount = tokenAMint === WRAPPED_SOL_MINT.toString()

      const result = await transferSOLToWrappedAccountAndClose({
        wallet,
        connection,
        amount: isSOLBaseAccount ? swapAmount : swapTotal,
      })

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
      side: transaction.side,
      tokenAccountA: new PublicKey(tokenAccountA),
      tokenAccountB: new PublicKey(tokenAccountB),
    })

    // create openOrders account if no created already
    // 32 weight uniq, in total without next transaction same keys 128
    if (!variablesForPlacingOrder.market.openOrders) {
      // 2 market orders + create 2 openOrders account => exceed limit
      if (!isTransactionWithNativeSOL && commonTransaction.instructions.length > 1) {
        await sendTransaction()
      }

      const openOrdersAccount = new Account()
      variablesForPlacingOrder.market.openOrders = openOrdersAccount.publicKey

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

    console.log(
      'place order args',
      isBuySide ? Side.Bid : Side.Ask,
      isBuySide ? swapTotal : swapAmount,
      isBuySide ? swapAmount : swapTotal,
      {
        accounts: variablesForPlacingOrder,
      }
    )

    i++
    // if more than 2, split by 2 max in one transaction
    if (i % 2 === 0 || isTransactionWithNativeSOL) {
      await sendTransaction()
    }
  }

  console.log('commonTransaction', commonTransaction)

  if (commonTransaction.instructions.length > 0) {
    await sendAndConfirmTransactionViaWallet(
      wallet,
      connection,
      commonTransaction,
      ...commonSigners
    )
  }
}
