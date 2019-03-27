import { Theme } from '@material-ui/core'
import moment from 'moment'

export interface IProps {
  theme: Theme
}

export interface IState {
  tab: string
  tabIndex: number
  startDate: moment.Moment | null,
  endDate: moment.Moment | null,
  focusedInput: null | string,
  activeDateButton: null | string
}
