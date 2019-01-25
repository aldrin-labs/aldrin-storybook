// https://material-ui.com/demos/snackbars/#customized-snackbars

import React from 'react'
import classNames from 'classnames'

import MdClear from '@material-ui/icons/Clear'
import MdWarning from '@material-ui/icons/Warning'
import green from '@material-ui/core/colors/green'
import amber from '@material-ui/core/colors/amber'
import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import { withStyles } from '@material-ui/core/styles'

const variantIcon = {
  warning: MdWarning,
}

const styles1 = (theme) => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
})

function MySnackbarContent(props) {
  const { classes, className, message, onCloseClick, variant, ...other } = props
  const Icon = variantIcon[variant]

  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton
          onClick={onCloseClick}
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.close}
        >
          <MdClear className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  )
}

const MySnackbarContentWrapper = withStyles(styles1)(MySnackbarContent)

const styles2 = (theme) => ({
  margin: {
    margin: theme.spacing.unit,
  },
})

class CustomizedSnackbars extends React.Component {
  render() {
    const { classes, messageText, open, onCloseClick } = this.props

    return (
      <>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={open}
          autoHideDuration={6000}
        >
          <MySnackbarContentWrapper
            onCloseClick={onCloseClick}
            variant="warning"
            className={classes.margin}
            message={messageText}
          />
        </Snackbar>
      </>
    )
  }
}

export default withStyles(styles2)(CustomizedSnackbars)
