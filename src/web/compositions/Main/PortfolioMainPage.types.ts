import { Theme } from '@material-ui/core'
import { ITooltipType, updateTooltipSettingsMutationType } from '@core/types/UserTypes'

export interface IState {
  key: number
}

export interface IProps {
  theme: Theme
  dustFilter: number
  getTooltipSettings: { getTooltipSettings: ITooltipType }
  updateTooltipSettings: updateTooltipSettingsMutationType
}
