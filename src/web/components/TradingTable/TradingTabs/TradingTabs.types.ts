import { Theme } from '@material-ui/core'

export interface IProps {
  tab: string
  handleTabChange: (tab: string | any) => void
  theme: Theme
}
