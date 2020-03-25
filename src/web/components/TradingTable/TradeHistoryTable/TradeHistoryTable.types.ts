import { Theme } from '@material-ui/core'
import { WithTheme } from '@material-ui/styles/withTheme'
import dayjs from 'dayjs'

import { TradeType, Key } from '@core/types/ChartTypes'

export interface IProps extends WithTheme<Theme> {
  tab: string
  show: boolean
  page: number
  perPage: number
  handleTabChange: (tab: string | any) => void
  focusedInput: null | string
  startDate: typeof dayjs | null
  endDate: typeof dayjs | null
  activeDateButton: null | string
  minimumDate: typeof dayjs
  maximumDate: typeof dayjs
  onDateButtonClick: (stringDate: string) => void
  onDatesChange: ({
    startDate,
    endDate,
  }: {
    startDate: typeof dayjs | null
    endDate: typeof dayjs | null
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
