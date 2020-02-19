import { Key } from '@core/types/ChartTypes'

export interface IProps {
  showCancelResult: ({
    status,
    message,
  }: {
    status: string
    message: string
  }) => void
  showOrderResult: ({
    status,
    message,
  }: {
    status: string
    message: string
  }) => void

  getSelectedKeyQuery: { chart: { selectedKey: Key } }
  selectedKey: {}
  marketType: 0 | 1
  exchange: string
  currencyPair: string
  arrayOfMarketIds: string[]
  priceFromOrderbook: number
  pricePrecision: number
  quantityPrecision: number
}

export interface IState {
  tab: string
  tabIndex: number
  canceledOrders: string[]
}
