import React from 'react'

import Yup from 'yup'

import { Grid, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

import { withTheme } from '@material-ui/styles'

import {
  TypographyCustomHeading,
  GridCustom,
  InputBaseCustom,
  DialogWrapper,
  DialogTitleCustom,
  Legend,
} from '@sb/components/AddAccountDialog/AddAccountDialog.styles'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'

const DialogTitle = withStyles((theme) => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.grey[500],
  },
}))((props) => {
  const { children, classes, onClose } = props
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="Close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  )
})

const DialogContent = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
}))(MuiDialogContent)

function GetKeysInfo(props) {
  const { handleClose, open } = props

  return (
    <>
      <DialogWrapper aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitleCustom
          id="customized-dialog-title"
          style={{
            backgroundColor: '#fff',
          }}
        >
          <TypographyCustomHeading
            fontWeight={'700'}
            borderRadius={'1rem'}
            style={{
              textAlign: 'center',
              fontSize: '17px',
              letterSpacing: '1.5px',
              color: '#16253D',
            }}
          >
            Import Keys
          </TypographyCustomHeading>

          <Typography
            style={{
              marginTop: '9px',
              fontSize: '13px',
              lineHeight: '23px',
              color: '#4A4A4A',
            }}
          >
            Follow these instructions to import your keys from Binance.
          </Typography>
        </DialogTitleCustom>
        <DialogContent
          justify="center"
          style={{
            padding: '0 3rem 3rem',
          }}
        >
          <Grid justify="center">
            <GridCustom>
              <Typography
                style={{
                  maxWidth: '466px',
                  width: '100%',
                  margin: '0 auto',
                  color: '#4A4A4A',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '26px',
                }}
              >
                <ul
                  style={{
                    listStyle: 'none',
                    color: '#4A4A4A',
                    padding: 0,
                    marginBottom: '3em',
                  }}
                >
                  <li style={{ marginBottom: '2%' }}>
                    1. Log into your account at https://binance.com
                  </li>
                  <li style={{ marginBottom: '2%' }}>
                    2. Navigate to account settings
                  </li>
                  <li style={{ marginBottom: '2%' }}>
                    3. Locate the API section and click ‘Enable’
                  </li>
                  <li style={{ marginBottom: '2%' }}>
                    4. If you want to import your futures data - enable futures
                    on API settings
                  </li>
                  <li style={{ marginBottom: '2%' }}>5. Copy keys</li>
                </ul>
              </Typography>
            </GridCustom>
          </Grid>

          <Grid container justify="flex-center" alignItems="center">
            <BtnCustom
              backgroundColor="white"
              onClick={() => {
                handleClose()
              }}
              style={{
                maxWidth: '160px',
                width: '100%',
                height: '100%',
                border: '2px solid #E0E5EC',
                borderRadius: '16px',
                padding: '8px 20px',
                color: '#16253D',
                textTransform: 'uppercase',
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: 'bold',
                margin: '0 auto',
              }}
            >
              OK
            </BtnCustom>
          </Grid>
        </DialogContent>
      </DialogWrapper>
    </>
  )
}

export default GetKeysInfo
