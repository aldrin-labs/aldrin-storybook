import {
  Account,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionSignature,
} from '@solana/web3.js'

import * as BufferLayout from 'buffer-layout'
import Base58 from 'base-58'

import { Token, TOKEN_PROGRAM_ID } from './token/token'
import {
  CurveType,
  TokenSwap,
  TOKEN_SWAP_PROGRAM_ID,
  TokenFarmingLayout,
  TokenSwapLayout,
} from './token-swap/token-swap'
import { WalletAdapter } from '@sb/dexUtils/types'
import { sendAndConfirmTransactionViaWallet } from './token/utils/send-and-confirm-transaction-via-wallet'
import { PoolInfo } from '@sb/compositions/Pools/index.types'
import { notify } from './notifications'
import { WRAPPED_SOL_MINT } from '@project-serum/serum/lib/token-instructions'
import { DEX_PID } from '@core/config/dex'
import { MARKET_STATE_LAYOUT_V3 } from '@project-serum/serum'

const OWNER: PublicKey = new PublicKey(
  '5rWKzCUY9ESdmobivjyjQzvdfHSePf37WouX39sMmfx9'
)

const ownerKey = OWNER.toString()

const SLIPPAGE_PERCENTAGE = 5
export const NUMBER_OF_RETRIES = 5

// Pool fees
const TRADING_FEE_NUMERATOR = 25
const TRADING_FEE_DENOMINATOR = 10000
const OWNER_TRADING_FEE_NUMERATOR = 5
const OWNER_TRADING_FEE_DENOMINATOR = 10000
const OWNER_WITHDRAW_FEE_NUMERATOR = 0
const OWNER_WITHDRAW_FEE_DENOMINATOR = 0
const HOST_FEE_NUMERATOR = 0
const HOST_FEE_DENOMINATOR = 0

// curve type used to calculate swaps and deposits
const CURVE_TYPE = CurveType.ConstantProduct

function assert(condition: boolean, message?: string) {
  if (!condition) {
    console.log(Error().stack + ':token-test.js')
    throw message || 'Assertion failed'
  } else {
    console.log('Passed:', message)
  }
}

/**
 * Create a Token Swap object (pool)
 *
 * @param wallet The Wallet that will sign transactions
 * @param connection The connection to use
 * @param mintA The mint address of tokenA
 * @param mintB The mint address of tokenB
 * @param userTokenAccountA The user's tokenA account address
 * @param userTokenAccountB The user's tokenB account address
 * @param userAmountTokenA The amount of tokenA to tranfer to the pool token account address
 * @param userAmountTokenB The amount of tokenB to tranfer to the pool token account address
 * @param transferSOLToWrapped The flag which shows if we need to wrap our SOL token
 */
