import { Theme } from '@material-ui/core'

export interface IProps {
  accordionTitle: string
  transactionsData: any
  open: boolean
  rebalanceError: boolean
  slippageValue: number
  showRetryButton: boolean
  rebalanceIsCanceled: boolean
  rebalanceIsExecuting: boolean
  showRebalanceProgress: boolean
  openDialog: () => void
  updateProgress: (value: number) => void
  onChangeSlippage: (value: number | string) => void
  handleClickOpen: () => void
  handleClose: () => void
  onNewSnapshot: () => void
  hideLeavePopup: () => void
  setTransactions: () => void
  cancelOrder: () => void
  toggleShowRetryButton: (value: boolean) => void
  setErrorStatus: (status: boolean) => void
  toggleCancelRebalance: (isRebalanceCanceled: boolean) => void
  updateRebalanceProgress: (value: boolean) => void
  theme: Theme
  executeRebalanceHandler: any
  initialTime: any
  progress: number | null
  rebalanceInfoPanelData: any
}

export interface IState {
  isFinished: boolean
  isError: boolean
  isDisableBtns: boolean
  showLoader: boolean
  hideDialogButton: boolean
  showTransactionTable: boolean
}
