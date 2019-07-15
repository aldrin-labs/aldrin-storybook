export interface IProps {
  rebalanceInfoPanelData: {
    accountValue: string
    availableValue: string
    availablePercentage: string
    rebalanceTime: string
  }
  rebalanceOption: string[]
}

export interface IState {
  isHiddenRebalanceDaysInput: string
}