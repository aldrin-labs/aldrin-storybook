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

export const depositLiquidity = async ({
  wallet,
  connection,
  programAddress = BORROW_LENDING_PROGRAM_ADDRESS,
  reserve,
  amount,
}: {
  wallet: WalletAdapter
  connection: Connection
  programAddress?: string
  reserve: any
  amount: BN
}) => {
  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress,
  })

  console.log(program)
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

  const collateralWallet = await checkAccountForMint({
    wallet,
    connection,
    mint: reserve.collateral.mint,
    create: true,
  })
  const sourceLiquidityWallet = await checkAccountForMint({
    wallet,
    connection,
    mint: reserve.liquidity.mint,
    create: true,
  })

  console.log(
    'depositLiqCollateralWallet',
    collateralWallet.toString(),
    sourceLiquidityWallet.toString()
  )

  const refreshReserveInstruction = program.instruction.refreshReserve({
    accounts: {
      reserve: reserve.publicKey,
      oraclePrice: reserve.liquidity.oracle,
      clock: SYSVAR_CLOCK_PUBKEY,
    },
  })

  const depositReserveInstruction = program.instruction.depositReserveLiquidity(
    lendingMarketBumpSeed,
    amount,
    {
      accounts: {
        funder: wallet.publicKey,
        lendingMarketPda, // from the snippet above
        reserve: reserve.publicKey,
        reserveCollateralMint: reserve.collateral.mint, // reserve.collateral.mint
        reserveLiquidityWallet: reserve.liquidity.supply, // reserve.liquidity.supply wallet
        sourceLiquidityWallet, // this is your liquidity wallet that we've just created with that ritual
        destinationCollateralWallet: collateralWallet, // you must check if the user already has SPL token wallet for the collateral mint
        tokenProgram: TOKEN_PROGRAM_ID, // this should be in some constants from anchor
        clock: SYSVAR_CLOCK_PUBKEY, // same as this ^
      },
    }
  )

  return signAndSendSingleTransaction({
    transaction: new Transaction()
      .add(refreshReserveInstruction)
      .add(depositReserveInstruction)
      .add(refreshReserveInstruction),
    wallet,
    signers: [],
    connection,
    focusPopup: true,
  })
}
