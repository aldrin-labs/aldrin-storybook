import { TokenInstructions } from '@project-serum/serum'
import {
  Connection,
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  Transaction,
} from '@solana/web3.js'
import { BN } from 'anchor019'

import { ProgramsMultiton } from '@sb/dexUtils/ProgramsMultiton/ProgramsMultiton'
import { WalletAdapter } from '@sb/dexUtils/types'

import { TWAMM_PROGRAM_ADDRESS } from '../ProgramsMultiton'
import { signAndSendSingleTransaction } from '../transactions'
import { PairSettings, TwammOrder } from './types'
import { Program, Provider } from '@project-serum/anchor'
import TwammProgramIdl from '@core/idls/twamm.json'

export const getCloseOrderTransactions = async (params: {
  wallet: WalletAdapter
  connection: Connection
  pairSettings: PairSettings
  order: TwammOrder
  userBaseTokenAccount: string
  userQuoteTokenAccount: string
}): Promise<Transaction> => {
  const {
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

  const closeOrderTransaction = await program.instruction.closeOrder(
    Side.Ask,
    new BN(order.index),
    {
      accounts: {
        pairSettings: new PublicKey(pairSettings.publicKey),
        orders: new PublicKey(order.orderArrayPublicKey), // orderArray.pubkey
        twammFromTokenVault: new PublicKey(order.twammFromTokenVault),
        twammToTokenVault: new PublicKey(order.twammToTokenVault),
        signer: askSigner,
        userBaseTokenAccount: new PublicKey(userBaseTokenAccount),
        userQuoteTokenAccount: new PublicKey(userQuoteTokenAccount),
        userAuthority: wallet.publicKey,
        tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
        clock: SYSVAR_CLOCK_PUBKEY,
      },
    }
  )

  return new Transaction().add(closeOrderTransaction)
}

export const closeOrder = async ({
  wallet,
  connection,
  pairSettings,
  order,
  userBaseTokenAccount,
  userQuoteTokenAccount,
}: {
  wallet: WalletAdapter
  connection: Connection
  pairSettings: PairSettings
  order: TwammOrder
  userBaseTokenAccount: string
  userQuoteTokenAccount: string
}) => {
  const transaction = await getCloseOrderTransactions({
    wallet,
    connection,
    pairSettings,
    order,
    userBaseTokenAccount,
    userQuoteTokenAccount,
  })

  const result = await signAndSendSingleTransaction({
    wallet,
    connection,
    transaction,
  })

  return result
}
