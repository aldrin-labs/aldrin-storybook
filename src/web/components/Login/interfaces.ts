export interface Props {
  user: any
  isShownModal: boolean
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
}

export interface State {
  anchorEl: EventTarget | null
  lock: Auth0LockStatic | null
}