export async function createTokenSwap({
  wallet,
  connection,
  mintA,
  mintB,
  userTokenAccountA,
  userTokenAccountB,
  userAmountTokenA,
  userAmountTokenB,
  transferSOLToWrapped,
}: {
  wallet: WalletAdapter
  connection: Connection
  mintA: PublicKey
  mintB: PublicKey
  userTokenAccountA: PublicKey
  userTokenAccountB: PublicKey
  userAmountTokenA: number
  userAmountTokenB: number
  transferSOLToWrapped: boolean
}): Promise<'success' | 'failed' | 'cancelled'> {
  console.log('start createTokenSwap')
  const tokenSwapAccount = new Account()

  const [authority, nonce] = await PublicKey.findProgramAddress(
    [tokenSwapAccount.publicKey.toBuffer()],
    TOKEN_SWAP_PROGRAM_ID
  )

  // create accounts
  console.log('creating pool mint')
  const [
    tokenPoolMint,
    tokenPoolMintSignature,
    createTokenPoolMintTransaction,
  ] = await Token.createMint(
    wallet,
    connection,
    authority,
    null,
    8,
    TOKEN_PROGRAM_ID
  )

  console.log('creating tokenAccountPool, owner is user')
  const [
    tokenAccountPool,
    tokenAccountPoolSignature,
    createTokenAccountPoolTransaction,
  ] = await tokenPoolMint.createAccount(wallet.publicKey)

  const [
    feeAccount,
    feeAccountSignature,
    createFeeAccountTransaction,
  ] = await tokenPoolMint.createAccount(new PublicKey(ownerKey))

  const [
    tokenFreezeAccount,
    tokenFreezeAccountSignature,
    tokenFreezeAccountTransaction,
  ] = await tokenPoolMint.createAccount(authority)

  const [
    farmingStateAccount,
    farmingStateTransaction,
  ] = await createFarmingStateAccount({ wallet, connection })

  console.log('creating token A', mintA.toString())
  const mintTokenA = new Token(wallet, connection, mintA, TOKEN_PROGRAM_ID)
  const [
    poolTokenAccountA,
    poolTokenAccountASignature,
    createPoolTokenAccountATransaction,
  ] = await mintTokenA.createAccount(authority)

  console.log('creating token B', mintB.toString())
  const mintTokenB = new Token(wallet, connection, mintB, TOKEN_PROGRAM_ID)
  const [
    poolTokenAccountB,
    poolTokenAccountBSignature,
    createPoolTokenAccountBTransaction,
  ] = await mintTokenB.createAccount(authority)

  // send create accounts transaction to not overflow limits
  const createAccountsTransactions = new Transaction()

  createAccountsTransactions.add(
    createTokenPoolMintTransaction,
    createTokenAccountPoolTransaction,
    createFeeAccountTransaction,
    tokenFreezeAccountTransaction,
    farmingStateTransaction
  )

  const createAccountsSignatures = [
    tokenAccountPoolSignature,
    tokenPoolMintSignature,
    feeAccountSignature,
    farmingStateAccount,
    tokenFreezeAccountSignature,
  ]

  await sendAndConfirmTransactionViaWallet(
    wallet,
    connection,
    createAccountsTransactions,
    ...createAccountsSignatures
  )

  // second transaction
  const beforeCreatePoolTransaction = new Transaction().add(
    createPoolTokenAccountATransaction,
    createPoolTokenAccountBTransaction
  )

  const beforeCreatePoolTransactionSigners = [
    poolTokenAccountASignature,
    poolTokenAccountBSignature,
  ]

  const afterCreatePoolTransaction = new Transaction()

  // if SOL - create new token address
  if (mintA.equals(WRAPPED_SOL_MINT) && transferSOLToWrapped) {
    const result = await transferSOLToWrappedAccountAndClose({
      wallet,
      connection,
      amount: userAmountTokenA,
    })

    // change account to use from native to wrapped
    userTokenAccountA = result[0]
    const [
      _,
      createWrappedAccountTransaction,
      createWrappedAccountTransactionSigner,
      closeAccountTransaction,
    ] = result

    await sendAndConfirmTransactionViaWallet(
      wallet,
      connection,
      createWrappedAccountTransaction,
      createWrappedAccountTransactionSigner
    )

    afterCreatePoolTransaction.add(closeAccountTransaction)
  } else if (mintB.equals(WRAPPED_SOL_MINT) && transferSOLToWrapped) {
    const result = await transferSOLToWrappedAccountAndClose({
      wallet,
      connection,
      amount: userAmountTokenB,
    })

    // change account to use from native to wrapped
    userTokenAccountB = result[0]
    const [
      _,
      createWrappedAccountTransaction,
      createWrappedAccountTransactionSigner,
      closeAccountTransaction,
    ] = result

    await sendAndConfirmTransactionViaWallet(
      wallet,
      connection,
      createWrappedAccountTransaction,
      createWrappedAccountTransactionSigner
    )

    afterCreatePoolTransaction.add(closeAccountTransaction)
  }

  // transfer funds
  console.log('minting token A to swap')
  const mintTokenATransferTransaction = await mintTokenA.transfer(
    userTokenAccountA,
    poolTokenAccountA,
    wallet.publicKey,
    [],
    userAmountTokenA
  )

  console.log('minting token B to swap')
  const mintTokenBTransferTransaction = await mintTokenB.transfer(
    userTokenAccountB,
    poolTokenAccountB,
    wallet.publicKey,
    [],
    userAmountTokenB
  )

  beforeCreatePoolTransaction.add(
    mintTokenATransferTransaction,
    mintTokenBTransferTransaction
  )

  console.log('createTokenSwap')
  let tokenSwap

  try {
    tokenSwap = await TokenSwap.createTokenSwap(
      wallet,
      connection,
      tokenSwapAccount,
      authority,
      poolTokenAccountA,
      poolTokenAccountB,
      tokenPoolMint.publicKey,
      tokenFreezeAccount,
      mintA,
      mintB,
      feeAccount,
      tokenAccountPool,
      TOKEN_SWAP_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      nonce,
      TRADING_FEE_NUMERATOR,
      TRADING_FEE_DENOMINATOR,
      OWNER_TRADING_FEE_NUMERATOR,
      OWNER_TRADING_FEE_DENOMINATOR,
      OWNER_WITHDRAW_FEE_NUMERATOR,
      OWNER_WITHDRAW_FEE_DENOMINATOR,
      HOST_FEE_NUMERATOR,
      HOST_FEE_DENOMINATOR,
      CURVE_TYPE,
      farmingStateAccount.publicKey,
      beforeCreatePoolTransaction,
      beforeCreatePoolTransactionSigners,
      afterCreatePoolTransaction
    )
  } catch (e) {
    if (e.message.includes('cancelled')) {
      return 'cancelled'
    }

    console.log('create pool error', e)

    return 'failed'
  }

  console.log(
    'tokenSwapAccount.publicKey, tokenPoolMint',
    tokenSwapAccount.publicKey.toString(),
    tokenPoolMint.publicKey.toString()
  )

  console.log('loading token swap', tokenSwap)
  const fetchedTokenSwap = await TokenSwap.loadTokenSwap(
    wallet,
    connection,
    tokenSwapAccount.publicKey,
    TOKEN_SWAP_PROGRAM_ID
  )

  // test that fetchedTokenSwap has the same fields as arguments
  assert(
    fetchedTokenSwap.tokenProgramId.equals(TOKEN_PROGRAM_ID),
    'tokenProgramId'
  )
  assert(
    fetchedTokenSwap.tokenAccountA.equals(poolTokenAccountA),
    'tokenAccountA'
  )
  assert(
    fetchedTokenSwap.tokenAccountB.equals(poolTokenAccountB),
    'tokenAccountB'
  )
  assert(fetchedTokenSwap.mintA.equals(mintA), 'mintA')
  assert(fetchedTokenSwap.mintB.equals(mintB), 'mintB')
  assert(
    fetchedTokenSwap.poolToken.equals(tokenPoolMint.publicKey),
    'tokenPoolPublicKey'
  )
  assert(fetchedTokenSwap.feeAccount.equals(feeAccount), 'feeAccount')
  assert(
    TRADING_FEE_NUMERATOR == fetchedTokenSwap.tradeFeeNumerator.toNumber(),
    'tradeFeeNumerator'
  )
  assert(
    TRADING_FEE_DENOMINATOR == fetchedTokenSwap.tradeFeeDenominator.toNumber(),
    'TRADING_FEE_DENOMINATOR'
  )
  assert(
    OWNER_TRADING_FEE_NUMERATOR ==
      fetchedTokenSwap.ownerTradeFeeNumerator.toNumber(),
    'OWNER_TRADING_FEE_NUMERATOR'
  )
  assert(
    OWNER_TRADING_FEE_DENOMINATOR ==
      fetchedTokenSwap.ownerTradeFeeDenominator.toNumber(),
    'OWNER_TRADING_FEE_DENOMINATOR'
  )
  assert(
    OWNER_WITHDRAW_FEE_NUMERATOR ==
      fetchedTokenSwap.ownerWithdrawFeeNumerator.toNumber(),
    'OWNER_WITHDRAW_FEE_NUMERATOR'
  )
  assert(
    OWNER_WITHDRAW_FEE_DENOMINATOR ==
      fetchedTokenSwap.ownerWithdrawFeeDenominator.toNumber(),
    'OWNER_WITHDRAW_FEE_DENOMINATOR'
  )
  assert(
    HOST_FEE_NUMERATOR == fetchedTokenSwap.hostFeeNumerator.toNumber(),
    'HOST_FEE_NUMERATOR'
  )
  assert(
    HOST_FEE_DENOMINATOR == fetchedTokenSwap.hostFeeDenominator.toNumber(),
    'HOST_FEE_DENOMINATOR'
  )
  assert(CURVE_TYPE == fetchedTokenSwap.curveType, 'CURVE_TYPE')

  return 'success'
}

