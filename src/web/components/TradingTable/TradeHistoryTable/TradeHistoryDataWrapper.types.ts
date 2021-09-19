import dayjs from 'dayjs'

import { Theme } from '@material-ui/core'

export interface IProps {
  tab: string
  show: boolean
  theme: Theme,
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
