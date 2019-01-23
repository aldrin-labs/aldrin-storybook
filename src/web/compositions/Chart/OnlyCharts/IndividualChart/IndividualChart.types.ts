export interface IChartProps {
  currencyPair: string
  removeChart: Function
  index: number
  chartsCount: number
  theme: any
}
export interface IChartState {
  activeChart: 'candle' | 'depth'
  show: boolean
}
