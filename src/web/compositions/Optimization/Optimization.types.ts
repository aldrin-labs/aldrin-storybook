import { Theme } from '@material-ui/core'

import { DustFilterType } from '@core/types/PortfolioTypes'
import { TooltipMutationType, TooltipQueryType } from '@core/types/TooltipTypes'

export type RawOptimizedData = {
  backtest_results: [number, number]
  confidence: number
  exptd_rtrn_high_end: number
  exptd_rtrn_low_end: number
  portfolio_coins_list: string[]
  return_value: number
  risk_coefficient: number
  weights: number[]
}[]

export interface IState {
  loading: boolean
  activeButton: number
  optimizationData: any[]
  rawOptimizedData: RawOptimizedData
  openWarning: boolean
  warningMessage: string
  showAllLineChartData: boolean
  isSystemError: boolean
  run: boolean
  key: number
}

export interface IProps extends TooltipMutationType, TooltipQueryType {
  dustFilter: DustFilterType
  baseCoin: string
  theme: Theme
  getMocksModeQuery: {
    app: {
      mocksEnabled: boolean
    }
  }
}
