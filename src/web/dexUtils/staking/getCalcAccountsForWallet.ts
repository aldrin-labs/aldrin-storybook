import { Connection, PublicKey } from "@solana/web3.js";
import { Program } from "@project-serum/anchor";
import { STAKING_PROGRAM_ADDRESS } from "../ProgramsMultiton/utils";
import { u64 } from "../token/token";


const USER_KEY_SPAN = 72
const CALC_ACCOUNT_SIZE = 144


export interface FarmingCalc {
  farmingState: PublicKey
  farmingTicket: PublicKey
  userKey: PublicKey
  initializer: PublicKey
  tokenAmount: u64
}


export const getCalcAccounts = async (program: Program, userPublicKey: PublicKey) => {

  const calcAccountsData = await program.provider.connection.getProgramAccounts(
    new PublicKey(STAKING_PROGRAM_ADDRESS),
    {
      commitment: 'finalized',
      filters: [
        {
          dataSize: CALC_ACCOUNT_SIZE,
        },
        {
          memcmp: {
            offset: USER_KEY_SPAN,
            bytes: userPublicKey.toBase58(),
          },
        },
      ],
    }
  )


  return calcAccountsData.map((ca) => {
    const data = Buffer.from(ca.account.data)
    return {
      ...program.coder.accounts.decode<FarmingCalc>('FarmingCalc', data),
      publicKey: ca.pubkey
    }
  })
}