import { Transaction } from '@solana/web3.js'

import {
  buildClaimPlutoniansNFTsInstructions,
  ClaimNftParams,
} from '@core/solana'

import { walletAdapterToWallet } from '../../common'
import { signAndSendTransactions } from '../../transactions'
import { WalletAdapter } from '../../types'

export const claimSrinNFTs = async (params: ClaimNftParams<WalletAdapter>) => {
  const wallet = walletAdapterToWallet(params.wallet)
  const { connection } = params

  const ixs = await buildClaimPlutoniansNFTsInstructions({ ...params, wallet })
  const transactions = ixs.map((_) => new Transaction().add(..._))

  return signAndSendTransactions({
    transactionsAndSigners: transactions.map((tx) => ({ transaction: tx })),
    wallet,
    connection,
  })
}