/**
 * Deposit liquidity to the existing pool
 *
 * @param wallet The Wallet that will sign transactions
 * @param connection The connection to use
 * @param tokenSwapPublicKey The public key of swap, that will be used to deposit money
 * @param userTokenAccountA The user's tokenA account address
 * @param userTokenAccountB The user's tokenB account address
 * @param userAmountTokenA The amount of tokenA to tranfer to the pool token account address
 * @param userAmountTokenB The amount of tokenB to tranfer to the pool token account address
 */
export async function depositAllTokenTypes({
  wallet,
  connection,
  tokenSwapPublicKey,
  poolTokenAccount,
  userTokenAccountA,
  userTokenAccountB,
  userAmountTokenA,
  userAmountTokenB,
  transferSOLToWrapped,
}: {
  wallet: WalletAdapter
  connection: Connection
  tokenSwapPublicKey: PublicKey
  poolTokenAccount?: PublicKey
  userTokenAccountA: PublicKey
  userTokenAccountB: PublicKey
  userAmountTokenA: number
  userAmountTokenB: number
  transferSOLToWrapped: boolean
}): Promise<'success' | 'failed' | 'cancelled'> {
  const tokenSwap = await TokenSwap.loadTokenSwap(
    wallet,
    connection,
    tokenSwapPublicKey,
    TOKEN_SWAP_PROGRAM_ID
  )

  const { tokenAccountA, mintA, mintB, poolToken: poolTokenMint } = tokenSwap

  const tokenPool = new Token(
    wallet,
    connection,
    poolTokenMint,
    TOKEN_PROGRAM_ID
  )

  const poolMintInfo = await tokenPool.getMintInfo()
  const supply = poolMintInfo.supply.toNumber()

  const tokenMintA = new Token(wallet, connection, mintA, TOKEN_PROGRAM_ID)
  const poolTokenA = await tokenMintA.getAccountInfo(tokenAccountA)
  const poolTokenAmountA = poolTokenA.amount.toNumber()

  let poolTokenAmount = Math.floor(
    (supply * userAmountTokenA) / poolTokenAmountA
  )

  const isUserAlreadyHasPoolTokenAccount = !!poolTokenAccount

  let [newAccountPool, newAccountPoolSignature, newAccountPoolTransaction]: [
    PublicKey | null,
    Account | null,
    Transaction | null
  ] = [null, null, null]

  // create new account for user only if it has no one for such pool mint
  if (!isUserAlreadyHasPoolTokenAccount) {
    ;[
      newAccountPool,
      newAccountPoolSignature,
      newAccountPoolTransaction,
    ] = await tokenPool.createAccount(wallet.publicKey)
  }

  const userPoolTokenAccount = isUserAlreadyHasPoolTokenAccount
    ? poolTokenAccount
    : newAccountPool

  const beforeDepositTransaction = new Transaction()
  const beforeDepositTransactionSigners = [
    ...(isUserAlreadyHasPoolTokenAccount || !newAccountPoolSignature
      ? []
      : [newAccountPoolSignature]),
  ]

  const afterDepositTransaction = new Transaction()

  // if SOL - create new token address
  if (mintA.equals(WRAPPED_SOL_MINT) && transferSOLToWrapped) {
    const result = await transferSOLToWrappedAccountAndClose({
      wallet,
      connection,
      amount: userAmountTokenA,
    })

    // change account to use from native to wrapped
    userTokenAccountA = result[0]
    const [
      _,
      createWrappedAccountTransaction,
      createWrappedAccountTransactionSigner,
      closeAccountTransaction,
    ] = result

    beforeDepositTransaction.add(createWrappedAccountTransaction)
    beforeDepositTransactionSigners.push(createWrappedAccountTransactionSigner)

    afterDepositTransaction.add(closeAccountTransaction)
  } else if (mintB.equals(WRAPPED_SOL_MINT) && transferSOLToWrapped) {
    const result = await transferSOLToWrappedAccountAndClose({
      wallet,
      connection,
      amount: userAmountTokenB,
    })

    // change account to use from native to wrapped
    userTokenAccountB = result[0]
    const [
      _,
      createWrappedAccountTransaction,
      createWrappedAccountTransactionSigner,
      closeAccountTransaction,
    ] = result

    beforeDepositTransaction.add(createWrappedAccountTransaction)
    beforeDepositTransactionSigners.push(createWrappedAccountTransactionSigner)

    afterDepositTransaction.add(closeAccountTransaction)
  }

  const userTransferAuthority = new Account()

  console.log('approving token a')
  const tokenMintAApproveTransaction = await tokenMintA.approve(
    userTokenAccountA,
    userTransferAuthority.publicKey,
    wallet.publicKey,
    [],
    userAmountTokenA
  )

  console.log('approving token a')
  const tokenMintB = new Token(wallet, connection, mintB, TOKEN_PROGRAM_ID)
  const tokenMintBApproveTransaction = await tokenMintB.approve(
    userTokenAccountB,
    userTransferAuthority.publicKey,
    wallet.publicKey,
    [],
    userAmountTokenB
  )
  // create new pool token account for user, if no one exists
  if (!isUserAlreadyHasPoolTokenAccount && newAccountPoolTransaction) {
    beforeDepositTransaction.add(newAccountPoolTransaction)
  }

  beforeDepositTransaction.add(
    tokenMintAApproveTransaction,
    tokenMintBApproveTransaction
  )

  if (!userPoolTokenAccount) {
    console.error("User's token account was not provided or created")
    return 'failed'
  }

  console.log('Depositing into swap')
  let counter = 0
  while (counter < SLIPPAGE_PERCENTAGE) {
    try {
      if (counter > 0) {
        await notify({
          type: 'error',
          message:
            'Deposit failed, trying with bigger slippage. Please confirm transaction again.',
        })
      }

      const depositSignature = await tokenSwap.depositAllTokenTypes(
        userTokenAccountA,
        userTokenAccountB,
        userPoolTokenAccount,
        userTransferAuthority,
        poolTokenAmount,
        userAmountTokenA,
        userAmountTokenB,
        beforeDepositTransaction,
        beforeDepositTransactionSigners,
        afterDepositTransaction
      )

      console.log('depositSignature', depositSignature)

      if (depositSignature) {
        return 'success'
      }
    } catch (e) {
      console.log('deposit catch error', e)
      counter++
      poolTokenAmount *= 0.99

      if (e.message.includes('cancelled')) {
        return 'cancelled'
      }
    }
  }

  return 'failed'
}

