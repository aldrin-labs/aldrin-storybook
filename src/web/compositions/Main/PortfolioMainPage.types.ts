import { Theme } from '@material-ui/core'

export interface IState {
  key: number
}

export interface IProps {
  tab: string
  theme: Theme
  isShownMocks: boolean
  dustFilter: number
  toolTip: {
    portfolioMain: boolean
    portfolioIndustry: boolean
    portfolioRebalance: boolean
    portfolioCorrelation: boolean
    portfolioOptimization: boolean
  }
  hideToolTip: (tab: string) => void
}
