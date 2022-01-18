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

export const repayObligationLiquidity = async ({
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
  reserve: any
  obligation: any
  obligationDetails: any
  amount: BN
}) => {
  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress,
  })

  console.log('amountRepay', amount.toString())
  const sourceLiquidityWallet = await checkAccountForMint({
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
    if (reserveRefresh.toString() !== reserve.publicKey.toString()) {
      reservesPkToRefresh.push(reserve.publicKey.toString())
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
      obligation: obligation.pubkey,
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
    program.instruction.repayObligationLiquidity(amount, {
      accounts: {
        repayer: wallet.publicKey,
        obligation: obligation.pubkey,
        reserve: reserve.publicKey,
        sourceLiquidityWallet,
        destinationLiquidityWallet: reserve.liquidity.supply,
        tokenProgram: TOKEN_PROGRAM_ID,
        clock: SYSVAR_CLOCK_PUBKEY,
      },
    })
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
