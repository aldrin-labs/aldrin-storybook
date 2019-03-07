import { Theme } from '@material-ui/core'
import { DustFilterType } from '@core/types/PortfolioTypes'

export interface IProps {
  dustFilter: DustFilterType
  theme: Theme
  run: boolean
  hideToolTip: (tab: string) => void
  toolTip: {
    portfolioIndustry: string
  }
}

export interface IState {
  key: number
}
