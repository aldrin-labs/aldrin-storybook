import {
  Connection,
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  Transaction,
} from '@solana/web3.js'
import BN from 'bn.js'

import { checkAccountForMint } from '@sb/dexUtils/borrow-lending/checkAccountForMint'
import { TOKEN_PROGRAM_ID } from '@sb/dexUtils/token/token'
import { signAndSendSingleTransaction } from '@sb/dexUtils/transactions'

import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { BORROW_LENDING_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { WalletAdapter } from '../types'
import { Obligation, Reserve } from './types'

export const borrowObligationLiquidity = async ({
  wallet,
  connection,
  programAddress = BORROW_LENDING_PROGRAM_ADDRESS,
  reserve,
  obligation,
  obligationDetails,
  amount,
}: {
  wallet: WalletAdapter
  connection: Connection
  programAddress?: string
  reserve: Reserve
  obligation: Obligation
  obligationDetails: Obligation
  amount: BN
}) => {
  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress,
  })

  const [lendingMarketPda, lendingMarketBumpSeed] =
    await PublicKey.findProgramAddress(
      [
        Buffer.from(
          new PublicKey(
            '6zstoyUpKZ7iiuDND8th19BQHXrUmZ3auqxN2Ujq5vuz'
          ).toBytes()
        ),
      ],
      new PublicKey(programAddress)
    )
  console.log('amountBorrow', amount.toString())
  const destinationLiquidityWallet = await checkAccountForMint({
    wallet,
    connection,
    mint: reserve.liquidity.mint,
    create: false,
  })

  const transaction = new Transaction()

  let reservesPkToRefresh: string[] | [] = obligationDetails.reserves
    .map((r) => {
      return (
        r.collateral?.inner.depositReserve.toString() ||
        r.liquidity?.inner.borrowReserve.toString()
      )
    })
    .filter(Boolean)

  reservesPkToRefresh.forEach((reserveRefresh) => {
    if (reserveRefresh.toString() !== reserve.reserve.toString()) {
      reservesPkToRefresh.push(reserve.reserve.toString())
    }
  })

  reservesPkToRefresh = [...new Set(reservesPkToRefresh)]

  const refreshReservesInstructions = () => {
    reservesPkToRefresh.forEach((reservePk: string) => {
      transaction.add(
        program.instruction.refreshReserve({
          accounts: {
            reserve: new PublicKey(reservePk),
            oraclePrice: reserve.liquidity.oracle,
            clock: SYSVAR_CLOCK_PUBKEY,
          },
        })
      )
    })
  }

  refreshReservesInstructions()

  const refreshObligationInstruction = program.instruction.refreshObligation({
    accounts: {
      obligation: obligation.obligation,
      clock: SYSVAR_CLOCK_PUBKEY,
    },
    remainingAccounts: reservesPkToRefresh.map((pubkey) => ({
      pubkey,
      isSigner: false,
      isWritable: false,
    })),
  })

  transaction.add(refreshObligationInstruction)

  transaction.add(
    program.instruction.borrowObligationLiquidity(
      lendingMarketBumpSeed,
      amount,
      {
        accounts: {
          borrower: wallet.publicKey,
          obligation: obligation.obligation,
          reserve: reserve.reserve,
          lendingMarketPda,
          sourceLiquidityWallet: reserve.liquidity.supply,
          destinationLiquidityWallet,
          feeReceiver: reserve.liquidity.feeReceiver,
          tokenProgram: TOKEN_PROGRAM_ID,
          clock: SYSVAR_CLOCK_PUBKEY,
        },
      }
    )
  )

  refreshReservesInstructions()

  transaction.add(refreshObligationInstruction)

  return signAndSendSingleTransaction({
    transaction,
    wallet,
    signers: [],
    connection,
    focusPopup: true,
  })
}
