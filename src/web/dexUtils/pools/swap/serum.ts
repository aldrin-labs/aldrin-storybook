import { DexInstructions, OpenOrders } from '@project-serum/serum'
import { Token } from '@solana/spl-token'
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Signer,
  SystemProgram,
  TransactionInstruction,
} from '@solana/web3.js'

import { OpenOrdersMap } from '@sb/compositions/Rebalance/utils/loadOpenOrdersFromMarkets'
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from '@sb/dexUtils/token/token'
import { TokenInfo } from '@sb/dexUtils/types'
import { WRAPPED_SOL_MINT } from '@sb/dexUtils/wallet'
import { toMap } from '@sb/utils'

import { DEX_PID } from '@core/config/dex'

import { SwapRoute } from './getSwapRoute'

const getEmptyInstruction = (): {
  instructions: TransactionInstruction[]
  cleanupInstructions: TransactionInstruction[]
  signers: Signer[]
} => ({
  instructions: [],
  cleanupInstructions: [],
  signers: [],
})

export async function createAndCloseWSOLAccount({ connection, owner, amount }) {
  const result = getEmptyInstruction()

  const toAccount = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    WRAPPED_SOL_MINT,
    owner
  )

  const info = await connection.getAccountInfo(toAccount)

  if (info === null) {
    result.instructions.push(
      Token.createAssociatedTokenAccountInstruction(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        WRAPPED_SOL_MINT,
        toAccount,
        owner,
        owner
      )
    )
  } // Fund account and sync

  result.instructions.push(
    SystemProgram.transfer({
      fromPubkey: owner,
      toPubkey: toAccount,
      lamports: amount,
    }),
    Token.createSyncNativeInstruction(TOKEN_PROGRAM_ID, toAccount)
  )

  result.cleanupInstructions = [
    Token.createCloseAccountInstruction(
      TOKEN_PROGRAM_ID,
      toAccount,
      owner,
      owner,
      []
    ),
  ]
  return {
    address: toAccount,
    ...result,
  }
}
async function findOrCreateAssociatedAccountByMint(
  connection,
  payer,
  owner,
  mintAddress,
  unwrapSOL
) {
  const mint =
    typeof mintAddress === 'string' ? new PublicKey(mintAddress) : mintAddress
  const toAccount = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    mint,
    owner
  )
  const cleanupInstructions = []
  const instructions = []
  const info = await connection.getAccountInfo(toAccount)

  if (info === null) {
    instructions.push(
      Token.createAssociatedTokenAccountInstruction(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        mint,
        toAccount,
        owner,
        payer
      )
    )
  } // We close it when wrapped SOL

  if (mint.equals(WRAPPED_SOL_MINT) && unwrapSOL) {
    cleanupInstructions.push(
      Token.createCloseAccountInstruction(
        TOKEN_PROGRAM_ID,
        toAccount,
        owner,
        owner,
        []
      )
    )
  }

  return {
    mint,
    address: toAccount,
    instructions,
    cleanupInstructions,
    signers: [],
  }
}

export const routeAtaInstructions = async ({
  connection,
  mints,
  userPublicKey,
  unwrapSOL = true,
}) => {
  const associatedAccounts = await Promise.all(
    mints.map((mint) =>
      findOrCreateAssociatedAccountByMint(
        connection,
        userPublicKey,
        userPublicKey,
        mint,
        unwrapSOL
      )
    )
  )

  const associatedAccountsMap = associatedAccounts.reduce(
    (acc, ata) => acc.set(ata.mint.toString(), ata),
    new Map()
  )

  return associatedAccountsMap
}

