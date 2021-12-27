import { Program } from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'

import { STAKING_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { FarmingCalc } from './types'

const USER_KEY_SPAN = 40
const CALC_ACCOUNT_SIZE = 112

export const getCalcAccounts = async (
  program: Program,
  userPublicKey: PublicKey
): Promise<FarmingCalc[]> => {
  const calcAccountsData = await program.provider.connection.getProgramAccounts(
    new PublicKey(STAKING_PROGRAM_ADDRESS),
    {
      commitment: 'confirmed',
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

  const calcAccounts = calcAccountsData.map((ca) => {
    const data = Buffer.from(ca.account.data)
    return {
      ...program.coder.accounts.decode<FarmingCalc>('FarmingCalc', data),
      publicKey: ca.pubkey,
    }
  })

  return calcAccounts
}
