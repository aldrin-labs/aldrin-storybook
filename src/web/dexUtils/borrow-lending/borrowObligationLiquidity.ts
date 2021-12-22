import {
    Connection, PublicKey, SYSVAR_CLOCK_PUBKEY, Transaction,
} from '@solana/web3.js'
import { Token, TOKEN_PROGRAM_ID } from '@sb/dexUtils/token/token'
import BN from 'bn.js'
import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { BORROW_LENDING_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { WalletAdapter } from '../types'
import {sendTransaction} from '@sb/dexUtils/send';
import {checkAccountForMint} from "@sb/dexUtils/borrow-lending/checkAccountForMint";

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

    const [lendingMarketPda, lendingMarketBumpSeed] =
        await PublicKey.findProgramAddress(
            [Buffer.from(new PublicKey('6zstoyUpKZ7iiuDND8th19BQHXrUmZ3auqxN2Ujq5vuz').toBytes())],
            new PublicKey(programAddress)
        );
console.log('amountBorrow', amount.toString())
    const destinationLiquidityWallet = await checkAccountForMint({wallet, connection, mint: reserve.liquidity.mint, create: false});

    const transaction = new Transaction();

    let reservesPkToRefresh: string[] | [] = obligationDetails.reserves.map((r) => {
        return r.collateral?.inner.depositReserve.toString() || r.liquidity?.inner.borrowReserve.toString()
    }).filter(Boolean);

    reservesPkToRefresh.forEach(reserveRefresh => {
        if(reserveRefresh.toString() !== reserve.publicKey.toString()) {
            reservesPkToRefresh.push(reserve.publicKey.toString())
        }
    })

    reservesPkToRefresh = [...new Set(reservesPkToRefresh)];

    const refreshReservesInstructions = () => {
        reservesPkToRefresh.forEach((reservePk: string) => {
            transaction.add(program.instruction.refreshReserve({
                accounts: {
                    reserve: new PublicKey(reservePk),
                    oraclePrice: reserve.liquidity.oracle,
                    clock: SYSVAR_CLOCK_PUBKEY,
                },
            }));
        })
    }

    refreshReservesInstructions();

    const refreshObligationInstruction = program.instruction.refreshObligation({
        accounts: {
            obligation: obligation.pubkey,
            clock: SYSVAR_CLOCK_PUBKEY,
        },
        remainingAccounts: reservesPkToRefresh.map(pubkey => ({
            pubkey, isSigner: false, isWritable: false,
        })),
    });

    transaction.add(refreshObligationInstruction);

    transaction.add(program.instruction.borrowObligationLiquidity(lendingMarketBumpSeed, amount, {
        accounts: {
            borrower: wallet.publicKey,
            obligation: obligation.pubkey,
            reserve: reserve.publicKey,
            lendingMarketPda: lendingMarketPda,
            sourceLiquidityWallet: reserve.liquidity.supply,
            destinationLiquidityWallet: destinationLiquidityWallet,
            feeReceiver: reserve.liquidity.feeReceiver,
            tokenProgram: TOKEN_PROGRAM_ID,
            clock: SYSVAR_CLOCK_PUBKEY,
        },
    }))

    refreshReservesInstructions();

    transaction.add(refreshObligationInstruction);


    return await sendTransaction({
        transaction: transaction,
        wallet,
        signers: [],
        connection,
        focusPopup: true,
    });
}
