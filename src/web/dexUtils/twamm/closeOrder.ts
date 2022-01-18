import { Program, Provider } from '@project-serum/anchor'
import { TokenInstructions } from '@project-serum/serum'
import {
  Connection,
  PublicKey,
  Signer,
  SYSVAR_CLOCK_PUBKEY,
  Transaction,
} from '@solana/web3.js'
import { BN } from 'anchor019'

import { ProgramsMultiton } from '@sb/dexUtils/ProgramsMultiton/ProgramsMultiton'
import { WalletAdapter } from '@sb/dexUtils/types'

import { TWAMM_PROGRAM_ADDRESS } from '../ProgramsMultiton'
import { signAndSendSingleTransaction } from '../transactions'
import { PairSettings, TwammOrder } from './types'
import TwammProgramIdl from '@core/idls/twamm.json'

import { WRAPPED_SOL_MINT } from '../wallet'
import { createSOLAccountAndClose } from '../pools'

export const getCloseOrderTransactions = async (params: {
  wallet: WalletAdapter
  connection: Connection
  pairSettings: PairSettings
  order: TwammOrder
  userBaseTokenAccount: string
  userQuoteTokenAccount: string
  side: 'Buy' | 'Sell'
}): Promise<[Transaction, Signer[]]> => {
  let {
    side,
    wallet,
    connection,
    pairSettings,
    order,
    userBaseTokenAccount,
    userQuoteTokenAccount,
  } = params

  const Side = {
    Bid: { bid: {} },
    Ask: { ask: {} },
  }

  const programId = new PublicKey(TWAMM_PROGRAM_ADDRESS)

  const program = new Program(
    TwammProgramIdl,
    programId,
    new Provider(connection, wallet, Provider.defaultOptions())
  )

  const [askSigner] = await PublicKey.findProgramAddress(
    [new PublicKey(order.orderArrayPublicKey).toBuffer()],
    program.programId
  )

  const commonTransaction = new Transaction()
  const commonSigners = []

  const transactionAfter = new Transaction()

  // if SOL - create new token address
  if (new PublicKey(pairSettings.baseTokenMint).equals(WRAPPED_SOL_MINT)) {
    const result = await createSOLAccountAndClose({
      wallet,
      connection,
    })

    const [
      wrappedAccount,
      createWrappedAccountTransaction,
      closeAccountTransaction,
    ] = result

    // change account to use from native to wrapped
    if (side === 'Sell') {
      userBaseTokenAccount = wrappedAccount.publicKey.toString()
    } else {
      userQuoteTokenAccount = wrappedAccount.publicKey.toString()
    }

    commonTransaction.add(createWrappedAccountTransaction)
    commonSigners.push(wrappedAccount)

    transactionAfter.add(closeAccountTransaction)
  } else if (
    new PublicKey(pairSettings.quoteTokenMint).equals(WRAPPED_SOL_MINT)
  ) {
    const result = await createSOLAccountAndClose({
      wallet,
      connection,
    })

    const [
      wrappedAccount,
      createWrappedAccountTransaction,
      closeAccountTransaction,
    ] = result

    // change account to use from native to wrapped
    if (side === 'Sell') {
      userQuoteTokenAccount = wrappedAccount.publicKey.toString()
    } else {
      userBaseTokenAccount = wrappedAccount.publicKey.toString()
    }
    commonTransaction.add(createWrappedAccountTransaction)
    commonSigners.push(wrappedAccount)

    transactionAfter.add(closeAccountTransaction)
  }

  console.log({
    order,
    userBaseTokenAccount,
    userQuoteTokenAccount,
  })

  const closeOrderTransaction = await program.instruction.closeOrder(
    side === 'Sell' ? Side.Ask : Side.Bid,
    new BN(order.index),
    {
      accounts: {
        pairSettings: new PublicKey(pairSettings.publicKey),
        orders: new PublicKey(order.orderArrayPublicKey), // orderArray.pubkey
        twammFromTokenVault: new PublicKey(order.twammFromTokenVault),
        twammToTokenVault: new PublicKey(order.twammToTokenVault),
        signer: askSigner,
        feeAccount: new PublicKey(order.feeAccount),
        userBaseTokenAccount: new PublicKey(userBaseTokenAccount),
        userQuoteTokenAccount: new PublicKey(userQuoteTokenAccount),
        userAuthority: wallet.publicKey,
        tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
        bclock: SYSVAR_CLOCK_PUBKEY,
      },
    }
  )

  commonTransaction.add(closeOrderTransaction)
  commonTransaction.add(transactionAfter)

  return [commonTransaction, commonSigners]
}

export const closeOrder = async ({
  wallet,
  connection,
  pairSettings,
  order,
  userBaseTokenAccount,
  userQuoteTokenAccount,
  side,
}: {
  wallet: WalletAdapter
  connection: Connection
  pairSettings: PairSettings
  order: TwammOrder
  userBaseTokenAccount: string
  userQuoteTokenAccount: string
  side: 'Buy' | 'Sell'
}) => {
  const [transaction, signers] = await getCloseOrderTransactions({
    wallet,
    connection,
    pairSettings,
    order,
    side,
    userBaseTokenAccount,
    userQuoteTokenAccount,
  })

  const result = await signAndSendSingleTransaction({
    wallet,
    connection,
    transaction,
    signers,
  })

  return result
}
