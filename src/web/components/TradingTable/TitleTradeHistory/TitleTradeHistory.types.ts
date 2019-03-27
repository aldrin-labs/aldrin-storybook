import moment from 'moment'

export interface IProps {
  minimumDate: moment.Moment
  maximumDate: moment.Moment
  secondary: string
  fontFamily: string | undefined
  textColor: string
  primaryLight: string
  show: boolean
}

export interface IState {
  startDate: moment.Moment | null
  endDate: moment.Moment | null
  focusedInput: null | string
  activeDateButton: null | string
}
