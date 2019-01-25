import { IExchange } from '@core/types/ChartTypes'

export interface IExchangesTable {
  data: {marketByName: [{exchanges: IExchange[]}]}
  isShownMocks: boolean
}
