export interface IChart {
  pair: string
  id: string
}

export interface IProps {
  addChart: (pair: string) => void
  mainPair: string
  removeChart: () => void
  removeWarningMessage: () => void
  charts: IChart[]
  currencyPair: string
  isShownMocks: boolean
  openedWarning: boolean
  theme: any
  view: any
  demoMode: { chartPage: boolean; multiChartPage: boolean }
}
