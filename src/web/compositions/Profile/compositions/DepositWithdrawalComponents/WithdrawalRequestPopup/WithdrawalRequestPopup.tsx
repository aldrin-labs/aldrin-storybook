import React, { useState } from 'react'
import { Grid, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
import MuiDialogContent from '@material-ui/core/DialogContent'
import { Loading } from '@sb/components/index'

import {
  TypographyCustomHeading,
  DialogWrapper,
  DialogTitleCustom,
} from '@sb/components/AddAccountDialog/AddAccountDialog.styles'

const DialogContent = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
}))(MuiDialogContent)

interface IProps {
  open: boolean
  handleClose: () => void
  withdrawalRequestLoading: boolean
}

const WithdrawalRequestPopup = ({
  open,
  handleClose,
  withdrawalRequestLoading,
}: IProps) => {
  return (
    <>
      <DialogWrapper
        aria-labelledby="customized-dialog-title"
        onClose={handleClose}
        open={open}
        style={{
          borderRadius: '50%',
          paddingTop: 0,
        }}
      >
        <DialogContent
          justify="center"
          style={{
            padding: '0 3rem 3rem',
          }}
        >
          <Grid container justify="center" alignItems="center">
            {withdrawalRequestLoading ? (
              <Loading size={50} style={{ height: '50px' }} />
            ) : null}
          </Grid>
        </DialogContent>
      </DialogWrapper>
    </>
  )
}

export default WithdrawalRequestPopup
