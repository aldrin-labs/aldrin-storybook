import React from 'react'
import { SnackbarProvider } from 'notistack'
import { withStyles } from '@material-ui/styles'
import { IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

const canselStyeles = (theme) => ({
  icon: {
    fontSize: 20,
  },
})

const CloseButton = withStyles(canselStyeles)((props) => (
  <IconButton key="close" aria-label="Close" color="inherit">
    <CloseIcon className={props.classes.icon} />
  </IconButton>
))

const snackStyeles = (theme) => ({
  success: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    backgroundColor: theme.customPalette.green.main,
  },
  error: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    backgroundColor: theme.customPalette.red.main,
  },
})

const IntegrationNotistack = ({ ...props }) => {
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      action={<CloseButton />}
      classes={{
        variantSuccess: props.classes.success,
        variantError: props.classes.error,
      }}
    >
      {props.children}
    </SnackbarProvider>
  )
}

export default withStyles(snackStyeles)(IntegrationNotistack)
