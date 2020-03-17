import { ChangeEvent } from 'react'
import moment from 'moment'

import { Key } from '@core/types/ChartTypes'

export interface IProps {
  tab: string
  tabIndex: number
  show: boolean
  handleTabChange: (e: ChangeEvent<{}>, tabIndex: number | any) => void
  selectedKey: Key
  keys: Key[]
  marketType: number
  arrayOfMarketIds: string[]
  showAllPositionPairs: boolean
  showAllOpenOrderPairs: boolean
  showAllSmartTradePairs: boolean
  showPositionsFromAllAccounts: boolean
  showOpenOrdersFromAllAccounts: boolean
  showSmartTradesFromAllAccounts: boolean
}

export interface IState {
  page: number
  perPage: number
  allKeys: boolean
  specificPair: string | boolean
  startDate: moment.Moment | null
  endDate: moment.Moment | null
  focusedInput: null | string
  activeDateButton: null | string
}
