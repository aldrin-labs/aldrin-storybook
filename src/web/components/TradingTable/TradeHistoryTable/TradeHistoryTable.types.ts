import { Theme } from '@material-ui/core'
import { WithTheme } from '@material-ui/styles/withTheme'
import moment from 'moment'

import { TradeType, Key } from '@core/types/ChartTypes'

export interface IProps extends WithTheme<Theme> {
  tab: string
  show: boolean
  handleTabChange: (tab: string | any) => void
  focusedInput: null | string
  startDate: moment.Moment | null
  endDate: moment.Moment | null
  activeDateButton: null | string
  minimumDate: moment.Moment
  maximumDate: moment.Moment
  onDateButtonClick: (stringDate: string) => void
  onDatesChange: ({
    startDate,
    endDate,
  }: {
    startDate: moment.Moment | null
    endDate: moment.Moment | null
  }) => void
  onFocusChange: (focusedInput: string) => void
  onClearDateButtonClick: () => void
  subscribeToMore: () => () => void
  theme: Theme
  getTradeHistoryQuery: {
    getTradeHistory: TradeType[]
  }
  selectedKey: Key
  arrayOfMarketIds: string[]
  marketType: number
  canceledOrders: string[]
  currencyPair: string
}

export interface IState {
  tradeHistoryProcessedData: any[]
}
