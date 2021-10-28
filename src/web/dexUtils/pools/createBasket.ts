import BN from 'bn.js'
import { TokenInstructions } from '@project-serum/serum'
import { WRAPPED_SOL_MINT } from '@project-serum/serum/lib/token-instructions'
import {
  Connection,
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  Transaction,
} from '@solana/web3.js'

import { transferSOLToWrappedAccountAndClose } from '../pools'
import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { POOLS_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { createTokenAccountTransaction, sendTransaction } from '../send'
import { Token } from '../token/token'
import { WalletAdapter } from '../types'

const { TOKEN_PROGRAM_ID } = TokenInstructions

export async function createBasket({
  wallet,
  connection,
  poolPublicKey,
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
  userPoolTokenAccount: PublicKey | null
  userBaseTokenAccount: PublicKey
  userQuoteTokenAccount: PublicKey
  userBaseTokenAmount: number
  userQuoteTokenAmount: number
  transferSOLToWrapped: boolean
}) {
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
    lpTokenFreezeVault,
    ...rest
  } = await program.account.pool.fetch(poolPublicKey)

  console.log('rest', rest)

  const poolToken = new Token(wallet, connection, poolMint, TOKEN_PROGRAM_ID)

  const poolMintInfo = await poolToken.getMintInfo()
  const supply = poolMintInfo.supply.toNumber()

  const tokenMintA = new Token(
    wallet,
    connection,
    baseTokenMint,
    TOKEN_PROGRAM_ID
  )

  const poolTokenA = await tokenMintA.getAccountInfo(baseTokenVault)
  const poolTokenAmountA = poolTokenA.amount.toNumber()

  let poolTokenAmount = Math.floor(
    (supply * userBaseTokenAmount) / poolTokenAmountA
  )

  poolTokenAmount *= 0.99

  // first deposit
  if (supply === 0) {
    poolTokenAmount = 1 * 10 ** 8
  }

  const transactionBeforeDeposit = new Transaction()
  const commonSigners = []

  const transactionAfterDeposit = new Transaction()

  // create pool token account for user if not exist
  if (!userPoolTokenAccount) {
    const {
      transaction: createAccountTransaction,
      newAccountPubkey,
    } = await createTokenAccountTransaction({
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

  try {
    const createBasketTransaction = await program.instruction.createBasket(
      new BN(poolTokenAmount),
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

    const tx = await sendTransaction({
      wallet,
      connection,
      transaction: commonTransaction,
      signers: commonSigners,
      focusPopup: true,
    })

    if (tx) {
      return 'success'
    }
  } catch (e) {
    console.log('deposit catch error', e)

    if (e.message.includes('cancelled')) {
      return 'cancelled'
    }
  }

  return 'failed'
}
