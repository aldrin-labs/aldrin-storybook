import { TokenInstructions } from '@project-serum/serum'
import {
  Keypair,
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  Transaction,
} from '@solana/web3.js'
import BN from 'bn.js'

import { ProgramsMultiton } from '@sb/dexUtils/ProgramsMultiton/ProgramsMultiton'
import { getPoolsProgramAddress } from '@sb/dexUtils/ProgramsMultiton/utils'
import { WalletAdapter } from '@sb/dexUtils/types'

import MultiEndpointsConnection from '../../MultiEndpointsConnection'
import { signAndSendTransactions } from '../../transactions/signAndSendTransactions'

export const getStartFarmingTransactions = async ({
  wallet,
  connection,
  poolTokenAmount,
  poolPublicKey,
  userPoolTokenAccount,
  farmingState,
  curveType,
}: {
  wallet: WalletAdapter
  connection: MultiEndpointsConnection
  poolTokenAmount: number
  poolPublicKey: PublicKey
  userPoolTokenAccount: PublicKey | null
  farmingState: PublicKey
  curveType?: number | null
}) => {
  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: getPoolsProgramAddress({ curveType }),
  })

  const { lpTokenFreezeVault } = await program.account.pool.fetch(poolPublicKey)

  const farmingTicket = Keypair.generate()
  const farmingTicketInstruction =
    await program.account.farmingTicket.createInstruction(farmingTicket)

  const transactionsAndSigners = []

  const startFarmingTransaction = await program.instruction.startFarming(
    new BN(poolTokenAmount),
    {
      accounts: {
        pool: poolPublicKey,
        farmingState,
        farmingTicket: farmingTicket.publicKey,
        lpTokenFreezeVault,
        userLpTokenAccount: userPoolTokenAccount,
        walletAuthority: wallet.publicKey,
        userKey: wallet.publicKey,
        tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
        clock: SYSVAR_CLOCK_PUBKEY,
        rent: SYSVAR_RENT_PUBKEY,
      },
    }
  )

  console.log('Start farming: ', poolTokenAmount, startFarmingTransaction)

  const commonTransaction = new Transaction()
  const commonSigners = []

  commonSigners.push(farmingTicket)
  commonTransaction.add(farmingTicketInstruction)
  commonTransaction.add(startFarmingTransaction)

  transactionsAndSigners.push({
    transaction: commonTransaction,
    signers: commonSigners,
  })

  return transactionsAndSigners
}

export const startFarming = async ({
  wallet,
  connection,
  poolTokenAmount,
  poolPublicKey,
  userPoolTokenAccount,
  farmingState,
  curveType,
}: {
  wallet: WalletAdapter
  connection: MultiEndpointsConnection
  poolTokenAmount: number
  poolPublicKey: PublicKey
  userPoolTokenAccount: PublicKey | null
  farmingState: PublicKey
  curveType?: number | null
}) => {
  const transactionsAndSigners = await getStartFarmingTransactions({
    wallet,
    connection,
    poolTokenAmount,
    poolPublicKey,
    userPoolTokenAccount,
    farmingState,
    curveType,
  })

  const result = await signAndSendTransactions({
    wallet,
    connection,
    transactionsAndSigners,
  })

  return result
}
