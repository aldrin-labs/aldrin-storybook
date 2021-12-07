import { Program } from '@project-serum/anchor'
import { TokenInstructions } from '@project-serum/serum'
import { WRAPPED_SOL_MINT } from '@project-serum/serum/lib/token-instructions'
import {
  Account,
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  Connection,
} from '@solana/web3.js'
import BN from 'bn.js'
import { isCancelledTransactionError } from '../../common/isCancelledTransactionError'
import { transferSOLToWrappedAccountAndClose } from '../../pools'
import { ProgramsMultiton } from '../../ProgramsMultiton/ProgramsMultiton'
import { getPoolsProgramAddress } from '../../ProgramsMultiton/utils'
import {
  createTokenAccountTransaction,
  isTransactionFailed,
  sendTransaction,
} from '../../send'
import { Token } from '../../token/token'
import { WalletAdapter } from '../../types'

const { TOKEN_PROGRAM_ID } = TokenInstructions

interface CreateBasketBase {
  poolPublicKey: PublicKey
  userPoolTokenAccount?: PublicKey | null
  wallet: WalletAdapter
  connection: Connection
  userBaseTokenAmount: BN
  userQuoteTokenAmount: BN
  userBaseTokenAccount: PublicKey
  userQuoteTokenAccount: PublicKey
}

export interface CreateBasketTransactionParams extends CreateBasketBase {
  baseTokenMint: PublicKey
  baseTokenVault: PublicKey
  quoteTokenMint: PublicKey
  quoteTokenVault: PublicKey
  poolMint: PublicKey
  lpTokenFreezeVault: PublicKey
  program: Program
  supply: BN
  poolTokenAmountA: BN
  transferSOLToWrapped?: boolean
}

export async function createBasketTransaction(
  params: CreateBasketTransactionParams
): Promise<[Transaction, Account[]]> {
  const {
    program,
    poolPublicKey,
    userBaseTokenAmount,
    userQuoteTokenAmount,
    transferSOLToWrapped,
    supply,
    poolTokenAmountA,
    wallet,
    poolMint,
    baseTokenMint,
    connection,
    quoteTokenMint,
    baseTokenVault,
    quoteTokenVault,
  } = params

  let { userPoolTokenAccount, userBaseTokenAccount, userQuoteTokenAccount } =
    params

  const [vaultSigner] = await PublicKey.findProgramAddress(
    [poolPublicKey.toBuffer()],
    program.programId
  )

  const poolTokenAmount = /* first deposit */ supply.eqn(0)
    ? new BN(1 * 10 ** 8)
    : supply
        .mul(new BN(userBaseTokenAmount))
        .div(poolTokenAmountA)
        .muln(99)
        .divn(100)

  const transactionBeforeDeposit = new Transaction()
  const commonSigners: Account[] = []

  const transactionAfterDeposit = new Transaction()

  // create pool token account for user if not exist
  if (!userPoolTokenAccount) {
    const { transaction: createAccountTransaction, newAccountPubkey } =
      await createTokenAccountTransaction({
        wallet,
        mintPublicKey: new PublicKey(poolMint),
      })

    userPoolTokenAccount = newAccountPubkey
    transactionBeforeDeposit.add(createAccountTransaction)
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

  const commonTransaction = new Transaction()

  const createBasketTx = await program.instruction.createBasket(
    poolTokenAmount,
    new BN(userBaseTokenAmount),
    new BN(userQuoteTokenAmount),
    {
      accounts: {
        pool: poolPublicKey,
        poolMint,
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
  commonTransaction.add(createBasketTx)
  commonTransaction.add(transactionAfterDeposit)

  return [commonTransaction, commonSigners]
}

export interface CreateBasketParams extends CreateBasketBase {
  curveType: number | null
}

export async function createBasket(params: CreateBasketParams) {
  const { wallet, connection, poolPublicKey } = params
  try {
    const program = ProgramsMultiton.getProgramByAddress({
      wallet,
      connection,
      programAddress: getPoolsProgramAddress({ curveType: params.curveType }),
    })

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
    const poolToken = new Token(wallet, connection, poolMint, TOKEN_PROGRAM_ID)

    const poolMintInfo = await poolToken.getMintInfo()
    const { supply } = poolMintInfo

    const tokenMintA = new Token(
      wallet,
      connection,
      baseTokenMint,
      TOKEN_PROGRAM_ID
    )

    const poolTokenA = await tokenMintA.getAccountInfo(baseTokenVault)
    const poolTokenAmountA = poolTokenA.amount

    const [commonTransaction, commonSigners] = await createBasketTransaction({
      ...params,
      baseTokenMint,
      baseTokenVault,
      quoteTokenMint,
      quoteTokenVault,
      poolMint,
      lpTokenFreezeVault,
      supply,
      poolTokenAmountA,
      program,
    })

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
    console.log('deposit catch error', e)

    if (isCancelledTransactionError(e)) {
      return 'cancelled'
    }
  }

  return 'success'
}
