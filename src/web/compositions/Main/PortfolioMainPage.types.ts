import { Theme } from '@material-ui/core'
import { TooltipMutationType, TooltipQueryType } from '@core/types/TooltipTypes'
import { DustFilterType } from '@core/types/PortfolioTypes'

export interface IState {
  key: number
}

export interface IProps extends TooltipMutationType, TooltipQueryType {
  theme: Theme
  dustFilter: DustFilterType
}
