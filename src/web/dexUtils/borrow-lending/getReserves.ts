import {Connection,} from '@solana/web3.js'
import {BORROW_LENDING_PROGRAM_ADDRESS} from '../ProgramsMultiton/utils'
import {WalletAdapter} from '../types'
import {loadAccountsFromProgram} from "@sb/dexUtils/common/loadAccountsFromProgram";

export const getReserves = async ({
    wallet,
    connection,
    programAddress = BORROW_LENDING_PROGRAM_ADDRESS,
}: {
    wallet: WalletAdapter
    connection: Connection
    programAddress?: string
}) => {
    const config = {
        filters: [
            {dataSize: 408 },
        ],
    };

    return await loadAccountsFromProgram({
        connection,
        filters: config.filters,
        programAddress,
    });
}