/**
 * Withdraw liquidity from the pool
 *
 * @param wallet The Wallet that will sign transactions
 * @param connection The connection to use
 * @param tokenSwapPublicKey The public key of swap, that will be used to deposit money
 * @param poolTokenAccount The user's pool token address
 * @param userTokenAccountA The user's tokenA account address
 * @param userTokenAccountB The user's tokenB account address
 * @param amountTokenA The amount of tokenA to tranfer to the pool token account address
 * @param amountTokenB The amount of tokenB to tranfer to the pool token account address
 *
 */
export async function withdrawAllTokenTypes({
  wallet,
  connection,
  tokenSwapPublicKey,
  poolTokenAccount,
  userTokenAccountA,
  userTokenAccountB,
  poolTokenAmount,
}: {
  wallet: WalletAdapter
  connection: Connection
  tokenSwapPublicKey: PublicKey
  poolTokenAccount: PublicKey
  userTokenAccountA: PublicKey
  userTokenAccountB: PublicKey
  poolTokenAmount: number
}): Promise<'success' | 'failed' | 'cancelled'> {
  const tokenSwap = await TokenSwap.loadTokenSwap(
    wallet,
    connection,
    tokenSwapPublicKey,
    TOKEN_SWAP_PROGRAM_ID
  )

  const { poolToken: poolTokenMint, mintA, mintB } = tokenSwap

  let [withdrawAmountTokenA, withdrawAmountTokenB] = await getMaxWithdrawAmount(
    {
      wallet,
      connection,
      tokenSwapPublicKey,
      poolTokenAmount,
      tokenSwap,
    }
  )

  // todo: make number bigger
  withdrawAmountTokenA *= 0.99
  withdrawAmountTokenB *= 0.99

  // in case tokenA/B is SOL
  const beforeWithdrawTransaction = new Transaction()
  const beforeWithdrawTransactionSigners = []

  const afterWithdrawTransaction = new Transaction()

  // if SOL - create new token address
  if (mintA.equals(WRAPPED_SOL_MINT)) {
    const result = await transferSOLToWrappedAccountAndClose({
      wallet,
      connection,
      amount: withdrawAmountTokenA,
    })

    // change account to use from native to wrapped
    userTokenAccountA = result[0]
    const [
      _,
      createWrappedAccountTransaction,
      createWrappedAccountTransactionSigner,
      closeAccountTransaction,
    ] = result

    beforeWithdrawTransaction.add(createWrappedAccountTransaction)
    beforeWithdrawTransactionSigners.push(createWrappedAccountTransactionSigner)

    afterWithdrawTransaction.add(closeAccountTransaction)
  } else if (mintB.equals(WRAPPED_SOL_MINT)) {
    const result = await transferSOLToWrappedAccountAndClose({
      wallet,
      connection,
      amount: withdrawAmountTokenB,
    })

    // change account to use from native to wrapped
    userTokenAccountB = result[0]
    const [
      _,
      createWrappedAccountTransaction,
      createWrappedAccountTransactionSigner,
      closeAccountTransaction,
    ] = result

    beforeWithdrawTransaction.add(createWrappedAccountTransaction)
    beforeWithdrawTransactionSigners.push(createWrappedAccountTransactionSigner)

    afterWithdrawTransaction.add(closeAccountTransaction)
  }

  const tokenPool = new Token(
    wallet,
    connection,
    poolTokenMint,
    TOKEN_PROGRAM_ID
  )

  let feeAmount = 0
  if (OWNER_WITHDRAW_FEE_NUMERATOR !== 0) {
    feeAmount = Math.floor(
      (poolTokenAmount * OWNER_WITHDRAW_FEE_NUMERATOR) /
        OWNER_WITHDRAW_FEE_DENOMINATOR
    )
  }

  const userTransferAuthority = new Account()

  console.log('Approving withdrawal from pool account')
  const tokenPoolApproveTransaction = await tokenPool.approve(
    poolTokenAccount,
    userTransferAuthority.publicKey,
    wallet.publicKey,
    [],
    poolTokenAmount
  )
  beforeWithdrawTransaction.add(tokenPoolApproveTransaction)

  console.log('Withdrawing pool tokens for A and B tokens')
  let counter = 0
  while (counter < SLIPPAGE_PERCENTAGE) {
    try {
      if (counter > 0) {
        await notify({
          type: 'error',
          message:
            'Withdrawal failed, trying with bigger slippage. Please confirm transaction again.',
        })
      }

      const withdrawSignature = await tokenSwap.withdrawAllTokenTypes(
        userTokenAccountA,
        userTokenAccountB,
        poolTokenAccount,
        userTransferAuthority,
        poolTokenAmount - feeAmount,
        withdrawAmountTokenA,
        withdrawAmountTokenB,
        beforeWithdrawTransaction,
        beforeWithdrawTransactionSigners,
        afterWithdrawTransaction
      )
      if (withdrawSignature) {
        return 'success'
      }
    } catch (e) {
      console.log('withdraw catch error')
      counter++
      withdrawAmountTokenA *= 0.99
      withdrawAmountTokenB *= 0.99

      if (e.message.includes('cancelled')) {
        return 'cancelled'
      }
    }
  }

  return 'failed'
}

