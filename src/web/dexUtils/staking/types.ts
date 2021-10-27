import { FarmingState } from "../common/types";

export type StakingPool = {
  swapToken: string
  poolSigner: string
  poolTokenMint: string
  stakingVault: string
  farming: FarmingState[]
}
