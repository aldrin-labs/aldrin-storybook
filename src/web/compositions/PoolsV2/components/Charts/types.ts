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

export type CanvasProps = {
  bottom?: string
  left?: string
  needPadding?: boolean
  $border?: string
}

export type CanvasContainerProps = {
  padding?: string
}

export type TooltipContainerProps = {
  padding?: string
}

export type ChartContainerProps = {
  $background?: string
}

export type ChartMaskProps = {
  $background?: string
}
