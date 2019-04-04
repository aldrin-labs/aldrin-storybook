import React from 'react'

import DialogActions from '@material-ui/core/DialogActions'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogContent from '@material-ui/core/DialogContent'
import Dialog from '@material-ui/core/Dialog'
import { compose, withStateHandlers } from 'recompose'
import _ from 'lodash'

import { TradeButton } from './styles'

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
      <TradeButton
          variant="outlined"
          onClick={handleOpen}
        >
        {battonText}
      </TradeButton>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogContent>
          <DialogContentText>
            {text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <TradeButton onClick={handleClose}>
            Cancel
          </TradeButton>
          <TradeButton onClick={handleClick}>
            Place Order
          </TradeButton>
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
