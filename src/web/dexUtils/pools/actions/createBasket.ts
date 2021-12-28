import { Program } from '@project-serum/anchor'
import { TokenInstructions } from '@project-serum/serum'
import { WRAPPED_SOL_MINT } from '@project-serum/serum/lib/token-instructions'
import {
  Account,
  PublicKey,
  Signer,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  Transaction,
} from '@solana/web3.js'
import BN from 'bn.js'

import { isCancelledTransactionError } from '../../common/isCancelledTransactionError'
import MultiEndpointsConnection from '../../MultiEndpointsConnection'
import { transferSOLToWrappedAccountAndClose } from '../../pools'
import { ProgramsMultiton } from '../../ProgramsMultiton/ProgramsMultiton'
import { getPoolsProgramAddress } from '../../ProgramsMultiton/utils'
import { createTokenAccountTransaction } from '../../send'
import { Token } from '../../token/token'
import { signAndSendSingleTransaction } from '../../transactions'
import { WalletAdapter } from '../../types'

const { TOKEN_PROGRAM_ID } = TokenInstructions

interface CreateBasketBase {
  poolPublicKey: PublicKey
  userPoolTokenAccount?: PublicKey | null
  wallet: WalletAdapter
  connection: MultiEndpointsConnection
  userBaseTokenAmount: BN
  userQuoteTokenAmount: BN
  userBaseTokenAccount: PublicKey
  userQuoteTokenAccount: PublicKey
  transferSOLToWrapped?: boolean
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
}

async function createBasketTransaction(
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

  let poolTokenAmount: BN

  // first deposit
  if (supply.eq(new BN(0))) {
    poolTokenAmount = new BN(1 * 10 ** 8)
  } else {
    poolTokenAmount = supply
      .mul(new BN(userBaseTokenAmount))
      .div(poolTokenAmountA)
      .div(new BN(100))
      .mul(new BN(99))
  }

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
      connection: connection.getConnection(),
      amount: userBaseTokenAmount.toNumber(),
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
      connection: connection.getConnection(),
      amount: userQuoteTokenAmount.toNumber(),
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
 async function createBasket(params: CreateBasketParams) {
  const { wallet, connection, poolPublicKey } = params
  try {
    const program = ProgramsMultiton.getProgramByAddress({
      wallet,
      connection: connection.getConnection(),
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
    const poolToken = new Token(
      wallet,
      connection.getConnection(),
      poolMint,
      TOKEN_PROGRAM_ID
    )

    const poolMintInfo = await poolToken.getMintInfo()
    const { supply } = poolMintInfo

    const tokenMintA = new Token(
      wallet,
      connection.getConnection(),
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

    return signAndSendSingleTransaction({
      wallet,
      connection: connection.getConnection(),
      signers: commonSigners,
      transaction: commonTransaction,
    })
  } catch (e) {
    console.log('deposit catch error', e)

    if (isCancelledTransactionError(e)) {
      return 'cancelled'
    }
    return 'failed'
  }
}

export { createBasketTransaction, createBasket }
