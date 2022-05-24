import { OpenOrders, DexInstructions } from '@project-serum/serum'
import { Token } from '@solana/spl-token'
import {
  Keypair,
  PublicKey,
  Signer,
  SystemProgram,
  TransactionInstruction,
} from '@solana/web3.js'

import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from '@sb/dexUtils/token/token'
import { WRAPPED_SOL_MINT } from '@sb/dexUtils/wallet'

import { DEX_PID } from '@core/config/dex'

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
    ]

    result.signers = [openOrdersAccount]

    result.cleanupInstructions = [
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

const calculateTransactionDepositAndFee = ({
  intermediate,
  destination,
  openOrders,
  feeCalculator,
}) => {
  const SERUM_OPEN_ACCOUNT_LAMPORTS = 23352760
  const OPEN_TOKEN_ACCOUNT_LAMPORTS = 2039280

  const openOrdersDeposits = openOrders
    .filter((ooi) => ooi && ooi.instructions.length > 0)
    .map(() => SERUM_OPEN_ACCOUNT_LAMPORTS)

  const ataDepositLength = [destination, intermediate].filter(
    (item) =>
      (item === null || item === undefined
        ? undefined
        : item.instructions.length) && item.cleanupInstructions.length === 0
  ).length

  const ataDeposit = ataDepositLength * OPEN_TOKEN_ACCOUNT_LAMPORTS

  return {
    signatureFee:
      ([
        destination.signers,
        intermediate === null || intermediate === undefined
          ? undefined
          : intermediate.signers,
        openOrders === null || openOrders === undefined
          ? undefined
          : openOrders.some((oo) =>
              oo === null || oo === undefined ? undefined : oo.signers
            ),
      ]
        .filter(Boolean)
        .flat().length +
        1) *
      feeCalculator.lamportsPerSignature,
    openOrdersDeposits,
    ataDeposit,
    ataDepositLength,
  }
}
