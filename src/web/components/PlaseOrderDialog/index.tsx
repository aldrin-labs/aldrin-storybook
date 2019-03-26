import React from 'react'

import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogContent from '@material-ui/core/DialogContent'
import Dialog from '@material-ui/core/Dialog'
import { compose, withStateHandlers } from 'recompose'
import _ from 'lodash'

const PlaseOrderDialogComponent = ({ ...props }: IProps) => {
    const { handleClickOpen,
      handleClose,
      open,
      handleSubmit,
      battonText,
      text,
      amount,
      errors,
      validateForm,
    } = props

    const handleClick = async () => {
      handleSubmit()
      handleClose()
    }

    const handleOpen = () => {
      validateForm()
      if (_.isEmpty(errors) && amount !== '') handleClickOpen()
    }

    return (<div>
      <Button
          variant="outlined"
          onClick={handleOpen}
        >
        {battonText}
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogContent>
          <DialogContentText>
            {text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleClick}>
            Place Order
          </Button>
        </DialogActions>
      </Dialog>
    </div>)
  }

const handleState = withStateHandlers(
  ({ open = false }: {open: boolean}) => ({
    open,
  }),
  {
    handleClickOpen: () => () => ({
      open: true,
    }),
    handleClose: () => () => ({
      open: false,
    }),
  }
)

export const PlaseOrderDialog = compose(
  handleState
)(PlaseOrderDialogComponent)
