import { WalletAdapter } from "../types"
import { Connection, PublicKey, Keypair, SYSVAR_RENT_PUBKEY, SYSVAR_CLOCK_PUBKEY, Transaction } from "@solana/web3.js"
import { ProgramsMultiton } from "../ProgramsMultiton/ProgramsMultiton"
import { STAKING_PROGRAM_ADDRESS } from "../ProgramsMultiton/utils"
import BN from "bn.js"
import { TokenInstructions } from "@project-serum/serum"
import { NUMBER_OF_RETRIES } from "../common"
import { notify } from "../notifications"
import { sendTransaction } from "../send"

interface StartStakingParams {
  wallet: WalletAdapter
  connection: Connection
  amount: number
  userPoolTokenAccount: PublicKey
}

interface StakingPoolAccount {
  authority: PublicKey
  poolMint: PublicKey
  poolSigner: PublicKey
  stakingVault: PublicKey
}

export const startStaking = async (params: StartStakingParams) => {
  const {
    wallet,
    connection,
    amount,
    userPoolTokenAccount,
  } = params

  console.log('Start staking: ', params)

  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: STAKING_PROGRAM_ADDRESS,
  })

  console.log('program', program)
  //заменить на пул с апи (аргументом)
  const pools = await program.account.stakingPool.all()
  const farmings = await program.account.farmingState.all()

  const pool: StakingPoolAccount = pools[0].account

  console.log('R: ', pool, farmings, amount)

  const farmingTicket = Keypair.generate()
  const farmingTicketInstruction = await program.account.farmingTicket.createInstruction(
    farmingTicket
  )

  const startStakingTransaction = await program.instruction.startFarming(
    new BN(amount),
    {
      accounts: {
        pool: pools[0].publicKey,
        farmingState: farmings[0].publicKey,
        farmingTicket: farmingTicket.publicKey,
        stakingVault: pool.stakingVault,
        userStakingTokenAccount: userPoolTokenAccount,
        walletAuthority: wallet.publicKey,
        userKey: wallet.publicKey,
        tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
        clock: SYSVAR_CLOCK_PUBKEY,
        rent: SYSVAR_RENT_PUBKEY,
      },
    }
  )

  const commonTransaction = new Transaction()
  const commonSigners = []

  commonSigners.push(farmingTicket)
  commonTransaction.add(farmingTicketInstruction)
  commonTransaction.add(startStakingTransaction)

  let counter = 0
  while (counter < NUMBER_OF_RETRIES) {
    try {
      if (counter > 0) {
        notify({
          type: 'error',
          message: 'Staking failed. Please confirm transaction again.',
        })
      }

      const tx = await sendTransaction({
        wallet,
        connection,
        transaction: commonTransaction,
        signers: commonSigners,
        focusPopup: true,
      })

      if (tx) {
        return 'success'
      } else {
        counter++
      }
    } catch (e) {
      console.log('start farming catch error', e)
      counter++

      if (e.message.includes('cancelled')) {
        return 'cancelled'
      }
    }
  }

  return 'failed'
}
