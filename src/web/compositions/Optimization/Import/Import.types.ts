import { DustFilterType } from '@core/types/PortfolioTypes'

export interface IProps {
  dustFilter: DustFilterType
  optimizationPeriod: string
  isShownMocks: boolean
  startDate: number
  endDate: number
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
