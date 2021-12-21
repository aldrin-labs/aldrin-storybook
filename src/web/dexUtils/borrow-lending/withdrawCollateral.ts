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

export const withdrawCollateral = async ({
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

    console.log(program)
    const [lendingMarketPda, lendingMarketBumpSeed] =
        await PublicKey.findProgramAddress(
            [Buffer.from(new PublicKey('6zstoyUpKZ7iiuDND8th19BQHXrUmZ3auqxN2Ujq5vuz').toBytes())],
            new PublicKey(programAddress)
        );


    const transaction = new Transaction();

    const reservesPkToRefresh: PublicKey[] | [] = obligationDetails.reserves.map((r) => {
        return r.collateral?.inner.depositReserve || r.liquidity?.inner.borrowReserve
    }).filter(Boolean);

    console.log('reservesPkToRefresh', reservesPkToRefresh)

    reservesPkToRefresh.forEach((reservePk: PublicKey) => {
        transaction.add(program.instruction.refreshReserve({
            accounts: {
                reserve: reservePk,
                oraclePrice: reserve.liquidity.oracle,
                clock: SYSVAR_CLOCK_PUBKEY,
            },
        }));
    })

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

    transaction.add(program.instruction.withdrawObligationCollateral(lendingMarketBumpSeed, amount, {
        accounts: {
            borrower: wallet.publicKey,
            lendingMarketPda: lendingMarketPda,
            obligation: obligation.pubkey,
            reserve: reserve.publicKey,
            sourceCollateralWallet: reserve.collateral.supply,
            destinationCollateralWallet: collateralWallet,
            tokenProgram: TOKEN_PROGRAM_ID,
            clock: SYSVAR_CLOCK_PUBKEY,
        },
    }));

    transaction.add(refreshObligationInstruction);

    return await sendTransaction({
        transaction: transaction,
        wallet,
        signers: [],
        connection,
        focusPopup: true,
    });
}
