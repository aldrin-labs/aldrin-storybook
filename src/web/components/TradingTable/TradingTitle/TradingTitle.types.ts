import moment from 'moment'

export interface IProps {
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
}
