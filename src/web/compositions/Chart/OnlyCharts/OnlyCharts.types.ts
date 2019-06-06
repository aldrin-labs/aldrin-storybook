import { TooltipMutationType, TooltipQueryType } from '@core/types/TooltipTypes'

export interface IChart {
  pair: string
  id: string
}

export interface IProps extends TooltipMutationType, TooltipQueryType {
  mainPair: string
  charts: IChart[]
  theme: any
}
