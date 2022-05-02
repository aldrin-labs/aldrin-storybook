import { PublicKey } from '@solana/web3.js'

import { PLUTONIANS_STAKING_PROGRAMM_ADDRESS } from '../../ProgramsMultiton'

export const getStakingAccount = (
  walletPublicKey: PublicKey,
  stakingTier: PublicKey
) =>
  PublicKey.findProgramAddress(
    [
      Buffer.from('user_staking_account'),
      walletPublicKey.toBytes(),
      stakingTier.toBytes(),
    ],
    new PublicKey(PLUTONIANS_STAKING_PROGRAMM_ADDRESS)
  )
