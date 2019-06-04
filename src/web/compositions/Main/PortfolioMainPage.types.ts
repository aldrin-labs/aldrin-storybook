import { Theme } from '@material-ui/core'
import { TooltipsType } from '@core/types/PortfolioTypes'

export interface IState {
  key: number
}

export interface IProps {
  theme: Theme
  dustFilter: number
  updateTooltipSettingsMutation: ({
    variables: { settings },
  }: {
    variables: { settings: TooltipsType }
  }) => Promise<any>
  getTooltipSettingsQuery: {
    getTooltipSettings: TooltipsType
  }
}
