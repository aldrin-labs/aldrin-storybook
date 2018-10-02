import { WithTheme } from '@material-ui/core/styles'

export interface IProps extends WithTheme {
  showModalAfterDelay?: number
}
export interface IState {
  showModal: boolean
}
