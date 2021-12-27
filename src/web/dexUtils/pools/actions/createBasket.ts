import BN from 'bn.js'
import { TokenInstructions } from '@project-serum/serum'
import { WRAPPED_SOL_MINT } from '@project-serum/serum/lib/token-instructions'
import {
  Connection,
  PublicKey,
  Signer,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  Transaction,
} from '@solana/web3.js'

import { transferSOLToWrappedAccountAndClose } from '@sb/dexUtils/pools'
import { ProgramsMultiton } from '@sb/dexUtils/ProgramsMultiton/ProgramsMultiton'
import { getPoolsProgramAddress } from '@sb/dexUtils/ProgramsMultiton/utils'
import {
  createTokenAccountTransaction,
  isTransactionFailed,
  sendTransaction,
} from '@sb/dexUtils/send'
import { Token } from '@sb/dexUtils/token/token'
import { WalletAdapter } from '@sb/dexUtils/types'
import { isCancelledTransactionError } from '@sb/dexUtils/common/isCancelledTransactionError'

const { TOKEN_PROGRAM_ID } = TokenInstructions

const getCreateBasketTransaction = async ({
  wallet,
  connection,
  poolPublicKey,
  curveType,
  userPoolTokenAccount,
  userBaseTokenAccount,
  userQuoteTokenAccount,
  userBaseTokenAmount,
  userQuoteTokenAmount,
  transferSOLToWrapped,
}: {
  wallet: WalletAdapter
  connection: Connection
  poolPublicKey: PublicKey
  curveType: number | null
  userPoolTokenAccount: PublicKey | null
  userBaseTokenAccount: PublicKey
  userQuoteTokenAccount: PublicKey
  userBaseTokenAmount: number
  userQuoteTokenAmount: number
  transferSOLToWrapped: boolean
}): Promise<[Transaction, Signer[]]> => {
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
  } = await program.account.pool.fetch(poolPublicKey)

  const poolToken = new Token(wallet, connection, poolMint, TOKEN_PROGRAM_ID)

  const poolMintInfo = await poolToken.getMintInfo()
  const supply = poolMintInfo.supply

  const tokenMintA = new Token(
    wallet,
    connection,
    baseTokenMint,
    TOKEN_PROGRAM_ID
  )

  const poolTokenA = await tokenMintA.getAccountInfo(baseTokenVault)
  const poolTokenAmountA = poolTokenA.amount

  let poolTokenAmount

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
  const commonSigners = []

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

  let commonTransaction = new Transaction()

  const createBasketTransaction = await program.instruction.createBasket(
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
  commonTransaction.add(createBasketTransaction)
  commonTransaction.add(transactionAfterDeposit)

  return [commonTransaction, commonSigners]
}

const createBasket = async ({
  wallet,
  connection,
  poolPublicKey,
  curveType,
  userPoolTokenAccount,
  userBaseTokenAccount,
  userQuoteTokenAccount,
  userBaseTokenAmount,
  userQuoteTokenAmount,
  transferSOLToWrapped,
}: {
  wallet: WalletAdapter
  connection: Connection
  poolPublicKey: PublicKey
  curveType: number | null
  userPoolTokenAccount: PublicKey | null
  userBaseTokenAccount: PublicKey
  userQuoteTokenAccount: PublicKey
  userBaseTokenAmount: number
  userQuoteTokenAmount: number
  transferSOLToWrapped: boolean
}) => {
  try {
    const [commonTransaction, commonSigners] = await getCreateBasketTransaction(
      {
        wallet,
        connection,
        poolPublicKey,
        curveType,
        userPoolTokenAccount,
        userBaseTokenAccount,
        userQuoteTokenAccount,
        userBaseTokenAmount,
        userQuoteTokenAmount,
        transferSOLToWrapped,
      }
    )

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

export { getCreateBasketTransaction, createBasket }
