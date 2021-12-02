import BN from 'bn.js'
import { TokenInstructions } from '@project-serum/serum'
import { WRAPPED_SOL_MINT } from '@project-serum/serum/lib/token-instructions'
import {
  Connection,
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  Transaction,
} from '@solana/web3.js'

import {
  createSOLAccountAndClose,
  getMaxWithdrawAmount,
} from '../pools'

import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { POOLS_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { isTransactionFailed, sendTransaction } from '../send'
import { WalletAdapter } from '../types'
import { isCancelledTransactionError } from '../common/isCancelledTransactionError'

const { TOKEN_PROGRAM_ID } = TokenInstructions

export async function redeemBasket({
  wallet,
  connection,
  poolPublicKey,
  userPoolTokenAccount,
  userBaseTokenAccount,
  userQuoteTokenAccount,
  userPoolTokenAmount,
}: {
  wallet: WalletAdapter
  connection: Connection
  poolPublicKey: PublicKey
  userPoolTokenAccount: PublicKey | null
  userBaseTokenAccount: PublicKey | null
  userQuoteTokenAccount: PublicKey | null
  userPoolTokenAmount: number
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
    feeBaseAccount,
    feeQuoteAccount,
  } = await program.account.pool.fetch(poolPublicKey)

  let [
    baseTokenAmountToWithdraw,
    quoteTokenAmountToWithdraw,
  ] = await getMaxWithdrawAmount({
    wallet,
    connection,
    poolPublicKey,
    baseTokenMint,
    quoteTokenMint,
    basePoolTokenPublicKey: baseTokenVault,
    quotePoolTokenPublicKey: quoteTokenVault,
    poolTokenMint: poolMint,
    poolTokenAmount: userPoolTokenAmount,
  })

  baseTokenAmountToWithdraw *= 0.99
  quoteTokenAmountToWithdraw *= 0.99

  const commonSigners = []
  const transactionBeforeWithdraw = new Transaction()
  const transactionAfterWithdraw = new Transaction()

  // if SOL - create new token address
  if (baseTokenMint.equals(WRAPPED_SOL_MINT)) {
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
    userBaseTokenAccount = wrappedAccount.publicKey
    transactionBeforeWithdraw.add(createWrappedAccountTransaction)
    commonSigners.push(wrappedAccount)

    transactionAfterWithdraw.add(closeAccountTransaction)
  } else if (quoteTokenMint.equals(WRAPPED_SOL_MINT)) {
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
    userQuoteTokenAccount = wrappedAccount.publicKey
    transactionBeforeWithdraw.add(createWrappedAccountTransaction)
    commonSigners.push(wrappedAccount)

    transactionAfterWithdraw.add(closeAccountTransaction)
  }

  if (!userBaseTokenAccount) {
    const {
      transaction: createAccountTransaction,
      newAccountPubkey,
    } = await createTokenAccountTransaction({
      wallet,
      mintPublicKey: new PublicKey(baseTokenMint),
    })

    userBaseTokenAccount = newAccountPubkey
    transactionBeforeWithdraw.add(createAccountTransaction)
  }

  if (!userQuoteTokenAccount) {
    const {
      transaction: createAccountTransaction,
      newAccountPubkey,
    } = await createTokenAccountTransaction({
      wallet,
      mintPublicKey: new PublicKey(quoteTokenMint),
    })

    userQuoteTokenAccount = newAccountPubkey
    transactionBeforeWithdraw.add(createAccountTransaction)
  }

  let commonTransaction = new Transaction()

  try {
    commonTransaction.add(transactionBeforeWithdraw)

    const withdrawTransaction = await program.instruction.redeemBasket(
      new BN(userPoolTokenAmount),
      new BN(baseTokenAmountToWithdraw),
      new BN(quoteTokenAmountToWithdraw),
      {
        accounts: {
          pool: poolPublicKey,
          poolMint: poolMint,
          baseTokenVault,
          quoteTokenVault,
          poolSigner: vaultSigner,
          userPoolTokenAccount,
          userBaseTokenAccount,
          userQuoteTokenAccount,
          walletAuthority: wallet.publicKey,
          userSolAccount: wallet.publicKey,
          // lpTicket: ticketData.lpTicketAddress,
          tokenProgram: TOKEN_PROGRAM_ID,
          feeBaseAccount,
          feeQuoteAccount,
          clock: SYSVAR_CLOCK_PUBKEY,
        },
      }
    )

    commonTransaction.add(withdrawTransaction)

    // add close sol account if needed
    commonTransaction.add(transactionAfterWithdraw)

    const tx = await sendTransaction({
      wallet,
      connection,
      transaction: commonTransaction,
      signers: commonSigners,
      focusPopup: true,
    })

    if (isTransactionFailed(tx)) {
      return 'failed'
    }
  } catch (e) {
    console.log('withdraw catch error', e)

    if (isCancelledTransactionError(e)) {
      return 'cancelled'
    }
  }

  return 'success'
}
