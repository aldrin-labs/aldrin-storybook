import { Theme } from '@material-ui/core'

export interface IProps {
  classes: any
  transactionsData: any
  accordionTitle: string
  // getError: () => void
  // isCompleted: () => void
  isFinished: boolean
  theme: Theme
}

export interface IState {
  expanded: boolean
}
