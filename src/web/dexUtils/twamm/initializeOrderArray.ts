import {
  Account,
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js'
import { Token, TOKEN_PROGRAM_ID } from '@sb/dexUtils/token/token'
import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { TWAMM_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { WalletAdapter } from '../types'
import { signAndSendSingleTransaction } from '../transactions'
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
  wallet: WalletAdapter,
  connection: Connection,
  programAddress?: string,
  pairSettings: PairSettings,
  mintFrom: PublicKey,
  mintTo: PublicKey,
  side: {ask: {}} | {bid: {}} | null,
  sideText: string | null
}) => {
  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress,
  })

  const orderArray = Keypair.generate();

  let [signer, signerNonce] = await PublicKey.findProgramAddress(
    [orderArray.publicKey.toBuffer()],
    program.programId
  )

  const transaction = new Transaction()
  const createOrderArrayInstruction =
    await program.account.orderArray.createInstruction(orderArray)

  console.log('createOrderArrayInstruction', createOrderArrayInstruction)

  transaction.add(createOrderArrayInstruction)

  const tokenFrom = new Token(wallet, connection, mintFrom, TOKEN_PROGRAM_ID)
  const tokenTo = new Token(wallet, connection, mintTo, TOKEN_PROGRAM_ID)

  let tokenAccountFromInstruction = new Transaction()
  let tokenAccountFromAccount = new Account()

  await tokenFrom.createAccount(signer).then((res) => {
    const [publicKey, account, transaction] = res
    tokenAccountFromInstruction = transaction
    tokenAccountFromAccount = account
  })
  transaction.add(tokenAccountFromInstruction)

  let tokenAccountToInstruction = new Transaction()
  let tokenAccountToAccount = new Account()
  await tokenTo.createAccount(signer).then((res) => {
    const [publicKey, account, transaction] = res
    tokenAccountToInstruction = transaction
    tokenAccountToAccount = account
  })

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
        feeAccount: new PublicKey(pairSettings.baseTokenFeeAccount),
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      },
    })

  transaction.add(initializeOrderArrayInstruction)

  console.log({
    transaction,
  })

  let returnValue = null

  await signAndSendSingleTransaction({
    transaction,
    wallet,
    signers: [orderArray, tokenAccountFromAccount, tokenAccountToAccount],
    connection,
    focusPopup: true,
  })
    .then((res) => {
      console.log('returnValue', {
        orderArray,
        tokenAccountFrom: tokenAccountFromAccount.publicKey,
      })
      returnValue = {
        orderArray,
        tokenAccountFrom: tokenAccountFromAccount.publicKey,
      }
    })
    .catch((error) => {
      console.log('initializeOrderArrayError', error)
    })

  return returnValue
}
