import { DustFilterType, TooltipsType } from '@core/types/PortfolioTypes'
import { Theme } from '@material-ui/core'

export interface IProps {
  getCorrelationAndPortfolioAssetsQuery: any
  theme: Theme
  children: object
  baseCoin: string
  data: object
  portfolio: object
  isShownMocks: boolean
  dustFilter: DustFilterType
  getCorrelationPeriodQuery: {
    portfolioCorrelation: {
      startDate: number
      endDate: number
      period: string
    }
  }
  updateCorrelationPeriodMutation: ({
    startDate,
    endDate,
    period,
  }: {
    startDate: number
    endDate: number
    period: string
  }) => Promise<any>
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
