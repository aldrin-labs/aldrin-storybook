import { Connection, Transaction } from '@solana/web3.js'

import { TokenAccount } from '@sb/dexUtils/markets'
import { getSettleFundsTransaction } from '@sb/dexUtils/send'
import { getNotificationText } from '@sb/dexUtils/serum'
import { signAndSendTransaction } from '@sb/dexUtils/transactions'
import { WalletAdapter } from '@sb/dexUtils/types'

import { UnsettledBalance } from '../components/UnsettledBalancesTable/UnsettledBalancesTable.utils'

export const settleUnsettledBalancesForAllMarkets = async ({
  wallet,
  connection,
  unsettledBalances,
  userTokenAccountsMap,
}: {
  wallet: WalletAdapter
  connection: Connection
  unsettledBalances: UnsettledBalance[]
  userTokenAccountsMap: Map<string, TokenAccount>
}) => {
  let transaction = new Transaction()
  let signers = []
  let count = 0

  for (const unsettledBalance of unsettledBalances) {
    const { market, marketName, openOrders } = unsettledBalance
    const [baseCurrency, quoteCurrency] = marketName.split('_')

    const baseTokenAccount = userTokenAccountsMap.get(
      market.baseMintAddress.toString()
    )
    const quoteTokenAccount = userTokenAccountsMap.get(
      market.quoteMintAddress.toString()
    )

    const settleFundsTransactionResult = await getSettleFundsTransaction({
      market,
      wallet,
      connection,
      baseCurrency,
      quoteCurrency,
      openOrders,
      baseTokenAccount,
      quoteTokenAccount,
    })

    if (!settleFundsTransactionResult) continue

    const [settleFundsTransaction, settleFundsSigners] =
      settleFundsTransactionResult

    transaction.add(settleFundsTransaction)
    signers.push(...settleFundsSigners)
    count++

    if (count % 10 === 0) {
      await signAndSendTransaction({
        transaction,
        signers,
        wallet,
        connection,
        successMessage: getNotificationText({
          operationType: 'settleAllFunds',
        }),
        focusPopup: true,
      })

      transaction = new Transaction()
      signers = []
    }
  }

  if (transaction.instructions.length > 0) {
    await signAndSendTransaction({
      transaction,
      signers,
      wallet,
      connection,
      successMessage: getNotificationText({
        operationType: 'settleAllFunds',
      }),
      focusPopup: true,
    })
  }
}
