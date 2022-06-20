import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js'

import { Token, TOKEN_PROGRAM_ID } from '@sb/dexUtils/token/token'

import { ProgramsMultiton, TWAMM_PROGRAM_ADDRESS } from '@core/solana'

import { signAndSendSingleTransaction } from '../transactions'
import { WalletAdapter } from '../types'
import { PairSettings } from './types'

export const initializeOrderArray = async ({
  wallet,
  connection,
  programAddress = TWAMM_PROGRAM_ADDRESS,
  pairSettings,
  mintFrom,
  mintTo,
  side,
  sideText,
}: {
  wallet: WalletAdapter
  connection: Connection
  programAddress?: string
  pairSettings: PairSettings
  mintFrom: PublicKey
  mintTo: PublicKey
  side: { ask: {} } | { bid: {} } | null
  sideText: string | null
}) => {
  try {
    const program = ProgramsMultiton.getProgramByAddress({
      wallet,
      connection,
      programAddress: TWAMM_PROGRAM_ADDRESS,
    })

    const orderArray = Keypair.generate()

    const [signer, signerNonce] = await PublicKey.findProgramAddress(
      [orderArray.publicKey.toBuffer()],
      program.programId
    )

    const transaction = new Transaction()
    const createOrderArrayInstruction =
      await program.account.orderArray.createInstruction(orderArray)

    transaction.add(createOrderArrayInstruction)

    const tokenFrom = new Token(wallet, connection, mintFrom, TOKEN_PROGRAM_ID)
    const tokenTo = new Token(wallet, connection, mintTo, TOKEN_PROGRAM_ID)

    // let tokenAccountFromInstruction = new Transaction()
    // let tokenAccountFromAccount = new Account()

    const [_pkFrom, tokenAccountFromAccount, tokenAccountFromInstruction] =
      await tokenFrom.createAccount(signer)

    const [_pkTo, tokenAccountToAccount, tokenAccountToInstruction] =
      await tokenTo.createAccount(signer)

    transaction.add(tokenAccountFromInstruction)

    transaction.add(tokenAccountToInstruction)

    const initializeOrderArrayInstruction =
      await program.instruction.initializeOrderArray(signerNonce, side, {
        accounts: {
          pairSettings: new PublicKey(pairSettings.publicKey),
          orders: orderArray.publicKey,
          orderArraySigner: signer,
          initializer: wallet.publicKey,
          twammFromTokenVault: tokenAccountFromAccount.publicKey,
          twammToTokenVault: tokenAccountToAccount.publicKey,
          feeAccount:
            sideText === 'ask'
              ? new PublicKey(pairSettings.baseTokenFeeAccount)
              : new PublicKey(pairSettings.quoteTokenFeeAccount),
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        },
      })

    transaction.add(initializeOrderArrayInstruction)

    await signAndSendSingleTransaction({
      transaction,
      wallet,
      signers: [orderArray, tokenAccountFromAccount, tokenAccountToAccount],
      connection,
      focusPopup: true,
    })

    return {
      orderArray,
      tokenAccountFrom: tokenAccountFromAccount.publicKey,
    }
  } catch (e) {
    console.warn('Unable to initialize order array:', e)
    return null
  }
}
