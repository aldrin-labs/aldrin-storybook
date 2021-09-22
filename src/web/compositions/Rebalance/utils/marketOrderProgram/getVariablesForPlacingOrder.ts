import { Market, OpenOrders } from '@project-serum/serum'
import { WalletAdapter } from '@sb/dexUtils/types'
import { DEX_PID } from '@core/config/dex'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Connection, PublicKey, SYSVAR_RENT_PUBKEY } from '@solana/web3.js'
import BN from 'bn.js'

export const getVariablesForPlacingOrder = async ({
  wallet,
  connection,
  market,
  vaultSigner,
  openOrders,
  side,
  tokenAccountA,
  tokenAccountB,
}: {
  wallet: WalletAdapter
  connection: Connection
  market: Market,
  vaultSigner: PublicKey | BN,
  openOrders: OpenOrders[],
  side: 'buy' | 'sell'
  tokenAccountA: PublicKey,
  tokenAccountB: PublicKey,
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
      openOrders: openOrders?.length > 0 ? openOrders[0].publicKey : null,
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
