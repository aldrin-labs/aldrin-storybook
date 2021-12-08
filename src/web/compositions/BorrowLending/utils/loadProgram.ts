import { Connection, PublicKey } from '@solana/web3.js'
import {Idl, Program, Provider} from '@project-serum/anchor'

const BorrowLendingIdl = require('../../../dexUtils/ProgramsMultiton/idls/borrowLending.json')
import {WalletAdapter} from "@sb/dexUtils/types";
const MARKET_ORDER_PROGRAM_ADDRESS =
    'AaWEgkXw69xduqs7pVahuNQrJFG2eCDoCa5zYy6ESDx5'

export const loadBorrowLendingProgram = ({
        wallet,
        connection,
    }: {
        wallet: WalletAdapter
        connection: Connection
    }) => {
    const program_idl = BorrowLendingIdl
    const borrowLendingProgramId = new PublicKey(MARKET_ORDER_PROGRAM_ADDRESS)

    const borrowLendingProgram = new Program(
        program_idl as Idl,
        borrowLendingProgramId,
        new Provider(connection, wallet, {
            preflightCommitment: 'recent',
            commitment: 'recent',
        })
    )

    return borrowLendingProgram
}
