import dayjs from 'dayjs'
import { Theme } from '@material-ui/core'

export interface IProps {
  page: number
  perPage: number
  maxRows: number
  theme: Theme
  startDate: typeof dayjs | null
  endDate: typeof dayjs | null
  focusedInput: null | string
  activeDateButton: null | string
  minimumDate: typeof dayjs
  maximumDate: typeof dayjs
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
  handleChangePage: (page: number) => void
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLSelectElement>) => void
}
