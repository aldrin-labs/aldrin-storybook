import { PublicKey } from '@solana/web3.js'

export const filterCorruptedPools = (pool: any) => {
  const poolPubkeyAddress = pool.pubkey.toString()

  // this filters corrupted data
  const emptyPublicKey = new PublicKey(0)
  // TODO: We should re-check other fields probably
  if (
    pool.pubkey.equals(emptyPublicKey) ||
    // pool.poolToken.equals(emptyPublicKey) ||
    pool.tokenAccountA.equals(emptyPublicKey) ||
    pool.tokenAccountB.equals(emptyPublicKey) ||
    pool.mintA.equals(emptyPublicKey) ||
    pool.mintB.equals(emptyPublicKey) ||
    pool.poolSigner.equals(emptyPublicKey)
  ) {
    console.log(
      `[filterPools] WARNING: Pool ${poolPubkeyAddress} has wrong shape of data, filtering it`
    )
    // TODO: Add metric here

    return false
  }

  return true
}
