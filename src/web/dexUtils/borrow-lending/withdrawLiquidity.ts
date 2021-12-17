import {
    Connection, PublicKey, SYSVAR_CLOCK_PUBKEY, Transaction,
} from '@solana/web3.js'
import { Token, TOKEN_PROGRAM_ID } from '@sb/dexUtils/token/token'
import BN from 'bn.js'
import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { BORROW_LENDING_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { WalletAdapter } from '../types'
import {checkAccountForMint} from '@sb/dexUtils/borrow-lending/checkAccountForMint';
import {sendTransaction} from '@sb/dexUtils/send';

export const withdrawLiquidity = async ({
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
    programAddress?: string,
    reserve: any,
    obligation: any,
    obligationDetails: any,
    amount: BN
}) => {
    const program = ProgramsMultiton.getProgramByAddress({
        wallet,
        connection,
        programAddress,
    })

    const collateralWallet = await checkAccountForMint({wallet, connection, mint: reserve.collateral.mint, create: false});
    const liquidityWallet = await checkAccountForMint({wallet, connection, mint: reserve.liquidity.mint, create: false});

    console.log(program)
    const [lendingMarketPda, lendingMarketBumpSeed] =
        await PublicKey.findProgramAddress(
            [Buffer.from(new PublicKey('6zstoyUpKZ7iiuDND8th19BQHXrUmZ3auqxN2Ujq5vuz').toBytes())],
            new PublicKey(programAddress)
        );


    const transaction = new Transaction();

    transaction.add(program.instruction.refreshReserve({
        accounts: {
            reserve: reserve.publicKey,
            oraclePrice: reserve.liquidity.oracle,
            clock: SYSVAR_CLOCK_PUBKEY,
        },
    }))

    transaction.add(program.instruction.redeemReserveCollateral(lendingMarketBumpSeed, amount, {
        accounts: {
            funder: wallet.publicKey,
            lendingMarketPda: lendingMarketPda,
            destinationLiquidityWallet: liquidityWallet,
            reserve: reserve.publicKey,
            reserveCollateralMint: reserve.collateral.mint,
            sourceCollateralWallet: collateralWallet,
            reserveLiquidityWallet: reserve.liquidity.supply,
            tokenProgram: TOKEN_PROGRAM_ID,
            clock: SYSVAR_CLOCK_PUBKEY,
        },
    }));

    return await sendTransaction({
        transaction: transaction,
        wallet,
        signers: [],
        connection,
        focusPopup: true,
    });
}
