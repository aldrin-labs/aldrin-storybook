import { Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { STAKING_PROGRAM_ADDRESS } from "../ProgramsMultiton/utils";
import { u64 } from "../token/token";
// import { memCmpFiltersToBuf } from "../../utils/buffer";


const USER_KEY_SPAN = 40
const CALC_ACCOUNT_SIZE = 112


export interface FarmingCalc {
  farmingState: PublicKey
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


  // console.log('asdasd: ', new PublicKey('Tip5wgv8BjhBGujrNZSvhTSZ8eo6KLRM5i1xSq3n5e5').toBase58(), new PublicKey('Tip5wgv8BjhBGujrNZSvhTSZ8eo6KLRM5i1xSq3n5e5').toBuffer())
  // const programAccounts = await program.account.farmingCalc.all(
  //   memCmpFiltersToBuf([
  //     {
  //       memcmp: {
  //         offset: 32,
  //         bytes: new PublicKey('Tip5wgv8BjhBGujrNZSvhTSZ8eo6KLRM5i1xSq3n5e5').toBase58()
  //       },
  //     },
  //   ])
  // )



  const calcAccounts = calcAccountsData.map((ca) => {
    const data = Buffer.from(ca.account.data)
    return {
      ...program.coder.accounts.decode<FarmingCalc>('FarmingCalc', data),
      publicKey: ca.pubkey
    }
  })

  // console.log('programAccounts: ', programAccounts, calcAccounts)

  return calcAccounts

}