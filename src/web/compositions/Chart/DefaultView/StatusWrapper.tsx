import React from 'react'
import { Button } from '@material-ui/core'
import { withSnackbar } from 'notistack'

import { orderError } from '@core/utils/errorsConfig'
import { DefaultView } from './DefaultView'

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
            {/* <CloseButton /> */}
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
      this.props.enqueueSnackbar('Funds transfered!', {
        variant: 'success',
        // action: <CloseButton />,
      })
    } else {
      this.props.enqueueSnackbar(
        'Something went wrong during transfering funds',
        { variant: 'error' }
      )
    }
  }

  showCancelResult = (result) => {
    if (result.status === 'success' && result.message) {
      this.props.enqueueSnackbar(result.message, {
        variant: 'success',
        // action: <CloseButton />,
      })
    } else if (result.status === 'success' || !result.message) {
      this.props.enqueueSnackbar(orderError, { variant: 'error' })
    } else {
      this.props.enqueueSnackbar(result.message, { variant: 'error' })
    }
  }

  showChangePositionModeResult = (result) => {
    if (result.errors) {
      this.props.enqueueSnackbar('Something went wrong', { variant: 'error' })
      return
    }

    if (result.status === 'OK') {
      this.props.enqueueSnackbar('Position mode changed', {
        variant: 'success',
        // action: <CloseButton />,
      })
    } else {
      this.props.enqueueSnackbar(result.binanceMessage, { variant: 'error' })
    }
  }

  render() {
    return (
      <DefaultView
        showOrderResult={this.showOrderResult}
        showCancelResult={this.showCancelResult}
        showFuturesTransfer={this.showFuturesTransfer}
        showChangePositionModeResult={this.showChangePositionModeResult}
        {...this.props}
      />
    )
  }
}

export default withSnackbar(OrderStatusWrapper)
