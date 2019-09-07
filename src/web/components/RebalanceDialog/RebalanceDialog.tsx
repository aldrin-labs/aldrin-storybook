import React from 'react'
import { Dialog, DialogTitle, DialogActions, Button } from '@material-ui/core'

import config from '@core/utils/linkConfig'
import { IProps } from './RebalanceDialog.types'

const openLink = (link: string = '', hideWarningFunction: () => void) => {
  hideWarningFunction()
  window.open(link, 'CCAI Feedback')
}

const DialogComponent = ({
  openWarning,
  warningMessage,
  isSaveError,
  isSystemError,
  isCurrentAssetsChangedError,
  isDustFilterError,
  hideWarning,
  onSaveClick,
  onReset,
  createNewSnapshot,
  isUserHasLockedBalance,
}: IProps) => (
  <Dialog
    fullScreen={false}
    open={openWarning}
    aria-labelledby="responsive-dialog-title"
  >
    <DialogTitle id="responsive-dialog-title">{warningMessage}</DialogTitle>
    <DialogActions>
      {isSaveError && (
        <>
          <Button
            onClick={() => {
              hideWarning()
              onSaveClick()
            }}
            color="secondary"
            autoFocus={true}
          >
            Save anyway
          </Button>
          <Button
            onClick={() => {
              hideWarning()
              onSaveClick(true)
            }}
            size="small"
            style={{ margin: '0.8rem 1.6rem' }}
          >
            Delete empty and save
          </Button>
        </>
      )}
      {isSystemError && (
        <>
          <Button onClick={hideWarning} color="secondary" autoFocus={true}>
            ok
          </Button>
          <Button
            onClick={() => {
              openLink(config.bugLink, hideWarning)
            }}
            size="small"
            style={{ margin: '0.8rem 1.6rem' }}
          >
            Report bug
          </Button>
        </>
      )}
      {isCurrentAssetsChangedError && (
        <Button
          id="resetRebalancedPortfolioButton"
          onClick={() => {
            onReset(null, true)
            createNewSnapshot()
            hideWarning()
          }}
          color="secondary"
          autoFocus={true}
        >
          Reset my rebalanced portfolio and update snapshot
        </Button>
      )}
      {isDustFilterError && (
        <Button
          id="resetRebalancedPortfolioButton"
          onClick={() => {
            hideWarning()
          }}
          color="secondary"
          autoFocus={true}
        >
          Ok
        </Button>
      )}
      {
        isUserHasLockedBalance && (
          <Button
          id="userHasLockedBalance"
          onClick={() => {
            hideWarning()
          }}
          color="secondary"
          autoFocus={true}
        >
          Ok
        </Button>
        )
      }
    </DialogActions>
  </Dialog>
)

export default DialogComponent
