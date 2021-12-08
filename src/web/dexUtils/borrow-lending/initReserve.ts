import {
    Connection,
} from '@solana/web3.js'
import BN from 'bn.js'
import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { BORROW_LENDING_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { WalletAdapter } from '../types'

export const initReserve = async ({
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

    console.log(program)

    // return await program.rpc.initReserve(
    //
    // );
}
