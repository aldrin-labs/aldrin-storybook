import BN from 'bn.js'
import { TokenInstructions } from '@project-serum/serum'
import { WRAPPED_SOL_MINT } from '@project-serum/serum/lib/token-instructions'
import {
  Connection,
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  Transaction,
} from '@solana/web3.js'

import { notify } from '../notifications'
import {
  createSOLAccountAndClose,
  getMaxWithdrawAmount,
  NUMBER_OF_RETRIES,
} from '../pools'
import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { POOLS_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { sendTransaction } from '../send'
import { WalletAdapter } from '../types'

const { TOKEN_PROGRAM_ID } = TokenInstructions

const loadUserTicketsPerPool = async ({
  wallet,
  connection,
  poolPublicKey,
}: {
  wallet: WalletAdapter
  connection: Connection
  poolPublicKey: PublicKey
}) => {
  return await connection.getProgramAccounts(
    new PublicKey(POOLS_PROGRAM_ADDRESS),
    {
      commitment: 'finalized',
      filters: [
        {
          dataSize: 88,
        },
        {
          memcmp: {
            offset: 8 + 16 + 32,
            bytes: poolPublicKey.toBase58(),
          },
        },
        {
          memcmp: {
            offset: 8 + 16,
            bytes: wallet.publicKey.toBase58(),
          },
        },
      ],
    }
  )
}

export async function redeemBasket({
  wallet,
  connection,
  poolPublicKey,
  userPoolTokenAccount,
  userBaseTokenAccount,
  userQuoteTokenAccount,
  userPoolTokenAmount,
}: {
  wallet: WalletAdapter
  connection: Connection
  poolPublicKey: PublicKey
  userPoolTokenAccount: PublicKey | null
  userBaseTokenAccount: PublicKey
  userQuoteTokenAccount: PublicKey
  userPoolTokenAmount: number
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

  const tickets = await loadUserTicketsPerPool({
    wallet,
    connection,
    poolPublicKey,
  })

  const allUserTicketsPerPool = tickets.map((ticket) => {
    const data = Buffer.from(ticket.account.data)
    const ticketData = program.coder.accounts.decode('LPTicket', data)

    return {
      lpTicketAddress: ticket.pubkey.toString(),
      lpTokens: ticketData.lpTokens.toNumber(),
      pool: ticketData.pool.toString(),
      userKey: ticketData.userKey.toString(),
    }
  })

  const {
    baseTokenMint,
    baseTokenVault,
    quoteTokenMint,
    quoteTokenVault,
    poolMint,
    feeBaseAccount,
    feeQuoteAccount,
  } = await program.account.pool.fetch(poolPublicKey)

  let [
    baseTokenAmountToWithdraw,
    quoteTokenAmountToWithdraw,
  ] = await getMaxWithdrawAmount({
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

  // baseTokenAmountToWithdraw *= 0.99
  // quoteTokenAmountToWithdraw *= 0.99

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

  let counter = 0
  let commonTransaction = new Transaction()

  while (counter < NUMBER_OF_RETRIES) {
    try {
      if (counter > 0) {
        await notify({
          type: 'error',
          message:
            'Withdraw failed, trying with bigger slippage. Please confirm transaction again.',
        })
      }

      let leftToWithdrawPoolTokens = userPoolTokenAmount

      // add creation of sol account if needed
      commonTransaction.add(transactionBeforeWithdraw)

      for (let ticketData of allUserTicketsPerPool) {
        if (leftToWithdrawPoolTokens === 0) continue

        const poolTokensToWithdraw =
          leftToWithdrawPoolTokens > ticketData.lpTokens
            ? ticketData.lpTokens
            : leftToWithdrawPoolTokens

        const percentageOfAllPoolTokensToWithdraw =
          (poolTokensToWithdraw / userPoolTokenAmount) * 100
        const baseTokenAmountToWithdrawFromTicket =
          (baseTokenAmountToWithdraw / 100) *
          percentageOfAllPoolTokensToWithdraw
        const quoteTokenAmountToWithdrawFromTicket =
          (quoteTokenAmountToWithdraw / 100) *
          percentageOfAllPoolTokensToWithdraw

        console.log({
          userPoolTokenAmount,
          ticketData,
          poolTokensToWithdraw,
          percentageOfAllPoolTokensToWithdraw,
          baseTokenAmountToWithdrawFromTicket,
          quoteTokenAmountToWithdrawFromTicket,
        })

        const withdrawTransaction = await program.instruction.redeemBasket(
          new BN(poolTokensToWithdraw),
          new BN(baseTokenAmountToWithdrawFromTicket),
          new BN(quoteTokenAmountToWithdrawFromTicket),
          {
            accounts: {
              pool: poolPublicKey,
              poolMint: poolMint,
              baseTokenVault,
              quoteTokenVault,
              poolSigner: vaultSigner,
              userPoolTokenAccount,
              userBaseTokenAccount,
              userQuoteTokenAccount,
              walletAuthority: wallet.publicKey,
              userSolAccount: wallet.publicKey,
              lpTicket: ticketData.lpTicketAddress,
              tokenProgram: TOKEN_PROGRAM_ID,
              feeBaseAccount,
              feeQuoteAccount,
              clock: SYSVAR_CLOCK_PUBKEY,
            },
          }
        )

        leftToWithdrawPoolTokens -= poolTokensToWithdraw
        commonTransaction.add(withdrawTransaction)
      }

      // add close sol account if needed
      commonTransaction.add(transactionAfterWithdraw)

      const tx = await sendTransaction({
        wallet,
        connection,
        transaction: commonTransaction,
        signers: commonSigners,
      })

      if (tx) {
        return 'success'
      } else {
        commonTransaction = new Transaction()
        counter++
        baseTokenAmountToWithdraw *= 0.99
        quoteTokenAmountToWithdraw *= 0.99
      }
    } catch (e) {
      console.log('withdraw catch error', e)

      commonTransaction = new Transaction()
      counter++
      baseTokenAmountToWithdraw *= 0.99
      quoteTokenAmountToWithdraw *= 0.99

      if (e.message.includes('cancelled')) {
        return 'cancelled'
      }
    }
  }

  return 'failed'
}
