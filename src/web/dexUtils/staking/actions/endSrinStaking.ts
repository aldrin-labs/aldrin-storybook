import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import {
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js'

import { walletAdapterToWallet } from '../../common'
import {
  PLUTONIANS_STAKING_PROGRAMM_ADDRESS,
  ProgramsMultiton,
} from '../../ProgramsMultiton'
import { signAndSendSingleTransaction } from '../../transactions'
import { EndSrinStakingInstructionParams, EndSrinStakingParams } from './types'
import { getStakingAccount } from './utils'

export const endSrinStakingInstructions = async (
  params: EndSrinStakingInstructionParams
) => {
  const {
    stakingPool,
    stakingTier,
    connection,
    wallet,
    userRewardWallet,
    userStakeWallet,
    poolSigner,
    rewardVault,
    stakeVault,
    nftReward,
    conversion,
    stakeToRewardConversionPaths,
  } = params
  const w = walletAdapterToWallet(wallet)

  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: PLUTONIANS_STAKING_PROGRAMM_ADDRESS,
  })

  const [userStakingAccount] = await getStakingAccount(w.publicKey, stakingTier)

  console.log('stakeToRewardConversionPaths:', stakeToRewardConversionPaths)
  return program.instruction.withdraw({
    accounts: {
      user: w.publicKey,
      userStakingAccount,
      userRewardWallet,
      userStakeWallet,
      stakingPool,
      poolSigner,
      rewardVault,
      stakeVault,
      nftReward,
      conversion,
      tier: stakingTier,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    },
    remainingAccounts: [...stakeToRewardConversionPaths].map((pubkey) => ({
      pubkey,
      isWritable: false,
      isSigner: false,
    })),
  }) as TransactionInstruction
}

export const endSrinStaking = async (params: EndSrinStakingParams) => {
  const {
    stakingPool: {
      stakeToRewardConversionPath,
      stakingPool,
      poolSigner,
      stakeVault,
      rewardVault,
      stakeTokenMint,
      rewardTokenMint,
    },
    wallet,
    stakingTier,
    connection,
    userTokens,
    nftTierReward,
  } = params

  if (!stakeToRewardConversionPath) {
    throw new Error('No conversion path for tier!')
  }

  const stakeMint = stakeTokenMint.toString()
  const userStakeWallet = userTokens.find(
    (ut) => ut.mint === stakeMint
  )?.address

  if (!userStakeWallet) {
    throw new Error('No user stake wallet for tier!')
  }
  const rewardMint = rewardTokenMint.toString()

  const userRewardWallet = userTokens.find(
    (ut) => ut.mint === rewardMint
  )?.address

  if (!userRewardWallet) {
    throw new Error('No user reward wallet for tier!')
  }

  const instructionParams: EndSrinStakingInstructionParams = {
    wallet,
    connection,
    poolSigner,
    stakeVault,
    rewardVault,
    stakingPool,
    nftReward: nftTierReward,
    stakingTier,
    conversion: stakeToRewardConversionPath.publicKey,
    userStakeWallet: new PublicKey(userStakeWallet),
    userRewardWallet: new PublicKey(userRewardWallet),
    stakeToRewardConversionPaths: stakeToRewardConversionPath.account.vaults
      .map((v) => [v.vault1, v.vault2])
      .flat(),
  }

  const instruction = await endSrinStakingInstructions(instructionParams)
  const transaction = new Transaction().add(instruction)

  return signAndSendSingleTransaction({
    transaction,
    wallet: params.wallet,
    connection: params.connection,
  })
}
