import { Market } from '@project-serum/serum'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Connection, PublicKey, SYSVAR_RENT_PUBKEY } from '@solana/web3.js'
import BN from 'bn.js'

import { WalletAdapter } from '@sb/dexUtils/types'

import { DEX_PID } from '@core/config/dex'

export const getVariablesForPlacingOrder = async ({
  wallet,
  connection,
  market,
  vaultSigner,
  openOrdersAccountAddress,
  side,
  tokenAccountA,
  tokenAccountB,
}: {
  wallet: WalletAdapter
  connection: Connection
  market: Market
  vaultSigner: PublicKey | BN
  openOrdersAccountAddress: PublicKey
  side: 'buy' | 'sell'
  tokenAccountA: PublicKey
  tokenAccountB: PublicKey
}) => {
  const isBuySide = side === 'buy'
  const orderPayerTokenAccount = isBuySide ? tokenAccountB : tokenAccountA

  const accounts = {
    market: {
      market: market._decoded.ownAddress,
      requestQueue: market._decoded.requestQueue,
      eventQueue: market._decoded.eventQueue,
      bids: market._decoded.bids,
      asks: market._decoded.asks,
      coinVault: market._decoded.baseVault,
      pcVault: market._decoded.quoteVault,

      vaultSigner,
      openOrders: openOrdersAccountAddress,
      orderPayerTokenAccount, // token address
      coinWallet: tokenAccountA, // token address
    },
    pcWallet: tokenAccountB, // token address
    authority: wallet.publicKey,
    dexProgram: DEX_PID,
    tokenProgram: TOKEN_PROGRAM_ID,
    rent: SYSVAR_RENT_PUBKEY,
  }

  return accounts
}
