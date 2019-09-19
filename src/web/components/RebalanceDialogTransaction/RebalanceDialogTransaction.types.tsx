export interface IProps {
  accordionTitle: string
  transactionsData: any
  open: boolean
  handleClickOpen: () => void
  handleClose: () => void
  onNewSnapshot: () => void
  theme: {
    palette: { black: any; blue: any }
  }
  executeRebalanceHandler: any
  initialTime: any
  progress: number
  rebalanceInfoPanelData: any
}

export interface IState {
  isFinished: boolean
  isError: boolean
  isDisableBtns: boolean
  showLoader: boolean
  hideDialogButton: boolean
}
