import { PublicKey, Transaction } from '@solana/web3.js'
import BN from 'bn.js'

import { PoolInfo } from '@sb/compositions/Pools/index.types'
import {
  getPoolsProgramAddress,
  ProgramsMultiton,
} from '@sb/dexUtils/ProgramsMultiton'
import { isTransactionFailed } from '@sb/dexUtils/send'
import { Token, TOKEN_PROGRAM_ID } from '@sb/dexUtils/token/token'
import { signAndSendSingleTransaction } from '@sb/dexUtils/transactions'
import { WalletAdapter } from '@sb/dexUtils/types'

import { AldrinConnection } from '@core/solana'

import { PoolBalances } from '../hooks/usePoolBalances'
import { findClosestAmountToSwapForDeposit } from '../swap/findClosestAmountToSwapForDeposit'
import { createBasketTransaction } from './createBasket'
import { getSwapTransaction } from './swap'

export async function createBasketWithSwap({
  wallet,
  connection,
  pool,
  poolBalances,
  userPoolTokenAccount,
  userBaseTokenAccount,
  userQuoteTokenAccount,
  userBaseTokenAmount,
  userQuoteTokenAmount,
  transferSOLToWrapped,
}: {
  wallet: WalletAdapter
  connection: AldrinConnection
  pool: PoolInfo
  poolBalances: PoolBalances
  userPoolTokenAccount: PublicKey | null
  userBaseTokenAccount: PublicKey | null
  userQuoteTokenAccount: PublicKey | null
  userBaseTokenAmount: number
  userQuoteTokenAmount: number
  transferSOLToWrapped: boolean
}) {
  const { swapToken, curveType, tokenADecimals, tokenBDecimals } = pool

  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection: connection.getConnection(),
    programAddress: getPoolsProgramAddress({ curveType }),
  })

  const poolPublicKey = new PublicKey(swapToken)

  const {
    swapOptions: { isSwapBaseToQuote, swapAmountIn, swapAmountOut },
  } = findClosestAmountToSwapForDeposit({
    pool,
    poolBalances,
    userAmountTokenA: userBaseTokenAmount,
    userAmountTokenB: userQuoteTokenAmount,
  })

  const [baseAmountToDeposit, quoteAmountToDeposit] = isSwapBaseToQuote
    ? [userBaseTokenAmount - swapAmountIn, userQuoteTokenAmount + swapAmountOut]
    : [userBaseTokenAmount + swapAmountOut, userQuoteTokenAmount - swapAmountIn]

  try {
    const [swapAmountInDecimals, swapAmountOutDecimals] = isSwapBaseToQuote
      ? [tokenADecimals, tokenBDecimals]
      : [tokenBDecimals, tokenADecimals]

    const swapAmountInWithDecimals = new BN(
      swapAmountIn * 10 ** swapAmountInDecimals
    )

    const swapAmountOutWithDecimals = new BN(
      swapAmountOut * 10 ** swapAmountOutDecimals
    )

    const swapTransactionResult = await getSwapTransaction({
      wallet,
      connection: connection.getConnection(),
      curveType,
      isSwapBaseToQuote,
      poolPublicKey,
      swapAmountIn: swapAmountInWithDecimals,
      swapAmountOut: swapAmountOutWithDecimals,
      transferSOLToWrapped,
      userBaseTokenAccount,
      userQuoteTokenAccount,
    })

    if (swapTransactionResult === null) {
      throw new Error('Swap transaction creation failed')
    }

    const [
      swapTransaction,
      swapSigners,
      newBaseTokenAccount,
      newQuoteTokenAccount,
    ] = swapTransactionResult

    // if we created account in swap transaction
    if (!userBaseTokenAccount) {
      userBaseTokenAccount = newBaseTokenAccount
    }

    if (!userQuoteTokenAccount) {
      userQuoteTokenAccount = newQuoteTokenAccount
    }

    const baseAmountToDepositWithDecimals = new BN(
      baseAmountToDeposit * 10 ** tokenADecimals
    )

    const quoteAmountToDepositWithDecimals = new BN(
      quoteAmountToDeposit * 10 ** tokenBDecimals
    )

    // for swap base to quote - add swap amount in, otherwise remove amount out
    const poolBaseTokenAmoutAfterSwap = isSwapBaseToQuote
      ? poolBalances.baseTokenAmountBN.add(swapAmountInWithDecimals)
      : poolBalances.baseTokenAmountBN.sub(swapAmountOutWithDecimals)

    const {
      baseTokenMint,
      baseTokenVault,
      quoteTokenMint,
      quoteTokenVault,
      poolMint,
      lpTokenFreezeVault,
    } = (await program.account.pool.fetch(poolPublicKey)) as {
      [c: string]: PublicKey
    }

    const poolToken = new Token(
      wallet,
      connection.getConnection(),
      poolMint,
      TOKEN_PROGRAM_ID
    )

    const poolMintInfo = await poolToken.getMintInfo()
    const { supply } = poolMintInfo

    const [createBasketTx, createBasketSigners] = await createBasketTransaction(
      {
        wallet,
        connection,
        poolPublicKey,
        userBaseTokenAccount,
        userQuoteTokenAccount,
        userBaseTokenAmount: baseAmountToDepositWithDecimals,
        userQuoteTokenAmount: quoteAmountToDepositWithDecimals,
        userPoolTokenAccount,
        transferSOLToWrapped,
        program,
        poolTokenAmountA: poolBaseTokenAmoutAfterSwap,
        baseTokenMint,
        baseTokenVault,
        quoteTokenMint,
        quoteTokenVault,
        poolMint,
        lpTokenFreezeVault,
        supply,
      }
    )

    const commonTransaction = new Transaction().add(
      swapTransaction,
      createBasketTx
    )
    const commonSigners = [...swapSigners, ...createBasketSigners]

    const result = await signAndSendSingleTransaction({
      wallet,
      connection,
      transaction: commonTransaction,
      signers: commonSigners,
      focusPopup: true,
    })

    if (isTransactionFailed(result)) {
      return 'failed'
    }

    return result
  } catch (e) {
    console.log('deposit with swap catch error', e)

    return 'failed'
  }
}
