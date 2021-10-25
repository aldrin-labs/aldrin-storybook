import { WalletAdapter } from "../types"
import { Connection, PublicKey, Keypair, SYSVAR_RENT_PUBKEY, SYSVAR_CLOCK_PUBKEY, Transaction } from "@solana/web3.js"
import { ProgramsMultiton } from "../ProgramsMultiton/ProgramsMultiton"
import { STAKING_PROGRAM_ADDRESS } from "../ProgramsMultiton/utils"
import BN from "bn.js"
import { TokenInstructions } from "@project-serum/serum"
import { NUMBER_OF_RETRIES } from "../common"
import { notify } from "../notifications"
import { sendTransaction } from "../send"
import { filterOpenFarmingTickets } from "../common/filterOpenFarmingTickets"
import { getParsedStakingFarmingTickets } from "./getParsedStakingFarmingTickets"

interface EndstakingParams {
  wallet: WalletAdapter
  connection: Connection
  // poolPublicKey: PublicKey
  userPoolTokenAccount: PublicKey
}

interface StakingPoolAccount {
  authority: PublicKey
  poolMint: PublicKey
  poolSigner: PublicKey
  stakingVault: PublicKey
}

export const endStaking = async (params: EndstakingParams) => {
  const {
    wallet,
    connection,
    userPoolTokenAccount,
  } = params
  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: STAKING_PROGRAM_ADDRESS,
  })

  if (!wallet.publicKey) {
    return 'failed'
  }
  console.log('program', program)
  const pools = await program.account.stakingPool.all()
  const farmings = await program.account.farmingState.all()
  const farmingSnapshots = await program.account.snapshotQueue.all()
  // const farmingTickets = await program.account.farmingTicket.all()
  const farmingTickets = await getParsedStakingFarmingTickets({
    wallet, connection, walletPublicKey: wallet.publicKey,
  })

  const pool: StakingPoolAccount = pools[0].account


  const openTickets = filterOpenFarmingTickets(
    farmingTickets
  )

  if (openTickets.length === 0) {
    return 'failed'
  }

  console.log('R: ', pool, farmings, farmingSnapshots, openTickets)



  /**
   * 
        {
          "name": "farmingSnapshots",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "farmingTicket",
          "isMut": true,
          "isSigner": false
        },
 
  */
  const [poolSigner] = await PublicKey.findProgramAddress(
    [pools[0].publicKey.toBuffer()],
    program.programId
  )

  const instructions = await Promise.all(openTickets.map((ot) => program.instruction.endFarming(
    {
      accounts: {
        pool: pools[0].publicKey,
        farmingState: farmings[0].publicKey,
        farminSnapshots: farmingSnapshots[0].publicKey,
        farmingTicket: ot.farmingTicket,
        stakingVault: pool.stakingVault,
        userStakingTokenAccount: userPoolTokenAccount,
        poolSigner,
        userKey: wallet.publicKey,
        tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
        clock: SYSVAR_CLOCK_PUBKEY,
        rent: SYSVAR_RENT_PUBKEY,
      },
    }
  )))


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
