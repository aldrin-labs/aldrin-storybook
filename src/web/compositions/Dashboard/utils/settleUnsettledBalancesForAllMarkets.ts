import { TokenAccount } from '@sb/dexUtils/markets'
import { getSettleFundsTransaction, sendTransaction } from '@sb/dexUtils/send'
import { WalletAdapter } from '@sb/dexUtils/types'
import { Connection, Transaction } from '@solana/web3.js'
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
      await sendTransaction({
        transaction,
        signers,
        wallet,
        connection,
        operationType: 'settleAllFunds',
        focusPopup: true,
      })

      transaction = new Transaction()
      signers = []
    }
  }

  if (transaction.instructions.length > 0) {
    await sendTransaction({
      transaction,
      signers,
      wallet,
      connection,
      operationType: 'settleAllFunds',
      focusPopup: true,
    })
  }
}
