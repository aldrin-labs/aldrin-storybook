import { Theme } from '@material-ui/core'

export interface IProps {
  classes: any
  transactionsData: any
  accordionTitle: string
  getError: (err: any) => void
  isCompleted: () => void
  isFinished: boolean
  showLoader: boolean
  theme: Theme
}

export interface IState {
  expanded: boolean | string
}
