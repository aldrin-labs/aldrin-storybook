import React, { useState } from 'react'
import { Grid, Typography } from '@material-ui/core'
import { Loading } from '@sb/components/index'

import {
  TypographyCustomHeading,
  DialogWrapper,
  DialogTitleCustom,
} from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { DialogContent } from '@sb/styles/Dialog.styles'

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
        PaperProps={{
          style: {
            minWidth: '50%',
            minHeight: '50%',
          },
        }}
      >
        <DialogContent
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '3rem',
            position: 'relative',
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
