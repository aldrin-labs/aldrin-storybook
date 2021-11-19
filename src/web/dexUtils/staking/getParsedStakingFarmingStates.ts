import { Connection } from '@solana/web3.js'
import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { STAKING_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'

import { loadStakingFarmingStates } from './loadStakingFarmingStates'
import { FarmingState } from '../common/types'
import { WalletAdapter } from '../types'

export const getParsedStakingFarmingStates = async ({
  wallet,
  connection,
}: {
  wallet: WalletAdapter
  connection: Connection
}): Promise<FarmingState[]> => {
  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: STAKING_PROGRAM_ADDRESS,
  })

  const states = await loadStakingFarmingStates({
    connection,
  })

  const allUserStatesPerPool = states.map((state) => {
    const data = Buffer.from(state.account.data)
    const statesData = program.coder.accounts.decode('FarmingState', data)
    return {
      startTime: statesData.startTime.toNumber(),
      tokensTotal: statesData.tokensTotal.toNumber(),
      farmingState: state.pubkey.toString(),
      farmingSnapshots: statesData.farmingSnapshots.toString(),
      feesDistributed: statesData.feesDistributed,
    }
  })

  return allUserStatesPerPool
}
