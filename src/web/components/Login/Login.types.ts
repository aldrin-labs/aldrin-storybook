import { Theme } from '@material-ui/core'

export interface Props {
  theme: Theme
  user: any
  loginStatus: boolean
  modalIsOpen: boolean
  modalLogging: boolean
  logging: boolean
  modalStatusMutation: Function
  modalProcessMutation: Function
  authErrorsMutation: Function
  onLoginProcessChanges: Function
  onLogin: Function
  handleLogout: Function
  isLogging: Function
}
