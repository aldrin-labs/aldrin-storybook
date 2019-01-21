export interface IProps {
  optimizationPeriod: string
  isShownMocks: boolean
  startDate: number
  endDate: number
  filterValueSmallerThenPercentage: number
  data?: { getProfile: object }
  optimizedData: IData[]
  storeData: IData[]
  updateData: Function
  showWarning: Function
  setPeriod: Function
  setActiveButtonToDefault: Function
  optimizedToState: Function
  transformData: Function
  toggleLoading: Function
  expectedReturn: string
  optimizePortfolio: Function
  handleChange: Function
  onBtnClick: Function
  percentages: number[]
  activeButton: number
  showSwitchButtons: boolean
}

export interface IData {
  coin: string
  percentage: number | string
}
