import { Theme } from '@material-ui/core'
import { DustFilterType } from '@core/types/PortfolioTypes'
import { TooltipMutationType, TooltipQueryType } from '@core/types/TooltipTypes'

export interface IProps extends TooltipMutationType, TooltipQueryType {
  dustFilter: DustFilterType
  theme: Theme
}

export interface IState {
  key: number
}
