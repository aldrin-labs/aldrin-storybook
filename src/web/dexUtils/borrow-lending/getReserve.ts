import {Connection, PublicKey,} from '@solana/web3.js'
import {ProgramsMultiton} from '../ProgramsMultiton/ProgramsMultiton'
import {BORROW_LENDING_PROGRAM_ADDRESS} from '../ProgramsMultiton/utils'
import {WalletAdapter} from '../types'

export const getReserve = async ({
    wallet,
    connection,
    programAddress = BORROW_LENDING_PROGRAM_ADDRESS,
    reservePK,
}: {
    wallet: WalletAdapter
    connection: Connection
    programAddress?: string
    reservePK: PublicKey
}) => {
    const program = ProgramsMultiton.getProgramByAddress({
        wallet,
        connection,
        programAddress,
    })

    console.log(program.account.reserve)

    return await program.account.reserve.fetch(reservePK);
}
