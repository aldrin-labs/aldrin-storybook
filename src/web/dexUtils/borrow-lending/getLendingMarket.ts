import {Connection, PublicKey,} from '@solana/web3.js'
import {ProgramsMultiton} from '../ProgramsMultiton/ProgramsMultiton'
import {BORROW_LENDING_PROGRAM_ADDRESS} from '../ProgramsMultiton/utils'
import {WalletAdapter} from '../types'

export const getLendingMarket = async ({
    wallet,
    connection,
    programAddress = BORROW_LENDING_PROGRAM_ADDRESS,
}: {
    wallet: WalletAdapter
    connection: Connection
    programAddress?: string
}) => {
    const program = ProgramsMultiton.getProgramByAddress({
        wallet,
        connection,
        programAddress,
    })

    console.log(program.account.lendingMarket)

    return await program.account.lendingMarket.fetch(new PublicKey('J6fERzRPHD8GWudVPnrKrYFfDAiqKX2v7wibTr8DrGK9'));
}