/**
 * Swap tokenA to tokenB and vice versa on existing pool
 *
 * @param wallet The Wallet that will sign transactions
 * @param connection The connection to use
 * @param tokenSwapPublicKey The public key of swap, that will be used to deposit money
 * @param userTokenAccountA The user's tokenA account address
 * @param userTokenAccountB The user's tokenB account address
 * @param swapAmountIn The amount of tokenA to tranfer to the pool token account address
 * @param swapAmountOut The amount of tokenB to tranfer to the pool token account address
 * @param baseSwapToken The flag which will determine swapIn and swapOut tokens
 * @returns Transaction and signer for this transaction (userTransferAuthority in our case to approve transfer funds from userSourceAccount to poolSourceAccount)
 */
export async function swap({
  wallet,
  connection,
  userTokenAccountA,
  userTokenAccountB,
  tokenSwapPublicKey,
  swapAmountIn,
  swapAmountOut,
  baseSwapToken,
}: {
  wallet: WalletAdapter
  connection: Connection
  userTokenAccountA: PublicKey
  userTokenAccountB: PublicKey
  tokenSwapPublicKey: PublicKey
  swapAmountIn: number
  swapAmountOut: number
  baseSwapToken: 'tokenA' | 'tokenB'
}): Promise<[Transaction]> {
  const tokenSwap = await TokenSwap.loadTokenSwap(
    wallet,
    connection,
    tokenSwapPublicKey,
    TOKEN_SWAP_PROGRAM_ID
  )
  const { tokenAccountA, tokenAccountB, mintA, mintB } = tokenSwap

  const [
    sourceMint,
    userSourceAccount,
    userDestinationAccount,
    poolSourceAccount,
    poolDestinationAccount,
  ] =
    baseSwapToken === 'tokenA'
      ? [
          mintA,
          userTokenAccountA,
          userTokenAccountB,
          tokenAccountA,
          tokenAccountB,
        ]
      : [
          mintB,
          userTokenAccountB,
          userTokenAccountA,
          tokenAccountB,
          tokenAccountA,
        ]

  // const userTransferAuthority = new Account()
  // const sourceTokenMint = new Token(
  //   wallet,
  //   connection,
  //   sourceMint,
  //   TOKEN_PROGRAM_ID
  // )

  // const approveTransaction = await sourceTokenMint.approve(
  //   userSourceAccount,
  //   userTransferAuthority.publicKey,
  //   wallet.publicKey,
  //   [],
  //   swapAmountIn
  // )

  const [swapTransaction] = await tokenSwap.swap(
    userSourceAccount,
    poolSourceAccount,
    poolDestinationAccount,
    userDestinationAccount,
    null, // host fees, add later
    wallet.publicKey,
    swapAmountIn,
    swapAmountOut
  )

  const commonTransaction = new Transaction().add(
    // approveTransaction,
    swapTransaction
  )

  return [commonTransaction]
}

