import { ChangeEvent } from 'react'
import moment from 'moment'

import { Key } from '@core/types/ChartTypes'

export interface IProps {
  tab: string
  tabIndex: number
  show: boolean
  handleTabChange: (e: ChangeEvent<{}>, tabIndex: number | any) => void
  selectedKey: Key
  marketType: number
  arrayOfMarketIds: string[]
}

export interface IState {
  page: number
  perPage: number
  startDate: moment.Moment | null
  endDate: moment.Moment | null
  focusedInput: null | string
  activeDateButton: null | string
}
