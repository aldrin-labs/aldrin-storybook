import React from 'react'
import { Button, IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { SnackbarProvider, withSnackbar } from 'notistack'
import { withStyles } from '@material-ui/styles'

import { orderError } from '@core/utils/errorsConfig'

import { DefaultView } from './DefaultView'

const canselStyeles = theme => ({
  icon: {
    fontSize: 20,
  }
})

const snackStyeles = theme => ({
  success: { backgroundColor: theme.customPalette.green.main },
  error: { backgroundColor: theme.customPalette.red.main },
})

const CloseButton = withStyles(canselStyeles)((props) => (
  <IconButton
    key="close"
    aria-label="Close"
    color="inherit"
  >
    <CloseIcon className={props.classes.icon} />
</IconButton>
))

class OrderStatusWrapper extends React.Component {
  showOrderResult = (result, cancelOrder, marketType) => {
    if (result.status === 'success' && result.orderId && result.message) {
      this.props.enqueueSnackbar(result.message, {
        variant: 'success',
        action: (
          <>
          <Button
            size="small"
            color="inherit"
            onClick={() => cancelOrder(result.orderId, marketType)}
          >
            {'Cancel'}
          </Button>
          <CloseButton />
          </>
        ),
      })
    } else if (result.status === 'success' || !result.message) {
      this.props.enqueueSnackbar(orderError, { variant: 'error' })
    } else {
      this.props.enqueueSnackbar(result.message, { variant: 'error' })
    }
  }

  showFuturesTransfer = (result) => {
    if (result.status === 'OK' && result.data && result.data.tranId) {
      this.props.enqueueSnackbar(
        'Funds transfered!', {
          variant: 'success',
          action: (
            <CloseButton />
          ),
        }
      )
    }
    else {
      this.props.enqueueSnackbar('Something went wrong during transfering funds', { variant: 'error' })
    }

  }

  showCancelResult = (result) => {
    if (result.status === 'success' && result.message) {
      this.props.enqueueSnackbar(result.message, {
        variant: 'success',
        action: (
          <CloseButton />
        ),
      })
    } else if (result.status === 'success' || !result.message) {
      this.props.enqueueSnackbar(orderError, { variant: 'error' })
    } else {
      this.props.enqueueSnackbar(result.message, { variant: 'error' })
    }
  }

  showUpdateLeverageResult = (result) => {
    if (result.status === 'success' && result.message) {
      this.props.enqueueSnackbar(result.message, {
        variant: 'success',
        action: (
          <CloseButton />
        ),
      })
    } else {
      this.props.enqueueSnackbar(result.message, { variant: 'error' })
    }
  }


  render() {
    return (
      <DefaultView
        showOrderResult={this.showOrderResult}
        showCancelResult={this.showCancelResult}
        showFuturesTransfer={this.showFuturesTransfer}
        showUpdateLeverageResult={this.showUpdateLeverageResult}
        {...this.props}
      />
    )
  }
}


const SnackbarWrapper = withSnackbar(OrderStatusWrapper)

const IntegrationNotistack = ({classes, ...otherProps}) => {
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      action={(
        <CloseButton />
      )}
      classes={{
        variantSuccess: classes.success,
        variantError: classes.error,
      }}
    >
      <SnackbarWrapper
        {...otherProps}
      />
    </SnackbarProvider>
  );
}

export default withStyles(snackStyeles)(IntegrationNotistack)
