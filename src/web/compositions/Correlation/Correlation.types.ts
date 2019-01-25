export interface IProps {
  children: object
  toggleFullscreen: Function
  isFullscreenEnabled: boolean
  startDate: number
  endDate: number
  baseCoin: string
  data: object
  portfolio: object
  isShownMocks: boolean
  setCorrelationPeriodToStore: Function
  period: string
  startDate: number
  endDate: number
  filterValueSmallerThenPercentage: number
}
