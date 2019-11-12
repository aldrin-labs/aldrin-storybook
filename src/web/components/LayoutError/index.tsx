import React from 'react'
import { withStyles } from '@material-ui/styles'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import IconButton from '@material-ui/core/IconButton'
import ErrorIcon from '@material-ui/icons/Error'
import CloseIcon from '@material-ui/icons/Close'

import { layoutSavingMessage } from '@core/config/errorMessages'

const styles = theme => ({
  close: {
    padding: theme.spacing.unit / 2,
  },
  snackbar: {
    backgroundColor: theme.customPalette.red.main
  },
  icon: {
    fontSize: 20,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  iconVariant: {
    fontSize: 20,
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
})

class LayoutError extends React.Component {
  render() {
    const { classes } = this.props
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={this.props.open}
        autoHideDuration={2000}
        onClose={this.props.handleClose}
      >
        <SnackbarContent
          className={classes.snackbar}
          aria-describedby="client-snackbar"
          message={
            <span id="client-snackbar" className={classes.message}>
              <ErrorIcon className={classes.iconVariant} />
              {layoutSavingMessage}
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={this.props.handleClose}
            >
              <CloseIcon className={classes.icon} />
            </IconButton>,
          ]}
        />
      </Snackbar>
    )
  }
}

export default withStyles(styles)(LayoutError)