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

export const depositObligationCollateral = async ({
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
    console.log('reservesPkToRefresh', reservesPkToRefresh)

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

    refreshReservesInstructions()

    console.log(transaction, 'newtransaction')

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

    transaction.add(program.instruction.depositObligationCollateral(amount, {
        accounts: {
            borrower: wallet.publicKey,
            obligation: obligation.pubkey,
            reserve: reserve.publicKey,
            sourceCollateralWallet: collateralWallet,
            destinationCollateralWallet: reserve.collateral.supply,
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
