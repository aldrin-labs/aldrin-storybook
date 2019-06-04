import { Theme } from '@material-ui/core'
import { DustFilterType, TooltipsType } from '@core/types/PortfolioTypes'

export interface IProps {
  dustFilter: DustFilterType
  theme: Theme
  updateTooltipSettingsMutation: ({
    variables: { settings },
  }: {
    variables: { settings: TooltipsType }
  }) => Promise<any>
  getTooltipSettingsQuery: {
    getTooltipSettings: TooltipsType
  }
}

export interface IState {
  key: number
}
