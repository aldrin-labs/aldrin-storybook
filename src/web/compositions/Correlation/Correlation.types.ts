import { DustFilterType } from '@core/types/PortfolioTypes'

export interface IProps {
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
}
