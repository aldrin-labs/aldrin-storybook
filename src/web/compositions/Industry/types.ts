import { Theme } from '@material-ui/core'

export interface IProps {
  theme: Theme
  tab: string
  joyrideSettings: {
    run: boolean
    callback: () => void
    key: number
  }
}


export interface IState {
  key: number
}
