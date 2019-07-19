import { TooltipMutationType, TooltipQueryType } from '@core/types/TooltipTypes'

export interface IState {
  key: number
  open: boolean
  isSectionChart: boolean
}

export interface IProps extends TooltipMutationType, TooltipQueryType {

}