/**
 * Swap tokenA to tokenB and vice versa on existing pool
 *
 * @param wallet The Wallet that will sign transactions
 * @param connection The connection to use
 * @param tokenSwapPublicKey The public key of swap, that will be used to deposit money
 * @param userTokenAccountA The user's tokenA account address
 * @param userTokenAccountB The user's tokenB account address
 * @param swapAmountIn The amount of tokenA to tranfer to the pool token account address
 * @param swapAmountOut The amount of tokenB to tranfer to the pool token account address
 * @param baseSwapToken The flag which will determine swapIn and swapOut tokens
 * @returns Transaction and signer for this transaction (userTransferAuthority in our case to approve transfer funds from userSourceAccount to poolSourceAccount)
 */
export async function swapWithHandleNativeSol({
  wallet,
  connection,
  userTokenAccountA,
  userTokenAccountB,
  tokenSwapPublicKey,
  swapAmountIn,
  swapAmountOut,
  baseSwapToken,
}: {
  wallet: WalletAdapter
  connection: Connection
  userTokenAccountA: PublicKey
  userTokenAccountB: PublicKey
  tokenSwapPublicKey: PublicKey
  swapAmountIn: number
  swapAmountOut: number
  baseSwapToken: 'tokenA' | 'tokenB'
}): Promise<[Transaction, Account[]]> {
  const tokenSwap = await TokenSwap.loadTokenSwap(
    wallet,
    connection,
    tokenSwapPublicKey,
    TOKEN_SWAP_PROGRAM_ID
  )
  const { tokenAccountA, tokenAccountB, mintA, mintB } = tokenSwap

  let [
    sourceMint,
    userSourceAccount,
    userDestinationAccount,
    poolSourceAccount,
    poolDestinationAccount,
  ] =
    baseSwapToken === 'tokenA'
      ? [
          mintA,
          userTokenAccountA,
          userTokenAccountB,
          tokenAccountA,
          tokenAccountB,
        ]
      : [
          mintB,
          userTokenAccountB,
          userTokenAccountA,
          tokenAccountB,
          tokenAccountA,
        ]

  // in case tokenA/B is SOL
  const beforeSwapTransaction = new Transaction()
  const beforeSwapTransactionSigners = []

  const afterSwapTransaction = new Transaction()

  // if SOL - create new token address
  if (sourceMint.equals(WRAPPED_SOL_MINT)) {
    const result = await transferSOLToWrappedAccountAndClose({
      wallet,
      connection,
      amount: swapAmountIn,
    })

    // change account to use from native to wrapped
    userSourceAccount = result[0]
    const [
      _,
      createWrappedAccountTransaction,
      createWrappedAccountTransactionSigner,
      closeAccountTransaction,
    ] = result

    beforeSwapTransaction.add(createWrappedAccountTransaction)
    beforeSwapTransactionSigners.push(createWrappedAccountTransactionSigner)

    afterSwapTransaction.add(closeAccountTransaction)
  }

  const [swapTransaction] = await tokenSwap.swap(
    userSourceAccount,
    poolSourceAccount,
    poolDestinationAccount,
    userDestinationAccount,
    null, // host fees, add later
    wallet.publicKey,
    swapAmountIn,
    swapAmountOut
  )

  const commonTransaction = new Transaction().add(
    beforeSwapTransaction,
    swapTransaction,
    afterSwapTransaction
  )

  return [commonTransaction, beforeSwapTransactionSigners]
}

