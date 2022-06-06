import dayjs from 'dayjs'

export interface IProps {
  tab: string
  show: boolean
  handlePairChange: (pair: string) => void
  marketType: number
}

export interface IState {
  page: number
  perPage: number
  allKeys: boolean
  specificPair: string | boolean
  startDate: typeof dayjs | null
  endDate: typeof dayjs | null
  focusedInput: null | string
  activeDateButton: null | string
}
