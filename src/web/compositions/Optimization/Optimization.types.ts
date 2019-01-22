import { Theme } from '@material-ui/core'

import { IData } from '@core/types/PortfolioTypes'

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
  rawOptimizedData: RawOptimizedData
  openWarning: boolean
  warningMessage: string
  showAllLineChartData: boolean
  isSystemError: boolean
  run: boolean
  key: number
}

export interface IProps {
  hideToolTip: (any: any) => void
  storeData: IData[]
  isShownMocks: boolean
  updateData: Function
  filterValueSmallerThenPercentage: number
  baseCoin: string
  theme: Theme
}
