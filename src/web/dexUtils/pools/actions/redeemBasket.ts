import { TokenInstructions } from '@project-serum/serum'
import { WRAPPED_SOL_MINT } from '@project-serum/serum/lib/token-instructions'
import { isCancelledTransactionError } from '@sb/dexUtils/common/isCancelledTransactionError'
import {
  createSOLAccountAndClose,
  getMaxWithdrawAmount,
} from '@sb/dexUtils/pools'
import { ProgramsMultiton } from '@sb/dexUtils/ProgramsMultiton/ProgramsMultiton'
import { getPoolsProgramAddress } from '@sb/dexUtils/ProgramsMultiton/utils'
import {
  isTransactionFailed,
  sendTransaction,
  createTokenAccountTransaction,
} from '@sb/dexUtils/send'
import { WalletAdapter } from '@sb/dexUtils/types'
import {
  Connection,
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  Transaction,
} from '@solana/web3.js'
import BN from 'bn.js'
import { VestingWithPk } from '../../vesting/types'
import { withrawVestingInstruction } from '../../vesting/withdrawVesting'

const { TOKEN_PROGRAM_ID } = TokenInstructions

interface Pool {
  baseTokenMint: PublicKey
  baseTokenVault: PublicKey
  quoteTokenMint: PublicKey
  quoteTokenVault: PublicKey
  poolMint: PublicKey
  feeBaseAccount: PublicKey
  feeQuoteAccount: PublicKey
}

export async function redeemBasket(params: {
  wallet: WalletAdapter
  connection: Connection
  curveType: number | null
  poolPublicKey: PublicKey
  userPoolTokenAccount?: PublicKey
  userBaseTokenAccount: PublicKey | null
  userQuoteTokenAccount: PublicKey | null
  userPoolTokenAmount: number
  unlockVesting?: VestingWithPk
}) {
  const {
    wallet,
    connection,
    curveType,
    poolPublicKey,
    userPoolTokenAmount,
    unlockVesting,
  } = params

  let { userPoolTokenAccount } = params

  let { userBaseTokenAccount, userQuoteTokenAccount } = params

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
    feeBaseAccount,
    feeQuoteAccount,
  } = (await program.account.pool.fetch(poolPublicKey)) as Pool

  let [baseTokenAmountToWithdraw, quoteTokenAmountToWithdraw] =
    await getMaxWithdrawAmount({
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

  if (!userBaseTokenAccount) {
    const { transaction: createAccountTransaction, newAccountPubkey } =
      await createTokenAccountTransaction({
        wallet,
        mintPublicKey: new PublicKey(baseTokenMint),
      })

    userBaseTokenAccount = newAccountPubkey
    transactionBeforeWithdraw.add(createAccountTransaction)
  }

  if (!userQuoteTokenAccount) {
    const { transaction: createAccountTransaction, newAccountPubkey } =
      await createTokenAccountTransaction({
        wallet,
        mintPublicKey: new PublicKey(quoteTokenMint),
      })

    userQuoteTokenAccount = newAccountPubkey
    transactionBeforeWithdraw.add(createAccountTransaction)
  }

  if (unlockVesting) {
    const [tx, poolTokenAccount] = await withrawVestingInstruction({
      wallet,
      connection,
      vesting: unlockVesting,
      withdrawAccount: userPoolTokenAccount,
    })
    transactionBeforeWithdraw.add(tx)
    userPoolTokenAccount = poolTokenAccount
  }

  const commonTransaction = new Transaction()

  try {
    commonTransaction.add(transactionBeforeWithdraw)

    const withdrawTransaction = await program.instruction.redeemBasket(
      new BN(userPoolTokenAmount),
      new BN(baseTokenAmountToWithdraw),
      new BN(quoteTokenAmountToWithdraw),
      {
        accounts: {
          pool: poolPublicKey,
          poolMint,
          baseTokenVault,
          quoteTokenVault,
          poolSigner: vaultSigner,
          userPoolTokenAccount,
          userBaseTokenAccount,
          userQuoteTokenAccount,
          walletAuthority: wallet.publicKey,
          userSolAccount: wallet.publicKey,
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

    if (isTransactionFailed(tx)) {
      return 'failed'
    }
  } catch (e) {
    console.log('withdraw catch error', e)

    if (isCancelledTransactionError(e)) {
      return 'cancelled'
    }
  }

  return 'success'
}
