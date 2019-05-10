import { ChangeEvent } from 'react'
import moment from 'moment'

import { Key } from '@core/types/ChartTypes'


export interface IProps {
  tab: string
  tabIndex: number
  show: boolean
  handleTabChange: (e: ChangeEvent<{}>, tabIndex: number | any) => void
  selectedKey: Key
}

export interface IState {
  startDate: moment.Moment | null
  endDate: moment.Moment | null
  focusedInput: null | string
  activeDateButton: null | string
}
