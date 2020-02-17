import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  DialogActions,
} from '@material-ui/core'
import termsOfUseText from './termsOfUseText'

export default ({ open, onClick }: { open: boolean; onClick: () => void }) => (
  <Dialog open={open} scroll={'paper'} aria-labelledby="scroll-dialog-title">
    <DialogTitle id="scroll-dialog-title">Terms of Use</DialogTitle>
    <DialogContent>
      <DialogContentText>{termsOfUseText}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClick} color="secondary">
        Ok
      </Button>
    </DialogActions>
  </Dialog>
)
