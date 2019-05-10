import { ChangeEvent } from 'react'
import moment from 'moment'

export interface IProps {
  tab: string
  tabIndex: number
  show: boolean
  handleTabChange: (e: ChangeEvent<{}>, tabIndex: number | any) => void
  selectedKey: string
}

export interface IState {
  startDate: moment.Moment | null
  endDate: moment.Moment | null
  focusedInput: null | string
  activeDateButton: null | string
}