/**
 * Get max amount in tokenA and tokenB to withdrawal from pool
 *
 * @param wallet The Wallet that will sign transactions
 * @param connection The connection to use
 * @param poolTokenMint,
 * @param baseTokenMint,
 * @param quoteTokenMint,
 * @param basePoolTokenPublicKey,
 * @param quotePoolTokenPublicKey,
 * @param poolPublicKey,
 * @param poolTokenAmount,
 */
export const getMaxWithdrawAmount = async ({
  wallet,
  connection,
  poolTokenMint,
  baseTokenMint,
  quoteTokenMint,
  basePoolTokenPublicKey,
  quotePoolTokenPublicKey,
  poolPublicKey,
  poolTokenAmount,
}: {
  wallet: WalletAdapter
  connection: Connection
  poolTokenMint: PublicKey
  baseTokenMint: PublicKey
  quoteTokenMint: PublicKey
  basePoolTokenPublicKey: PublicKey
  quotePoolTokenPublicKey: PublicKey
  poolPublicKey: PublicKey
  poolTokenAmount: number
}): Promise<[number, number, number, number]> => {
  const poolToken = new Token(
    wallet,
    connection,
    poolTokenMint,
    TOKEN_PROGRAM_ID
  )

  const poolMintInfo = await poolToken.getMintInfo()
  const supply = poolMintInfo.supply.toNumber()

  const basePoolToken = new Token(
    wallet,
    connection,
    baseTokenMint,
    TOKEN_PROGRAM_ID
  )
  const basePoolTokenInfo = await basePoolToken.getAccountInfo(
    basePoolTokenPublicKey
  )
  const basePoolTokenAmount = basePoolTokenInfo.amount.toNumber()

  const quotePoolToken = new Token(
    wallet,
    connection,
    quoteTokenMint,
    TOKEN_PROGRAM_ID
  )
  const quotePoolTokenInfo = await quotePoolToken.getAccountInfo(
    quotePoolTokenPublicKey
  )
  const quotePoolTokenAmount = quotePoolTokenInfo.amount.toNumber()

  const withdrawAmountTokenA = (basePoolTokenAmount * poolTokenAmount) / supply
  const withdrawAmountTokenB = (quotePoolTokenAmount * poolTokenAmount) / supply

  return [
    withdrawAmountTokenA,
    withdrawAmountTokenB,
    basePoolTokenAmount,
    quotePoolTokenAmount,
  ]
}

/**
 * Get max amount in tokenA and tokenB to withdrawal from pool
 * @param selectedPool The pool which poolTokenAmount user has
 * @param poolTokenAmount The amount of  user's pool tokens
 */
export const calculateWithdrawAmount = ({
  selectedPool,
  poolTokenAmount,
}: {
  selectedPool: PoolInfo
  poolTokenAmount: number
}): [number, number] => {
  const {
    supply,
    tvl: { tokenA: poolTokenAmountA, tokenB: poolTokenAmountB },
  } = selectedPool

  if (supply === 0) return [0, 0]

  const withdrawAmountTokenA = (poolTokenAmountA * poolTokenAmount) / supply
  const withdrawAmountTokenB = (poolTokenAmountB * poolTokenAmount) / supply

  return [withdrawAmountTokenA, withdrawAmountTokenB]
}

