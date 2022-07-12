import { AuthorizedWalletAdapter } from '@core/solana'

import { WalletAdapter } from '../types'

export const walletAdapterToWallet = (
  w: WalletAdapter
): AuthorizedWalletAdapter => {
  if (w.publicKey) {
    return w as any as AuthorizedWalletAdapter
  }

  throw new Error(
    'Could not create Wallet from adapter: PublicKey is not defined'
  )
}

export const NUMBER_OF_RETRIES = 5
