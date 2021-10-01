import BN from 'bn.js'
import { TokenInstructions } from '@project-serum/serum'
import { WRAPPED_SOL_MINT } from '@project-serum/serum/lib/token-instructions'
import { Connection, PublicKey, Transaction } from '@solana/web3.js'

import { notify } from '../notifications'
import {
  createSOLAccountAndClose,
  NUMBER_OF_RETRIES,
  transferSOLToWrappedAccountAndClose,
} from '../pools'
import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { POOLS_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { sendTransaction } from '../send'
import { WalletAdapter } from '../types'

const { TOKEN_PROGRAM_ID } = TokenInstructions
const Side = {
  Bid: { bid: {} },
  Ask: { ask: {} },
}

export const swap = async ({
  wallet,
  connection,
  poolPublicKey,
  userBaseTokenAccount,
  userQuoteTokenAccount,
  swapAmountIn,
  swapAmountOut,
  isSwapBaseToQuote,
  transferSOLToWrapped,
}: {
  wallet: WalletAdapter
  connection: Connection
  poolPublicKey: PublicKey
  userBaseTokenAccount: PublicKey
  userQuoteTokenAccount: PublicKey
  swapAmountIn: number
  swapAmountOut: number
  isSwapBaseToQuote: boolean
  transferSOLToWrapped: boolean
}) => {
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
    feePoolTokenAccount,
  } = await program.account.pool.fetch(poolPublicKey)

  const transactionBeforeSwap = new Transaction()
  const commonSigners = []
  const transactionAfterSwap = new Transaction()

  // if native SOL is base or quote - create new token address, with or without sending funds to it
  if (
    (baseTokenMint.equals(WRAPPED_SOL_MINT) ||
      quoteTokenMint.equals(WRAPPED_SOL_MINT)) &&
    transferSOLToWrapped
  ) {
    const isBaseTokenNativeSol = baseTokenMint.equals(WRAPPED_SOL_MINT)

    // if we swap base to quote and base is native sol or
    // if we swap quote to base and quote is native sol we need to transfer funds for swap
    if (
      (isBaseTokenNativeSol && isSwapBaseToQuote) ||
      (!isBaseTokenNativeSol && !isSwapBaseToQuote)
    ) {
      const result = await transferSOLToWrappedAccountAndClose({
        wallet,
        connection,
        amount: swapAmountIn,
      })

      const [
        wrappedAccount,
        createWrappedAccountTransaction,
        closeAccountTransaction,
      ] = result

      // change account to use from native to wrapped
      if (isBaseTokenNativeSol) {
        userBaseTokenAccount = wrappedAccount.publicKey
      } else {
        userQuoteTokenAccount = wrappedAccount.publicKey
      }

      transactionBeforeSwap.add(createWrappedAccountTransaction)
      commonSigners.push(wrappedAccount)
      transactionAfterSwap.add(closeAccountTransaction)
    } else {
      // otherwise we need only to create wrapped sol account
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
      if (isBaseTokenNativeSol) {
        userBaseTokenAccount = wrappedAccount.publicKey
      } else {
        userQuoteTokenAccount = wrappedAccount.publicKey
      }

      transactionBeforeSwap.add(createWrappedAccountTransaction)
      commonSigners.push(wrappedAccount)
      transactionAfterSwap.add(closeAccountTransaction)
    }
  }

  let counter = 0
  let commonTransaction = new Transaction()

  while (counter < NUMBER_OF_RETRIES) {
    try {
      if (counter > 0) {
        await notify({
          type: 'error',
          message:
            'Swap failed, trying with bigger slippage. Please confirm transaction again.',
        })
      }

      const swapTransaction = await program.instruction.swap(
        new BN(swapAmountIn),
        new BN(swapAmountOut),
        isSwapBaseToQuote ? Side.Ask : Side.Bid,
        {
          accounts: {
            pool: poolPublicKey,
            poolSigner: vaultSigner,
            poolMint,
            baseTokenVault,
            quoteTokenVault,
            feePoolTokenAccount: feePoolTokenAccount,
            walletAuthority: wallet.publicKey,
            userBaseTokenAccount: isSwapBaseToQuote
              ? userBaseTokenAccount
              : userQuoteTokenAccount,
            userQuoteTokenAccount: isSwapBaseToQuote
              ? userQuoteTokenAccount
              : userBaseTokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
          },
        }
      )

      commonTransaction.add(transactionBeforeSwap)
      commonTransaction.add(swapTransaction)
      commonTransaction.add(transactionAfterSwap)

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
        swapAmountOut *= 0.99
      }
    } catch (e) {
      console.log('deposit catch error', e)
      commonTransaction = new Transaction()
      counter++
      swapAmountOut *= 0.99

      if (e.message.includes('cancelled')) {
        return 'cancelled'
      }
    }
  }

  return 'failed'
}
