import { Theme } from '@material-ui/core'
import { TooltipMutationType, TooltipQueryType } from '@core/types/TooltipTypes'
import { DustFilterType, SharePortfolioMutationType } from '@core/types/PortfolioTypes'

export interface IState {
  key: number
  openSharePortfolioPopUp: boolean
}

export interface IProps extends TooltipMutationType, TooltipQueryType {
  theme: Theme
  dustFilter: DustFilterType
  sharePortfolioMutation: SharePortfolioMutationType
  portfolioId: string
  portfolioName: string
}
