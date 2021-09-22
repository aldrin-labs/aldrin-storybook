import { Theme } from '@material-ui/core'

export interface IProps {
  theme: Theme
  isMobile: boolean
  history: History
  marketType: 0 | 1
  updateTerminalViewMode: (mode: string) => void
  terminalViewMode: string
}
export interface IState {
  tab: string
  canceledOrders: string[]
}

export type IStateKeys = keyof IState
