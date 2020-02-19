import { ChangeEvent } from 'react'
import moment from 'moment'

import { Key } from '@core/types/ChartTypes'

export interface IProps {
  tab: string
  show: boolean
  handleTabChange: (e: ChangeEvent<{}>, tabIndex: number | any) => void
  selectedKey: Key
  arrayOfMarketIds: string[]
  marketType: number
  currencyPair: string
  canceledOrders: string[]
}

export interface IState {
  startDate: moment.Moment | null
  endDate: moment.Moment | null
  focusedInput: null | string
  activeDateButton: null | string
}
