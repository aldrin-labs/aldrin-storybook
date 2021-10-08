import { Theme } from '@material-ui/core'

export interface IProps {
  tab: string
  handleTabChange: (tab: string | any) => void
  marketType: 0 | 1
  theme?: Theme
  terminalViewMode: string
  updateTerminalViewMode: (mode: string) => void
}
