import { Theme } from '@material-ui/core'

import { IData, DustFilterType, TooltipsType } from '@core/types/PortfolioTypes'

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

export interface IProps {
  dustFilter: DustFilterType
  baseCoin: string
  theme: Theme
  updateTooltipSettingsMutation: ({
    variables: { settings },
  }: {
    variables: { settings: TooltipsType }
  }) => Promise<any>
  getTooltipSettingsQuery: {
    getTooltipSettings: TooltipsType
  }
  getMocksModeQuery: {
    app: {
      mocksEnabled: boolean
    }
  }
}
