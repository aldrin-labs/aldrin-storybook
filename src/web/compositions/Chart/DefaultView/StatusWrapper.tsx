import React from 'react'
import { Button } from '@material-ui/core'
import { withSnackbar } from 'notistack'

import { orderError } from '@core/utils/errorsConfig'
import { DefaultView } from './DefaultView'

const OrderStatusWrapper = (props) => {
  const showOrderResult = (result, cancelOrder, marketType) => {
    if (result.status === 'success' && result.orderId && result.message) {
      props.enqueueSnackbar(result.message, {
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
      props.enqueueSnackbar(orderError, { variant: 'error' })
    } else {
      props.enqueueSnackbar(result.message, { variant: 'error' })
    }
  }

  const showFuturesTransfer = (result) => {
    if (result.status === 'OK' && result.data && result.data.tranId) {
      props.enqueueSnackbar('Funds transfered!', {
        variant: 'success',
        // action: <CloseButton />,
      })
    } else {
      props.enqueueSnackbar('Something went wrong during transfering funds', {
        variant: 'error',
      })
    }
  }

  const showCancelResult = (result) => {
    if (result.status === 'success' && result.message) {
      props.enqueueSnackbar(result.message, {
        variant: 'success',
        // action: <CloseButton />,
      })
    } else if (result.status === 'success' || !result.message) {
      props.enqueueSnackbar(orderError, { variant: 'error' })
    } else {
      props.enqueueSnackbar(result.message, { variant: 'error' })
    }
  }

  const showChangePositionModeResult = (result, target = 'Position mode') => {
    if (result.errors) {
      props.enqueueSnackbar('Something went wrong', { variant: 'error' })
      return
    }

    if (result.status === 'OK') {
      props.enqueueSnackbar(`${target} changed successfully`, {
        variant: 'success',
      })
    } else {
      props.enqueueSnackbar(result.binanceMessage, { variant: 'error' })
    }
  }

  console.log('status wrapper rerender')
  return (
    <DefaultView
      showOrderResult={showOrderResult}
      showCancelResult={showCancelResult}
      showFuturesTransfer={showFuturesTransfer}
      showChangePositionModeResult={showChangePositionModeResult}
      {...props}
    />
  )
}

export default withSnackbar(OrderStatusWrapper)
