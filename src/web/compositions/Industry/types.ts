import { Theme } from '@material-ui/core'

export interface IProps {
  theme: Theme
  tab: string
  run: boolean
  hideToolTip: (tab: string) => void
  toolTip: {
    portfolioIndustry: string
  }
}

export interface IState {
  key: number
}