export async function getOrCreateOpenOrdersAddress({
  connection,
  user,
  serumMarket,
  marketToOpenOrdersAddress,
}) {
  const result = getEmptyInstruction()
  const marketAddress = serumMarket.address.toString()

  if (marketToOpenOrdersAddress) {
    // check existing map
    const openOrders = marketToOpenOrdersAddress.get(marketAddress)
    const openOrdersAddress =
      openOrders && openOrders.length > 0 ? openOrders[0].address : null

    console.log('openOrdersAddress', openOrdersAddress)

    if (openOrdersAddress) {
      let openOrdersAccountInfo = null // We verify if it indeed exists, with low commitment to pick it up, to address the unsafe behaviour below

      openOrdersAccountInfo = await connection.getAccountInfo(
        openOrdersAddress,
        'processed'
      )

      result.cleanupInstructions = [
        DexInstructions.consumeEvents({
          market: serumMarket.address,
          eventQueue: serumMarket.decoded.eventQueue,
          coinFee: serumMarket.decoded.eventQueue,
          pcFee: serumMarket.decoded.eventQueue,
          openOrdersAccounts: [openOrdersAddress],
          limit: 11,
          programId: DEX_PID,
        }),
        DexInstructions.closeOpenOrders({
          market: serumMarket.address,
          openOrders: openOrdersAddress,
          owner: user,
          solWallet: user,
          programId: DEX_PID,
        }),
      ]

      if (openOrdersAccountInfo) {
        return {
          ...result,
          address: openOrdersAddress,
          marketAddress,
        }
      }
    }
  }

  const openOrdersAccount = Keypair.generate()
  const newOpenOrdersAddress = openOrdersAccount.publicKey

  const newOpenOrdersAddressInfo = await connection.getAccountInfo(
    newOpenOrdersAddress
  )

  if (!newOpenOrdersAddressInfo) {
    result.instructions = [
      await OpenOrders.makeCreateAccountTransaction(
        connection,
        serumMarket.address,
        user,
        openOrdersAccount.publicKey,
        DEX_PID
      ),
      DexInstructions.initOpenOrders({
        market: serumMarket.address,
        openOrders: newOpenOrdersAddress,
        owner: user,
        programId: DEX_PID,
        marketAuthority: null,
      }),
    ]

    result.signers = [openOrdersAccount]

    result.cleanupInstructions = [
      DexInstructions.consumeEvents({
        market: serumMarket.address,
        eventQueue: serumMarket.decoded.eventQueue,
        coinFee: serumMarket.decoded.eventQueue,
        pcFee: serumMarket.decoded.eventQueue,
        openOrdersAccounts: [openOrdersAccount],
        limit: 11,
        programId: DEX_PID,
      }),
      DexInstructions.closeOpenOrders({
        market: serumMarket.address,
        openOrders: newOpenOrdersAddress,
        owner: user,
        solWallet: user,
        programId: DEX_PID,
      }),
    ]
    // add cleanup instruction
  } // This is unsafe, since we don't know yet if it has succeeded

  // TODO: reload OpenOrders map after swap

  return { ...result, address: newOpenOrdersAddress, marketAddress }
}

export const calculateTransactionDepositAndFee = ({
  swapRoute,
  openOrdersMap,
  userTokensData,
}: {
  swapRoute: SwapRoute
  openOrdersMap: OpenOrdersMap
  userTokensData: TokenInfo[]
}) => {
  if (!swapRoute || swapRoute.length === 0) return 0

  const SERUM_OPEN_ACCOUNT_LAMPORTS = 23352760
  const OPEN_TOKEN_ACCOUNT_LAMPORTS = 2039280
  const LAMPORTS_PER_SIGNATURE = 5000

  const openOrdersToCreate = swapRoute.filter(
    (swapStep) =>
      swapStep.ammLabel === 'Serum' &&
      !openOrdersMap.has(swapStep.market.market?.address.toString())
  ).length

  const uniqSwapRouteMints = [
    ...new Set(
      swapRoute.map((step) => [step.inputMint, step.outputMint]).flat()
    ),
  ]

  const userTokensDataMap = toMap(userTokensData, (tokenData) => tokenData.mint)

  const tokenAccountsToCreate = uniqSwapRouteMints.filter(
    (mint) => !userTokensDataMap.has(mint)
  ).length

  const openOrdersNetworkFee = openOrdersToCreate * SERUM_OPEN_ACCOUNT_LAMPORTS
  const tokenAccountsNetworkFee =
    tokenAccountsToCreate * OPEN_TOKEN_ACCOUNT_LAMPORTS

  const signersNetworkFee = openOrdersToCreate * LAMPORTS_PER_SIGNATURE

  return (
    (LAMPORTS_PER_SIGNATURE +
      openOrdersNetworkFee +
      tokenAccountsNetworkFee +
      signersNetworkFee) /
    LAMPORTS_PER_SOL
  )
}
