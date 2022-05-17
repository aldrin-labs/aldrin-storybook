import { TokenInstructions } from '@project-serum/serum'
import { WRAPPED_SOL_MINT } from '@project-serum/serum/lib/token-instructions'
import { Connection, PublicKey, Signer, Transaction } from '@solana/web3.js'
import BN from 'bn.js'

import { Side } from '@sb/dexUtils/common/config'
import { createSOLAccountAndClose } from '@sb/dexUtils/pools'import {
  createTokenAccountTransaction,
  isTransactionFailed,
} from '@sb/dexUtils/send'
import { WalletAdapter } from '@sb/dexUtils/types'

import { transferSOLToWrappedAccountAndClose , ProgramsMultiton , getPoolsProgramAddress } from '@core/solana'

import { signAndSendSingleTransaction } from '../../transactions'

const { TOKEN_PROGRAM_ID } = TokenInstructions

export const getSwapTransaction = async ({
  wallet,
  connection,
  poolPublicKey,
  userBaseTokenAccount,
  userQuoteTokenAccount,
  swapAmountIn,
  swapAmountOut,
  isSwapBaseToQuote,
  transferSOLToWrapped,
  unwrapWrappedSOL = true,
  curveType,
}: {
  wallet: WalletAdapter
  connection: Connection
  poolPublicKey: PublicKey
  userBaseTokenAccount: PublicKey | null
  userQuoteTokenAccount: PublicKey | null
  swapAmountIn: BN
  swapAmountOut: BN
  isSwapBaseToQuote: boolean
  transferSOLToWrapped: boolean
  unwrapWrappedSOL?: boolean
  curveType: number | null
}): Promise<[Transaction, Signer[], PublicKey, PublicKey] | null> => {
  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: getPoolsProgramAddress({ curveType }),
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
    curve,
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
        amount: parseFloat(swapAmountIn.toString()),
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
      if (unwrapWrappedSOL) {
        transactionAfterSwap.add(closeAccountTransaction)
      }
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
      if (unwrapWrappedSOL) {
        transactionAfterSwap.add(closeAccountTransaction)
      }
    }
  }

  // create pool token account for user if not exist
  if (!userBaseTokenAccount) {
    const { transaction: createAccountTransaction, newAccountPubkey } =
      await createTokenAccountTransaction({
        wallet,
        mintPublicKey: new PublicKey(baseTokenMint),
      })

    userBaseTokenAccount = newAccountPubkey
    transactionBeforeSwap.add(createAccountTransaction)
  }

  if (!userQuoteTokenAccount) {
    const { transaction: createAccountTransaction, newAccountPubkey } =
      await createTokenAccountTransaction({
        wallet,
        mintPublicKey: new PublicKey(quoteTokenMint),
      })

    userQuoteTokenAccount = newAccountPubkey
    transactionBeforeSwap.add(createAccountTransaction)
  }

  const commonTransaction = new Transaction()

  try {
    const swapTransaction = await program.instruction.swap(
      swapAmountIn,
      swapAmountOut,
      isSwapBaseToQuote ? Side.Ask : Side.Bid,
      {
        accounts: {
          pool: poolPublicKey,
          poolSigner: vaultSigner,
          poolMint,
          baseTokenVault,
          quoteTokenVault,
          feePoolTokenAccount,
          walletAuthority: wallet.publicKey,
          userBaseTokenAccount,
          userQuoteTokenAccount,
          ...(curve ? { curve } : {}),
          tokenProgram: TOKEN_PROGRAM_ID,
        },
      }
    )

    commonTransaction.add(transactionBeforeSwap)
    commonTransaction.add(swapTransaction)
    commonTransaction.add(transactionAfterSwap)

    return [
      commonTransaction,
      commonSigners,
      userBaseTokenAccount,
      userQuoteTokenAccount,
    ]
  } catch (e) {
    return null
  }
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
  curveType,
}: {
  wallet: WalletAdapter
  connection: Connection
  poolPublicKey: PublicKey
  userBaseTokenAccount: PublicKey | null
  userQuoteTokenAccount: PublicKey | null
  swapAmountIn: BN
  swapAmountOut: BN
  isSwapBaseToQuote: boolean
  transferSOLToWrapped: boolean
  curveType: number | null
}) => {
  const swapTransactionAndSigners = await getSwapTransaction({
    wallet,
    connection,
    poolPublicKey,
    userBaseTokenAccount,
    userQuoteTokenAccount,
    swapAmountIn,
    swapAmountOut,
    isSwapBaseToQuote,
    transferSOLToWrapped,
    curveType,
  })

  if (!swapTransactionAndSigners) {
    return 'failed'
  }

  const [swapTransaction, signers] = swapTransactionAndSigners

  try {
    const tx = await signAndSendSingleTransaction({
      wallet,
      connection,
      transaction: swapTransaction,
      signers,
      focusPopup: true,
    })

    if (!isTransactionFailed(tx)) {
      return 'success'
    }

    return tx
  } catch (e) {
    console.log('swap catch error', e)
  }

  return 'failed'
}
