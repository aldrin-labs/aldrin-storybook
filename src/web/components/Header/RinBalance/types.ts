export interface WithStakingInfo {
  getStakingInfoQuery: {
    getStakingInfo?: {
      supply: number
      farmers: {
        pubkey: string
        reward: number
      }[]
      farming: {
        admin: string
        stakeMint: string
        stakeVault: string
        harvests: {
          mint: string
          vault: string
          harvestVaultTokenAmount: string
          harvestVaultDecimals: number
          apr: number
          apy: number
          periods: {
            tps: {
              amount: string
            }
            startsAt: {
              slot: string
            }
          }[]
        }[]
        snapshots: {
          ringBufferTip: string
          ringBuffer: {
            staked: string
            startedAt: string
          }
        }
        stakeVaultTokenAmount: string
        stakeVaultDecimals: number
        publicKey: string
      }[]
    }
  }
}
