import moment from 'moment'
import { Theme } from '@material-ui/core'

export interface IProps {
  page: number
  perPage: number
  maxRows: number
  theme: Theme
  startDate: moment.Moment | null
  endDate: moment.Moment | null
  focusedInput: null | string
  activeDateButton: null | string
  minimumDate: moment.Moment
  maximumDate: moment.Moment
  onDateButtonClick: (stringDate: string) => void
  onDatesChange: ({
    startDate,
    endDate,
  }: {
    startDate: moment.Moment | null
    endDate: moment.Moment | null
  }) => void
  onFocusChange: (focusedInput: string) => void
  onClearDateButtonClick: () => void
  handleChangePage: (page: number) => void
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLSelectElement>) => void
}
