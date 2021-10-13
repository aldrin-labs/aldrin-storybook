import BN from 'bn.js'
import { TokenInstructions } from '@project-serum/serum'
import { WRAPPED_SOL_MINT } from '@project-serum/serum/lib/token-instructions'
import {
  Connection,
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  Transaction,
} from '@solana/web3.js'

import { notify } from '../notifications'
import {
  createSOLAccountAndClose,
  getMaxWithdrawAmount,
  NUMBER_OF_RETRIES,
} from '../pools'
import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { POOLS_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { sendTransaction } from '../send'
import { WalletAdapter } from '../types'

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
  userBaseTokenAccount: PublicKey
  userQuoteTokenAccount: PublicKey
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

  let counter = 0
  let commonTransaction = new Transaction()

  while (counter < NUMBER_OF_RETRIES) {
    try {
      if (counter > 0) {
        await notify({
          type: 'error',
          message:
            'Withdraw failed, trying with bigger slippage. Please confirm transaction again.',
        })
      }

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

      if (tx) {
        return 'success'
      } else {
        commonTransaction = new Transaction()
        counter++
        baseTokenAmountToWithdraw *= 0.99
        quoteTokenAmountToWithdraw *= 0.99
      }
    } catch (e) {
      console.log('withdraw catch error', e)

      commonTransaction = new Transaction()
      counter++
      baseTokenAmountToWithdraw *= 0.99
      quoteTokenAmountToWithdraw *= 0.99

      if (e.message.includes('cancelled')) {
        return 'cancelled'
      }
    }
  }

  return 'failed'
}
