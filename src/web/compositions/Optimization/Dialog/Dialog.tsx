import React from 'react'
import { Dialog, DialogTitle, DialogActions, Button } from '@material-ui/core'

interface Props {
  open: boolean
  warningMessage?: string
  onConfirmButton?: () => any
  onReportButton?: () => any
  isSystemError?: boolean
}

const ErrorDialog = ({
  open,
  warningMessage = '',
  onConfirmButton = () => ({}),
  onReportButton = () => ({}),
  isSystemError,
}: Props) => {
  return (
    <Dialog
      id="dialogOptimization"
      fullScreen={false}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">{warningMessage}</DialogTitle>
      <DialogActions>
        <Button
          onClick={onConfirmButton}
          color="secondary"
          id="okButtonDialog"
          autoFocus={true}
        >
          ok
        </Button>
        {isSystemError && (
          <Button
            onClick={onReportButton}
            size="small"
            style={{ margin: '0.5rem 1rem' }}
          >
            Report bug
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default ErrorDialog
