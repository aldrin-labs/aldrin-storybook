export interface TotalVolumeLockedChartProps {
  setBalanceData: ({ balance, date }: { balance: string; date: string }) => void
  setFirstBalance: (a: string) => void
  getTotalVolumeLockedHistoryQuery: {
    getTotalVolumeLockedHistory: {
      volumes: { date: number; vol?: number }[]
    }
  }
  chartHeight: number
  border: string
}

export interface TradingVolumeChartProps {
  setBalanceData: ({ balance, date }: { balance: string; date: string }) => void
  setFirstBalance: (a: string) => void
  getTradingVolumeHistoryQuery: {
    getTradingVolumeHistory: {
      volumes: { date: number; vol?: number }[]
    }
  }
  chartHeight: number
  border: string
}
