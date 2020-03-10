import { Theme } from '@material-ui/core'
import { WithTheme } from '@material-ui/styles/withTheme'
import moment from 'moment'

import { TradeType, Key } from '@core/types/ChartTypes'

export interface IProps extends WithTheme<Theme> {
  tab: string
  show: boolean
  page: number
  perPage: number
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
    getTradeHistory: {
      trades: TradeType[]
      count: number
    }
  }
  selectedKey: Key
  arrayOfMarketIds: string[]
  marketType: number
  canceledOrders: string[]
  currencyPair: string
  allKeys: boolean
  keys: Key[]
  specificPair: boolean | string
  showAllPositionPairs: boolean
  showAllOpenOrderPairs: boolean
  showAllSmartTradePairs: boolean
  showPositionsFromAllAccounts: boolean
  showOpenOrdersFromAllAccounts: boolean
  showSmartTradesFromAllAccounts: boolean
  handleChangePage: (page: number) => void
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLSelectElement>) => void
  handleToggleAllKeys: () => void
  handleToggleSpecificPair: () => void
}

export interface IState {
  tradeHistoryProcessedData: any[]
}
