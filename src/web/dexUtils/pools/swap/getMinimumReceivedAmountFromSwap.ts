import { simulateTransaction } from '@project-serum/common'
import { PoolInfo } from '@sb/compositions/Pools/index.types'
import { Side } from '@sb/dexUtils/common/config'
import {
  transferSOLToWrappedAccountAndClose,
  createSOLAccountAndClose,
} from '@sb/dexUtils/pools'
import { ProgramsMultiton } from '@sb/dexUtils/ProgramsMultiton/ProgramsMultiton'
import { getPoolsProgramAddress } from '@sb/dexUtils/ProgramsMultiton/utils'
import { createTokenAccountTransaction } from '@sb/dexUtils/send'
import { TOKEN_PROGRAM_ID } from '@sb/dexUtils/tokens'
import { WalletAdapter } from '@sb/dexUtils/types'
import { WRAPPED_SOL_MINT } from '@sb/dexUtils/wallet'
import { Connection, PublicKey, Transaction } from '@solana/web3.js'
import BN from 'bn.js'

export const getMinimumReceivedAmountFromSwap = async ({
  swapAmountIn,
  isSwapBaseToQuote,
  pool,
  wallet,
  connection,
  userBaseTokenAccount,
  userQuoteTokenAccount,
  transferSOLToWrapped,
}: {
  swapAmountIn: number
  isSwapBaseToQuote: boolean
  pool: PoolInfo
  wallet: WalletAdapter
  connection: Connection
  userBaseTokenAccount: PublicKey | null
  userQuoteTokenAccount: PublicKey | null
  transferSOLToWrapped: boolean
}) => {
  const { curveType, swapToken } = pool

  const poolPublicKey = new PublicKey(swapToken)

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
    baseTokenVault,
    quoteTokenVault,
    poolMint,
    feePoolTokenAccount,
    baseTokenMint,
    quoteTokenMint,
    curve,
  } = await program.account.pool.fetch(poolPublicKey)

  const commonTransaction = new Transaction()

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

  // create pool token account for user if not exist
  if (!userBaseTokenAccount) {
    const {
      transaction: createAccountTransaction,
      newAccountPubkey,
    } = await createTokenAccountTransaction({
      wallet,
      mintPublicKey: new PublicKey(baseTokenMint),
    })

    userBaseTokenAccount = newAccountPubkey
    commonTransaction.add(createAccountTransaction)
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
    commonTransaction.add(createAccountTransaction)
  }

  const swapAmountOut = 0

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
        feePoolTokenAccount,
        walletAuthority: wallet.publicKey,
        userBaseTokenAccount,
        userQuoteTokenAccount,
        ...(curve ? { curve } : {}),
        tokenProgram: TOKEN_PROGRAM_ID,
      },
    }
  )
  console.log('swapAmountIn', swapAmountIn)
  console.log('args', {
    pool: poolPublicKey,
    poolSigner: vaultSigner,
    poolMint,
    baseTokenVault,
    quoteTokenVault,
    feePoolTokenAccount,
    walletAuthority: wallet.publicKey,
    userBaseTokenAccount,
    userQuoteTokenAccount,
    tokenProgram: TOKEN_PROGRAM_ID,
  })

  commonTransaction.add(transactionBeforeSwap)
  commonTransaction.add(swapTransaction)
  commonTransaction.add(transactionAfterSwap)

  commonTransaction.feePayer = wallet.publicKey

  const res = await simulateTransaction(
    connection,
    commonTransaction,
    connection.commitment ?? 'single'
  )

  console.log('value', res)
}
