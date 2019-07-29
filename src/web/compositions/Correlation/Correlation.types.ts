import { DustFilterType } from '@core/types/PortfolioTypes'
import { TooltipMutationType, TooltipQueryType } from '@core/types/TooltipTypes'
import { Theme } from '@material-ui/core'

export interface IProps extends TooltipQueryType, TooltipMutationType {
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
  getMocksModeQuery: {
    app: {
      mocksEnabled: boolean
    }
  }
}
