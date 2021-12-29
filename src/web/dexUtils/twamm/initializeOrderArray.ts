import {
  Connection,
  Keypair,
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  Transaction,
} from '@solana/web3.js'
import BN from 'bn.js'

import { TOKEN_PROGRAM_ID } from '@sb/dexUtils/token/token'
import { checkAccountForMint } from '@sb/dexUtils/twamm/checkAccountForMint'

import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { TWAMM_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { WalletAdapter } from '../types'

export const initializeOrderArray = async ({
  wallet,
  connection,
  programAddress = TWAMM_PROGRAM_ADDRESS,
  pairSettings,
  mintFrom,
  mintTo,
}: {
  wallet: WalletAdapter
  connection: Connection
  programAddress?: string
  amount: BN
  timeLength: BN
  pairSettings: any
  mintFrom: PublicKey
  mintTo: PublicKey
  orders: PublicKey[]
  orderArray: any
}) => {
  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress,
  })

  const Side = {
    Bid: { bid: {} },
    Ask: { ask: {} },
  }

  const orderArray = Keypair.generate()
  const tokenAccountFrom = await checkAccountForMint({
    wallet,
    connection,
    mint: mintFrom,
    create: false,
  })
  const tokenAccountTo = await checkAccountForMint({
    wallet,
    connection,
    mint: mintTo,
    create: false,
  })

  const [askSigner, askSignerNonce] = await PublicKey.findProgramAddress(
    [orderArray.publicKey.toBuffer()],
    program.programId
  )

  const initializeOrderArrayInstruction =
    program.instruction.initializeOrderArray(askSignerNonce, Side.Ask, {
      accounts: {
        pairSettings: pairSettings.publicKey,
        orders: orderArray.publicKey,
        orderArraySigner: askSigner,
        initializer: wallet.publicKey,
        twammFromTokenVault: tokenAccountFrom,
        twammToTokenVault: tokenAccountTo,
        feeAccount: pairSettings.baseTokenFeeAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        clock: SYSVAR_CLOCK_PUBKEY,
      },
    })

  return await sendTransaction({
    transaction: new Transaction().add(initializeOrderArrayInstruction),
    wallet,
    signers: [orderArray],
    connection,
    focusPopup: true,
  })
}
