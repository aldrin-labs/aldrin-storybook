import moment from 'moment'
import { Theme } from '@material-ui/core'

export interface IProps {
  startDate: moment.Moment | null
  endDate: moment.Moment | null
  focusedInput: null | string
  activeDateButton: null | string
  minimumDate: moment.Moment
  maximumDate: moment.Moment
  show: boolean
  onDateButtonClick: (stringDate: string) => void
  onDatesChange: ({
    startDate,
    endDate,
  }: {
    startDate: moment.Moment | null
    endDate: moment.Moment | null
  }) => void
  onFocusChange: (focusedInput: string) => void
  onSearchDateButtonClick: () => Promise<any>
  onClearDateButtonClick: () => void
}
