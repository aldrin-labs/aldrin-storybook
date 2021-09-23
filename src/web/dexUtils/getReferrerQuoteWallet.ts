import { PublicKey } from '@solana/web3.js'

import { ALL_TOKENS_MINTS_MAP, REFFERER_ACCOUNT_ADDRESSES } from './markets'

export const getReferrerQuoteWallet = ({
  supportsReferralFees,
  quoteMintAddress,
}: {
  supportsReferralFees: boolean
  quoteMintAddress: PublicKey
}): PublicKey | null => {
  let referrerQuoteWallet: PublicKey | null = null

  if (supportsReferralFees) {
    const tokenName: string = ALL_TOKENS_MINTS_MAP[quoteMintAddress.toString()]
    const reffererAccountAddress = REFFERER_ACCOUNT_ADDRESSES[tokenName]

    console.log('[getReferrerQuoteWallet] tokenName: ', tokenName)
    console.log('[getReferrerQuoteWallet] reffererAccountAddress: ', reffererAccountAddress)

    if (!!reffererAccountAddress) {
      referrerQuoteWallet = new PublicKey(reffererAccountAddress)
    }

    console.log('[getReferrerQuoteWallet] referrerQuoteWallet', referrerQuoteWallet)
  }

  return referrerQuoteWallet
}
