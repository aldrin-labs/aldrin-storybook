import { Theme } from '@material-ui/core'
import { WithTheme } from '@material-ui/styles/withTheme'
import dayjs from 'dayjs'

import { OrderType, Key } from '@core/types/ChartTypes'

export interface IProps extends WithTheme<Theme> {
  tab: string
  show: boolean
  page: number
  perPage: number
  focusedInput: null | string
  startDate: typeof dayjs | null
  endDate: typeof dayjs | null
  activeDateButton: null | string
  minimumDate: typeof dayjs
  maximumDate: typeof dayjs
  getPaginatedOrderHistoryQuery: {
    getPaginatedOrderHistory: {
      orders: OrderType[]
      count: number
    }
  }
  theme: Theme
  keys: Key[]
  selectedKey: Key
  arrayOfMarketIds: string[]
  marketType: number
  currencyPair: string
  canceledOrders: string[]
  showAllPositionPairs: boolean
  showAllOpenOrderPairs: boolean
  showAllSmartTradePairs: boolean
  showPositionsFromAllAccounts: boolean
  showOpenOrdersFromAllAccounts: boolean
  showSmartTradesFromAllAccounts: boolean
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
  handleTabChange: (tab: string | any) => void
  handleChangePage: (page: number) => void
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLSelectElement>) => void

  allKeys: boolean
  specificPair: boolean | string
  handleToggleAllKeys: () => void
  handleToggleSpecificPair: () => void
}

export interface IState {
  orderHistoryProcessedData: any[]
}
