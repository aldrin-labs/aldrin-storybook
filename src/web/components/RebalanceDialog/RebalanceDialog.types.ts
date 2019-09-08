export interface IProps {
  openWarning: boolean
  warningMessage: string
  isSaveError: boolean
  isSystemError: boolean
  isCurrentAssetsChangedError: boolean
  isDustFilterError: boolean
  isUserHasLockedBalance: boolean
  hideWarning: (event?: MouseEvent<HTMLElement>) => void
  onSaveClick: Function,
  onReset: Function,
  createNewSnapshot: Function,
}