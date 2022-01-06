import { Program } from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'
import bs58 from 'bs58'
import { sha256 } from 'js-sha256'

import { FarmingCalc } from './types'

const USER_KEY_SPAN = 40
const CALC_ACCOUNT_SIZE = 112

// Calculates unique 8 byte discriminator prepended to all anchor accounts.
function accountDiscriminator(name: string): Buffer {
  return Buffer.from(sha256.digest(`account:${name}`)).slice(0, 8)
}

export const getCalcAccounts = async (
  program: Program,
  userPublicKey: PublicKey
): Promise<FarmingCalc[]> => {
  const calcAccountsData = await program.provider.connection.getProgramAccounts(
    program.programId,
    {
      commitment: 'confirmed',
      filters: [
        {
          dataSize: CALC_ACCOUNT_SIZE,
        },
        {
          memcmp: {
            offset: 0,
            bytes: bs58.encode(accountDiscriminator('FarmingCalc')),
          },
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
