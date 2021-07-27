import { Market, OpenOrders } from '@project-serum/serum'
import { WalletAdapter } from '@sb/dexUtils/adapters'
import { DEX_PID } from '@sb/dexUtils/config'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Connection, PublicKey, SYSVAR_RENT_PUBKEY } from '@solana/web3.js'
import { TokensMapType } from '../../Rebalance.types'
import { getVaultOwnerAndNonce } from './getVaultOwnerAndNonce'

export const getVariablesForPlacingOrder = async ({
  wallet,
  connection,
  market,
  side,
  tokenAccountA,
  tokenAccountB,
}: {
  wallet: WalletAdapter
  connection: Connection
  market: Market
  side: 'buy' | 'sell'
  tokenAccountA: PublicKey,
  tokenAccountB: PublicKey,
}) => {
  const isBuySide = side === 'buy' // swap b-a, sell - swap a - b
  const [tokenA, tokenB] = isBuySide ? [tokenAccountA, tokenAccountB] : [tokenAccountB, tokenAccountA]

  // market
  // marketA for buy, marketB for sell
  // marketA_marketB

  const vaultSigner = await getVaultOwnerAndNonce(market._decoded.ownAddress)

  const openOrders = await market.findOpenOrdersAccountsForOwner(
    connection,
    wallet.publicKey
  )

  OpenOrders

  console.log({
    openOrders,
    vaultSigner,
    market,
    tokenA: tokenA.toString(),
    tokenB: tokenB.toString(),
    side
  })

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
      openOrders: openOrders.publicKey, // openOrdersA
      orderPayerTokenAccount: tokenB, // token address
      coinWallet: tokenA, // token address
    },
    pcWallet: tokenB, // token address
    authority: wallet.publicKey,
    dexProgram: DEX_PID,
    tokenProgram: TOKEN_PROGRAM_ID,
    rent: SYSVAR_RENT_PUBKEY,
  }

  return accounts
}
