import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import {
  Keypair,
  PublicKey,
  Signer,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js'

import { walletAdapterToWallet } from '../../common'
import { TransactionAndSigner } from '../../common/types'
import {
  PLUTONIANS_STAKING_PROGRAMM_ADDRESS,
  ProgramsMultiton,
} from '../../ProgramsMultiton'
import { signAndSendTransactions } from '../../transactions'
import { claimSrinNFTsInstructions } from './claimSrinNFTs'
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
    createNftReceipt,
  } = params
  const w = walletAdapterToWallet(wallet)

  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: PLUTONIANS_STAKING_PROGRAMM_ADDRESS,
  })

  const [userStakingAccount] = await getStakingAccount(w.publicKey, stakingTier)

  const result: {
    instructions: TransactionInstruction[]
    signers: Signer[]
    userNftReceipt?: PublicKey
  } = { instructions: [], signers: [] }

  const remainingAccounts = [...stakeToRewardConversionPaths].map((pubkey) => ({
    pubkey,
    isWritable: false,
    isSigner: false,
  }))

  if (createNftReceipt) {
    const kp = Keypair.generate()
    result.instructions.push(
      await program.account.userNftReceipt.createInstruction(kp)
    )
    result.signers.push(kp)
    remainingAccounts.push({
      pubkey: kp.publicKey,
      isWritable: true,
      isSigner: false,
    })
    result.userNftReceipt = kp.publicKey
  }
  result.instructions.push(
    program.instruction.withdraw({
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
      remainingAccounts,
    }) as TransactionInstruction
  )

  return result
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
      tiers,
      ...stakingPoolRest
    },
    wallet,
    stakingTier,
    connection,
    userTokens,
    nftTierReward,
    stakedAmount,
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

  const tier = tiers.find((t) => t.publicKey.equals(stakingTier))
  const rewards = tier?.nftRewards ? tier?.nftRewards[0] : undefined
  const minStakeAmount = rewards?.account.minStakeTokensForReward

  const createNftReceipt = minStakeAmount
    ? stakedAmount.gte(minStakeAmount)
    : false

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
    createNftReceipt,
    stakeToRewardConversionPaths: stakeToRewardConversionPath.account.vaults
      .map((v) => [v.vault1, v.vault2])
      .flat(),
  }

  const result = await endSrinStakingInstructions(instructionParams)

  const transaction = new Transaction().add(...result.instructions)

  const transactionsAndSigners: TransactionAndSigner[] = [
    {
      transaction,
      signers: result.signers,
    },
  ]
  if (result.userNftReceipt && rewards && tier) {
    const claimResult = await claimSrinNFTsInstructions({
      wallet,
      connection,
      userNftReceipt: result.userNftReceipt,
      stakingPool,
      nftRewardGroup: rewards,
    })

    transactionsAndSigners.push({
      transaction: new Transaction().add(...claimResult),
    })
  }

  return signAndSendTransactions({
    transactionsAndSigners,
    wallet: params.wallet,
    connection: params.connection,
  })
}