export const closeSolAccount = async ({
  wallet,
  connection,
  accountToClose,
}: {
  wallet: WalletAdapter
  connection: Connection
  accountToClose: PublicKey
}) => {
  const tokenMintA = new Token(
    wallet,
    connection,
    WRAPPED_SOL_MINT,
    TOKEN_PROGRAM_ID
  )

  const [closeAccountTransaction] = await tokenMintA.closeAccount(
    accountToClose,
    wallet.publicKey,
    wallet.publicKey,
    []
  )

  await sendAndConfirmTransactionViaWallet(
    wallet,
    connection,
    closeAccountTransaction
  )
}

export const createSOLAccountAndClose = async ({
  wallet,
  connection,
}: {
  wallet: WalletAdapter
  connection: Connection
}): Promise<[Account, Transaction, Transaction]> => {
  // if SOL - create new token address

  const tokenMint = new Token(
    wallet,
    connection,
    WRAPPED_SOL_MINT,
    TOKEN_PROGRAM_ID
  )

  const [
    _,
    createWrappedAccount,
    createWrappedAccountTransaction,
  ] = await tokenMint.createAccount(wallet.publicKey)

  const [closeAccountTransaction] = await tokenMint.closeAccount(
    createWrappedAccount.publicKey,
    wallet.publicKey,
    wallet.publicKey,
    []
  )

  return [
    createWrappedAccount,
    createWrappedAccountTransaction,
    closeAccountTransaction,
  ]
}

/**
 * Transfer amount of SOL from native account to wrapped to be able to interact with pools
 * @returns Address, transaction for creation this account and closing
 */
export const transferSOLToWrappedAccountAndClose = async ({
  wallet,
  connection,
  amount,
}: {
  wallet: WalletAdapter
  connection: Connection
  amount: number
}): Promise<[Account, Transaction, Transaction]> => {
  // if SOL - create new token address

  const tokenMint = new Token(
    wallet,
    connection,
    WRAPPED_SOL_MINT,
    TOKEN_PROGRAM_ID
  )

  const [
    createdWrappedAccountPubkey,
    createWrappedAccountTransaction,
    createWrappedAccount,
  ] = await Token.createWrappedNativeAccount(
    wallet,
    connection,
    TOKEN_PROGRAM_ID,
    wallet.publicKey,
    amount
  )

  const [closeAccountTransaction] = await tokenMint.closeAccount(
    createdWrappedAccountPubkey,
    wallet.publicKey,
    wallet.publicKey,
    []
  )

  return [
    createWrappedAccount,
    createWrappedAccountTransaction,
    closeAccountTransaction,
  ]
}

const createFarmingStateAccount = async ({
  wallet,
  connection,
}: {
  wallet: WalletAdapter
  connection: Connection
}): Promise<[Account, Transaction]> => {
  // Allocate memory for the account
  const balanceNeeded = await connection.getMinimumBalanceForRentExemption(
    TokenFarmingLayout.span
  )

  const farmingStateAccount = new Account()
  const transaction = new Transaction()

  transaction.add(
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: farmingStateAccount.publicKey,
      lamports: balanceNeeded,
      space: TokenFarmingLayout.span,
      programId: TOKEN_SWAP_PROGRAM_ID,
    })
  )

  return [farmingStateAccount, transaction]
}

export const getParsedTransactionData = async ({
  connection,
  signature,
}: {
  connection: Connection
  signature: TransactionSignature
}) => {
  try {
    const ts = await connection.getParsedConfirmedTransaction(
      signature,
      'confirmed'
    )
    console.log('transaction data: ', ts)
  } catch (e) {
    console.log('e', e)
  }
}

export const getPools = async (connection, tokenSwapProgramId) => {
  const tokenSwapOwnedAccounts = await connection.getProgramAccounts(
    tokenSwapProgramId,
    'finalized'
  )

  console.log(
    'tokenSwapOwnedAccounts',
    tokenSwapOwnedAccounts
      .filter((a) => a.account.data.length === 537)
      .map((a) => a.pubkey.toString())
  )
}

export const getMarketByTokens = async (
  connection: Connection,
  tokenA: PublicKey,
  tokenB: PublicKey
) => {
  const markets = await connection.getProgramAccounts(DEX_PID, {
    filters: [
      { memcmp: { offset: MARKET_STATE_LAYOUT_V3.offsetOf('baseMint'), bytes: tokenA.toBase58() } },
      { memcmp: { offset: MARKET_STATE_LAYOUT_V3.offsetOf('quoteMint'), bytes: tokenB.toBase58() } },
    ],
  })

  // decode later
  console.log('markets', markets)
}
