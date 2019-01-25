export interface IProps {
  tab: string
  portfolio: IPortfolio | null
  onChangeTab?: Function
  onToggleChart?: Function
  onToggleUSDBTC?: Function
  filterValuesLessThen: Function
  isShownMocks: boolean
  isSideNavOpen: boolean
  isUSDCurrently?: boolean
  toggleWallets: Function
  data: any
}

export interface IPortfolio {
  processing: boolean | null
}
