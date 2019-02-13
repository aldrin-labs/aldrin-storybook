import { Theme } from '@material-ui/core'

export interface Props {
  theme: Theme
  user: any
  mainColor: string
  loginStatus: boolean
  modalIsOpen: boolean
  isLogging: boolean
  listenersOff: boolean
  modalLogging: boolean
  onLogin: Function
  createUser: Function
  storeLogin: Function
  storeLogout: Function
  storeOpenedModal: Function
  storeModalIsClosing: Function
  storeClosedModal: Function
  listenersWillOn: Function
  listenersWillOff: Function
  authErrorsMutation: Function
  handleLogout: Function
}
