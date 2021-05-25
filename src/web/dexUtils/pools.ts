import { Account, Connection, PublicKey, Transaction } from '@solana/web3.js'

import { Token, TOKEN_PROGRAM_ID } from './token/token'
import {
  CurveType,
  TokenSwap,
  TOKEN_SWAP_PROGRAM_ID,
} from './token-swap/token-swap'
import { WalletAdapter } from './types'
import { sendAndConfirmTransactionViaWallet } from './token/utils/send-and-confirm-transaction-via-wallet'
import { sleep } from './utils'

const SWAP_PROGRAM_OWNER_FEE_ADDRESS = new PublicKey(
  'HfoTxFR1Tm6kGmWgYWD6J7YHVy1UwqSULUGVLXkJqaKN'
)

const OWNER: PublicKey = new PublicKey(
  'HfoTxFR1Tm6kGmWgYWD6J7YHVy1UwqSULUGVLXkJqaKN'
)

const ownerKey = OWNER.toString()

const SLIPPAGE_PERCENTAGE = 5

// Pool fees
const TRADING_FEE_NUMERATOR = 25
const TRADING_FEE_DENOMINATOR = 10000
const OWNER_TRADING_FEE_NUMERATOR = 5
const OWNER_TRADING_FEE_DENOMINATOR = 10000
const OWNER_WITHDRAW_FEE_NUMERATOR = SWAP_PROGRAM_OWNER_FEE_ADDRESS ? 0 : 1
const OWNER_WITHDRAW_FEE_DENOMINATOR = SWAP_PROGRAM_OWNER_FEE_ADDRESS ? 0 : 6
const HOST_FEE_NUMERATOR = 20
const HOST_FEE_DENOMINATOR = 100

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
}: {
  wallet: WalletAdapter
  connection: Connection
  mintA: PublicKey
  mintB: PublicKey
  userTokenAccountA: PublicKey
  userTokenAccountB: PublicKey
  userAmountTokenA: number
  userAmountTokenB: number
}): Promise<void> {
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
    2,
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

  console.log('creating token A', mintA.toString())
  const mintTokenA = new Token(wallet, connection, mintA, TOKEN_PROGRAM_ID)
  const [
    poolTokenAccountA,
    poolTokenAccountASignature,
    createPoolTokenAccountATransaction,
  ] = await mintTokenA.createAccount(authority)

  console.log('creating token B')
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
    createPoolTokenAccountATransaction,
    createPoolTokenAccountBTransaction
  )

  const createAccountsSignatures = [
    tokenAccountPoolSignature,
    tokenPoolMintSignature,
    poolTokenAccountASignature,
    feeAccountSignature,
    poolTokenAccountBSignature,
  ]

  await sendAndConfirmTransactionViaWallet(
    wallet,
    connection,
    createAccountsTransactions,
    ...createAccountsSignatures
  )

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

  const leftTransactions = new Transaction()

  leftTransactions.add(
    mintTokenATransferTransaction,
    mintTokenBTransferTransaction
  )

  console.log('createTokenSwap')
  const tokenSwap = await TokenSwap.createTokenSwap(
    wallet,
    connection,
    tokenSwapAccount,
    authority,
    poolTokenAccountA,
    poolTokenAccountB,
    tokenPoolMint.publicKey,
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
    leftTransactions
  )

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
}: {
  wallet: WalletAdapter
  connection: Connection
  tokenSwapPublicKey: PublicKey
  poolTokenAccount?: PublicKey
  userTokenAccountA: PublicKey
  userTokenAccountB: PublicKey
  userAmountTokenA: number
  userAmountTokenB: number
}): Promise<void> {
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

  const userTransferAuthority = new Account()

  console.log('approving token a')
  const tokenMintAApproveTransaction = await tokenMintA.approve(
    userTokenAccountA,
    userTransferAuthority.publicKey,
    wallet.publicKey,
    [],
    userAmountTokenA
  )

  console.log('Creating depositor token b account')
  const tokenMintB = new Token(wallet, connection, mintB, TOKEN_PROGRAM_ID)
  const tokenMintBApproveTransaction = await tokenMintB.approve(
    userTokenAccountB,
    userTransferAuthority.publicKey,
    wallet.publicKey,
    [],
    userAmountTokenB
  )

  const previousTransactions = new Transaction()

  if (!isUserAlreadyHasPoolTokenAccount && newAccountPoolTransaction) {
    previousTransactions.add(newAccountPoolTransaction)
  }

  previousTransactions.add(
    tokenMintAApproveTransaction,
    tokenMintBApproveTransaction
  )

  if (!userPoolTokenAccount) {
    console.error("User's token account was not provided or created")
    return
  }

  console.log('Depositing into swap')
  let counter = 0
  while (counter < SLIPPAGE_PERCENTAGE) {
    try {
      const depositSignature = await tokenSwap.depositAllTokenTypes(
        userTokenAccountA,
        userTokenAccountB,
        userPoolTokenAccount,
        userTransferAuthority,
        poolTokenAmount,
        userAmountTokenA,
        userAmountTokenB,
        previousTransactions,
        // signature for creating new account
        [
          ...(isUserAlreadyHasPoolTokenAccount || !newAccountPoolSignature
            ? []
            : [newAccountPoolSignature]),
        ]
      )

      console.log('depositSignature', depositSignature)

      if (depositSignature) break
    } catch (e) {
      console.log('deposit catch error', e)
      counter++
      poolTokenAmount *= 0.99
    }
  }

  // tests

  // let info;
  // info = await tokenMintA.getAccountInfo(userTokenAccountA);
  // assert(info.amount.toNumber() == 0);
  // info = await tokenMintB.getAccountInfo(userTokenAccountB);
  // assert(info.amount.toNumber() == 0);
  // info = await tokenMintA.getAccountInfo(tokenAccountA);
  // assert(info.amount.toNumber() == currentSwapTokenA + userAmountTokenA);
  // currentSwapTokenA += userAmountTokenA;
  // info = await tokenMintB.getAccountInfo(tokenAccountB);
  // assert(info.amount.toNumber() == currentSwapTokenB + userAmountTokenB);
  // currentSwapTokenB += userAmountTokenB;
  // info = await tokenPool.getAccountInfo(newAccountPool);
  // assert(info.amount.toNumber() == poolTokenAmount);
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
}): Promise<void> {
  const tokenSwap = await TokenSwap.loadTokenSwap(
    wallet,
    connection,
    tokenSwapPublicKey,
    TOKEN_SWAP_PROGRAM_ID
  )

  const { poolToken: poolTokenMint } = tokenSwap

  const tokenPool = new Token(
    wallet,
    connection,
    poolTokenMint,
    TOKEN_PROGRAM_ID
  )

  let [withdrawAmountTokenA, withdrawAmountTokenB] = await getMaxWithdrawAmount(
    {
      wallet,
      connection,
      tokenSwapPublicKey,
      poolTokenAmount,
      tokenSwap,
    }
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

  console.log('Withdrawing pool tokens for A and B tokens')
  let counter = 0
  while (counter < SLIPPAGE_PERCENTAGE) {
    try {
      const withdrawSignature = await tokenSwap.withdrawAllTokenTypes(
        userTokenAccountA,
        userTokenAccountB,
        poolTokenAccount,
        userTransferAuthority,
        poolTokenAmount - feeAmount,
        withdrawAmountTokenA,
        withdrawAmountTokenB,
        tokenPoolApproveTransaction
      )
      if (withdrawSignature) break
    } catch (e) {
      console.log('withdraw catch error', e, e.includes('cancelled'))
      counter++
      withdrawAmountTokenA *= 0.99
      withdrawAmountTokenB *= 0.99
    }
  }
}

/**
 * Get max amount in tokenA and tokenB to withdrawal from pool
 *
 * @param wallet The Wallet that will sign transactions
 * @param connection The connection to use
 * @param tokenSwapPublicKey The public key
 * @param poolTokenAmount The amount of tokenB to tranfer to the pool token account address
 * @param tokenSwap Loaded TokenSwap interface
 */
export const getMaxWithdrawAmount = async ({
  wallet,
  connection,
  tokenSwapPublicKey,
  poolTokenAmount,
  tokenSwap,
}: {
  wallet: WalletAdapter
  connection: Connection
  tokenSwapPublicKey: PublicKey
  poolTokenAmount: number
  tokenSwap?: TokenSwap
}): Promise<[number, number]> => {
  let tokenSwapClass = tokenSwap

  if (!tokenSwapClass) {
    tokenSwapClass = await TokenSwap.loadTokenSwap(
      wallet,
      connection,
      tokenSwapPublicKey,
      TOKEN_SWAP_PROGRAM_ID
    )
  }

  const {
    tokenAccountA,
    tokenAccountB,
    mintA,
    mintB,
    poolToken: poolTokenMint,
  } = tokenSwapClass

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

  const tokenMintB = new Token(wallet, connection, mintB, TOKEN_PROGRAM_ID)
  const poolTokenB = await tokenMintB.getAccountInfo(tokenAccountB)
  const poolTokenAmountB = poolTokenB.amount.toNumber()

  const withdrawAmountTokenA = (poolTokenAmountA * poolTokenAmount) / supply
  const withdrawAmountTokenB = (poolTokenAmountB * poolTokenAmount) / supply

  console.log('withdraw', {
    poolTokenAmountA,
    poolTokenAmountB,
    poolTokenAmount,
    supply,
  })

  return [withdrawAmountTokenA, withdrawAmountTokenB]
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
}): Promise<[Transaction, Account]> {
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

  const userTransferAuthority = new Account()
  const sourceTokenMint = new Token(
    wallet,
    connection,
    sourceMint,
    TOKEN_PROGRAM_ID
  )

  const approveTransaction = await sourceTokenMint.approve(
    userSourceAccount,
    userTransferAuthority.publicKey,
    wallet.publicKey,
    [],
    swapAmountIn
  )

  const [swapTransaction, signer] = await tokenSwap.swap(
    userSourceAccount,
    poolSourceAccount,
    poolDestinationAccount,
    userDestinationAccount,
    null, // host fees, add later
    userTransferAuthority,
    swapAmountIn,
    swapAmountOut
  )

  const commonTransaction = new Transaction().add(
    approveTransaction,
    swapTransaction
  )

  return [commonTransaction, signer]
}
