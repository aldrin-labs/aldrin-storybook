import { FarmingState } from "../common/types";

export const filterOpenFarmingStates = (farmingStates: FarmingState[]) =>
  farmingStates.filter((state) => state.tokensTotal !== state.tokensUnlocked)
