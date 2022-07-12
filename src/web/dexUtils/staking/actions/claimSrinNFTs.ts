import { Transaction } from '@solana/web3.js'

import {
  buildClaimPlutoniansNFTsInstructions,
  ClaimNftParams,
} from '@core/solana'

import { walletAdapterToWallet } from '../../common'
import { signAndSendSingleTransaction } from '../../transactions'
import { WalletAdapter } from '../../types'

export const claimSrinNFTs = async (params: ClaimNftParams<WalletAdapter>) => {
  const wallet = walletAdapterToWallet(params.wallet)
  const { connection } = params

  const transaction = new Transaction().add(
    ...(await buildClaimPlutoniansNFTsInstructions({ ...params, wallet }))
  )

  return signAndSendSingleTransaction({
    transaction,
    wallet,
    connection,
  })
}
