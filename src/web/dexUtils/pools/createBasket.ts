import BN from 'bn.js'
import { TokenInstructions } from '@project-serum/serum'
import { WRAPPED_SOL_MINT } from '@project-serum/serum/lib/token-instructions'
import {
  Connection,
  Keypair,
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  Transaction,
} from '@solana/web3.js'

import { notify } from '../notifications'
import {
  NUMBER_OF_RETRIES,
  transferSOLToWrappedAccountAndClose,
} from '../pools'
import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { POOLS_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { sendTransaction } from '../send'
import { Token } from '../token/token'
import { WalletAdapter } from '../types'

const { TOKEN_PROGRAM_ID } = TokenInstructions

export async function createBasket({
  wallet,
  connection,
  poolPublicKey,
  userPoolTokenAccount,
  userBaseTokenAccount,
  userQuoteTokenAccount,
  userBaseTokenAmount,
  userQuoteTokenAmount,
  transferSOLToWrapped,
}: {
  wallet: WalletAdapter
  connection: Connection
  poolPublicKey: PublicKey
  userPoolTokenAccount: PublicKey | null
  userBaseTokenAccount: PublicKey
  userQuoteTokenAccount: PublicKey
  userBaseTokenAmount: number
  userQuoteTokenAmount: number
  transferSOLToWrapped: boolean
}) {
  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: POOLS_PROGRAM_ADDRESS,
  })

  const [vaultSigner] = await PublicKey.findProgramAddress(
    [poolPublicKey.toBuffer()],
    program.programId
  )

  const {
    baseTokenMint,
    baseTokenVault,
    quoteTokenMint,
    quoteTokenVault,
    poolMint,
  } = await program.account.pool.fetch(poolPublicKey)

  const poolToken = new Token(wallet, connection, poolMint, TOKEN_PROGRAM_ID)

  const poolMintInfo = await poolToken.getMintInfo()
  const supply = poolMintInfo.supply.toNumber()

  const tokenMintA = new Token(
    wallet,
    connection,
    baseTokenMint,
    TOKEN_PROGRAM_ID
  )

  const poolTokenA = await tokenMintA.getAccountInfo(baseTokenVault)
  const poolTokenAmountA = poolTokenA.amount.toNumber()

  let poolTokenAmount = Math.floor(
    (supply * userBaseTokenAmount) / poolTokenAmountA
  )

  poolTokenAmount *= 0.99

  const transactionBeforeDeposit = new Transaction()
  const commonSigners = []

  const transactionAfterDeposit = new Transaction()

  // open liq. provider ticket, will close on redeem
  const lpTicket = Keypair.generate()
  const lpTicketTransaction = await program.account.lpTicket.createInstruction(
    lpTicket
  )

  transactionBeforeDeposit.add(lpTicketTransaction)
  commonSigners.push(lpTicket)

  // create pool token account for user if not exist
  if (!userPoolTokenAccount) {
    const [
      newUserPoolTokenAccount,
      userPoolTokenAccountSignature,
      userPoolTokenAccountTransaction,
    ] = await poolToken.createAccount(wallet.publicKey)

    userPoolTokenAccount = newUserPoolTokenAccount
    transactionBeforeDeposit.add(userPoolTokenAccountTransaction)
    commonSigners.push(userPoolTokenAccountSignature)
  }

  // if SOL - create new token address
  if (baseTokenMint.equals(WRAPPED_SOL_MINT) && transferSOLToWrapped) {
    const result = await transferSOLToWrappedAccountAndClose({
      wallet,
      connection,
      amount: userBaseTokenAmount,
    })

    const [
      wrappedAccount,
      createWrappedAccountTransaction,
      closeAccountTransaction,
    ] = result

    // change account to use from native to wrapped
    userBaseTokenAccount = wrappedAccount.publicKey
    transactionBeforeDeposit.add(createWrappedAccountTransaction)
    commonSigners.push(wrappedAccount)

    transactionAfterDeposit.add(closeAccountTransaction)
  } else if (quoteTokenMint.equals(WRAPPED_SOL_MINT) && transferSOLToWrapped) {
    const result = await transferSOLToWrappedAccountAndClose({
      wallet,
      connection,
      amount: userQuoteTokenAmount,
    })

    const [
      wrappedAccount,
      createWrappedAccountTransaction,
      closeAccountTransaction,
    ] = result

    // change account to use from native to wrapped
    userQuoteTokenAccount = wrappedAccount.publicKey
    transactionBeforeDeposit.add(createWrappedAccountTransaction)
    commonSigners.push(wrappedAccount)

    transactionAfterDeposit.add(closeAccountTransaction)
  }

  let counter = 0
  let commonTransaction = new Transaction()

  while (counter < NUMBER_OF_RETRIES) {
    try {
      if (counter > 0) {
        await notify({
          type: 'error',
          message:
            'Deposit failed, trying with bigger slippage. Please confirm transaction again.',
        })
      }

      const createBasketTransaction = await program.instruction.createBasket(
        new BN(poolTokenAmount),
        new BN(userBaseTokenAmount),
        new BN(userQuoteTokenAmount),
        {
          accounts: {
            pool: poolPublicKey,
            poolMint,
            lpTicket: lpTicket.publicKey,
            poolSigner: vaultSigner,
            userBaseTokenAccount,
            userQuoteTokenAccount,
            baseTokenVault,
            quoteTokenVault,
            userPoolTokenAccount,
            walletAuthority: wallet.publicKey,
            tokenProgram: TOKEN_PROGRAM_ID,
            clock: SYSVAR_CLOCK_PUBKEY,
            rent: SYSVAR_RENT_PUBKEY,
          },
        }
      )

      commonTransaction.add(transactionBeforeDeposit)
      commonTransaction.add(createBasketTransaction)
      commonTransaction.add(transactionAfterDeposit)

      const tx = await sendTransaction({
        wallet,
        connection,
        transaction: commonTransaction,
        signers: commonSigners,
      })

      if (tx) {
        return 'success'
      } else {
        commonTransaction = new Transaction()
        counter++
        poolTokenAmount *= 0.99
      }
    } catch (e) {
      console.log('deposit catch error', e)
      commonTransaction = new Transaction()
      counter++
      poolTokenAmount *= 0.99

      if (e.message.includes('cancelled')) {
        return 'cancelled'
      }
    }
  }

  return 'failed'
}
