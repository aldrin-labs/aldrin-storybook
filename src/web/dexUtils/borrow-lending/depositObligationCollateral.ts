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
    amount,
}: {
    wallet: WalletAdapter
    connection: Connection
    programAddress?: string,
    reserve: any,
    obligation: any,
    amount: BN
}) => {
    const program = ProgramsMultiton.getProgramByAddress({
        wallet,
        connection,
        programAddress,
    })

    const collateralWallet = await checkAccountForMint({wallet, connection, mint: reserve.collateral.mint, create: false});

    const refreshReserveInstruction = program.instruction.refreshReserve({
        accounts: {
            reserve: new PublicKey('DSTQScWV8B9zxLrhGoopULVvqneVb2rkyhZNu5keEtrr'),
            oraclePrice: reserve.liquidity.oracle,
            clock: SYSVAR_CLOCK_PUBKEY,
        },
    })

    const refreshObligationInstruction = program.instruction.refreshObligation({
        accounts: {
            obligation: obligation.pubkey,
            clock: SYSVAR_CLOCK_PUBKEY,
        },
        remainingAccounts: [{
            pubkey: new PublicKey('DSTQScWV8B9zxLrhGoopULVvqneVb2rkyhZNu5keEtrr'),
            isSigner: false,
            isWritable: false,
        }],
    })

    const depositObligationInstruction = program.instruction.depositObligationCollateral(amount, {
        accounts: {
            borrower: wallet.publicKey,
            obligation: obligation.pubkey,
            reserve: new PublicKey('DSTQScWV8B9zxLrhGoopULVvqneVb2rkyhZNu5keEtrr'),
            sourceCollateralWallet: collateralWallet,
            destinationCollateralWallet: reserve.collateral.supply,
            tokenProgram: TOKEN_PROGRAM_ID,
            clock: SYSVAR_CLOCK_PUBKEY,
        },
    });

    return await sendTransaction({
        transaction: new Transaction().add(refreshReserveInstruction).add(refreshObligationInstruction).add(depositObligationInstruction),
        wallet,
        signers: [],
        connection,
        focusPopup: true,
    });
}
