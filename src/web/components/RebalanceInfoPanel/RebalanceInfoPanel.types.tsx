import { Theme } from '@material-ui/core'

export interface IProps {
  rebalanceInfoPanelData: {
    accountValue: string
    availableValue: string
    availablePercentage: string
    rebalanceTime: string
  }
  rebalanceOption: string[]
  theme: Theme

  toggleSectionCoinChart: () => void
  isSectionChart: boolean
  rebalanceTimePeriod: any
  onRebalanceTimerChange: any
}

export interface IState {
  isHiddenRebalanceDaysInput: string
}
