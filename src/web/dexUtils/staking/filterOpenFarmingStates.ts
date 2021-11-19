import { FarmingState } from '../common/types'

export const isOpenFarmingState = (farmingState: FarmingState) =>
  !farmingState.feesDistributed
