import SnackbarUtils from '@sb/utils/SnackbarUtils'
import { orderError } from '@core/utils/errorsConfig'

export const showOrderResult = (result, cancelOrder, marketType) => {
  if (result.status === 'success' && result.orderId && result.message) {  
    SnackbarUtils['success'](result.message, {
      variant: 'success',
      // action: (
      //   <>
      //     <Button
      //       size="small"
      //       color="inherit"
      //       onClick={() => cancelOrder(result.orderId, marketType)}
      //     >
      //       {'Cancel'}
      //     </Button>
      //     {/* <CloseButton /> */}
      //   </>
      // ),
    })
  } else if (result.status === 'success' || !result.message) {
    SnackbarUtils['error'](orderError, { variant: 'error' })
  } else {
    SnackbarUtils['error'](result.message, { variant: 'error' })
  }
}

export const showFuturesTransfer = (result) => {
  if (result.status === 'OK' && result.data && result.data.tranId) {
    SnackbarUtils['success']('Funds transfered!', {
      variant: 'success',
      // action: <CloseButton />,
    })
  } else {
    SnackbarUtils['error']('Something went wrong during transfering funds', {
      variant: 'error',
    })
  }
}

export const showCancelResult = (result) => {
  if (result.status === 'success' && result.message) {
    SnackbarUtils['success'](result.message, {
      variant: 'success',
      // action: <CloseButton />,
    })
  } else if (result.status === 'success' || !result.message) {
    SnackbarUtils['error'](orderError, { variant: 'error' })
  } else {
    SnackbarUtils['error'](result.message, { variant: 'error' })
  }
}

export const showChangePositionModeResult = (result, target = 'Position mode') => {
  if (result.errors) {
    SnackbarUtils['error']('Something went wrong', { variant: 'error' })
    return
  }

  if (result.status === 'OK') {
    SnackbarUtils['success'](`${target} changed successfully`, {
      variant: 'success',
    })
  } else {
    SnackbarUtils['error'](result.binanceMessage, { variant: 'error' })
  }
}
