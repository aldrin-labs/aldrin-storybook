import { TooltipsType } from '@core/types/PortfolioTypes'

export interface IState {
  key: number
}

export interface IProps {
  updateTooltipSettingsMutation: ({
    variables: { settings },
  }: {
    variables: { settings: TooltipsType }
  }) => Promise<any>
  getTooltipSettingsQuery: {
    getTooltipSettings: TooltipsType
  }
}
