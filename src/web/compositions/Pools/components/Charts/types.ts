export interface TotalVolumeLockedChartProps {
  getTotalVolumeLockedHistoryQuery: {
    getTotalVolumeLockedHistory: {
      volumes: { date: number; vol?: number }[]
    }
  }
}

export interface TradingVolumeChartProps {
  getTradingVolumeHistoryQuery: {
    getTradingVolumeHistory: {
      volumes: { date: number; vol?: number }[]
    }
  }
}
