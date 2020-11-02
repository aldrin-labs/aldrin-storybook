import React from 'react'
import { Button } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import { isEqual } from 'lodash'

import { orderError } from '@core/utils/errorsConfig'
import { DefaultView } from './DefaultView'

const OrderStatusWrapper = (props) => {
  const { enqueueSnackbar } = useSnackbar()

  const showOrderResult = (result, cancelOrder, marketType) => {
    if (result.status === 'success' && result.orderId && result.message) {
      enqueueSnackbar(result.message, {
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
      enqueueSnackbar(orderError, { variant: 'error' })
    } else {
      enqueueSnackbar(result.message, { variant: 'error' })
    }
  }

  const showFuturesTransfer = (result) => {
    if (result.status === 'OK' && result.data && result.data.tranId) {
      enqueueSnackbar('Funds transfered!', {
        variant: 'success',
        // action: <CloseButton />,
      })
    } else {
      enqueueSnackbar('Something went wrong during transfering funds', {
        variant: 'error',
      })
    }
  }

  const showCancelResult = (result) => {
    if (result.status === 'success' && result.message) {
      enqueueSnackbar(result.message, {
        variant: 'success',
        // action: <CloseButton />,
      })
    } else if (result.status === 'success' || !result.message) {
      enqueueSnackbar(orderError, { variant: 'error' })
    } else {
      enqueueSnackbar(result.message, { variant: 'error' })
    }
  }

  const showChangePositionModeResult = (result, target = 'Position mode') => {
    if (result.errors) {
      enqueueSnackbar('Something went wrong', { variant: 'error' })
      return
    }

    if (result.status === 'OK') {
      enqueueSnackbar(`${target} changed successfully`, {
        variant: 'success',
      })
    } else {
      enqueueSnackbar(result.binanceMessage, { variant: 'error' })
    }
  }

  console.log('status wrapper rerender', props)
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

export default React.memo(OrderStatusWrapper, (prev, next) => {
  console.log(
    'st conditioon',
    prev.marketType === next.marketType &&
      prev.selectedKey.keyId === next.selectedKey.keyId &&
      prev.currencyPair === next.currencyPair &&
      prev.terminalViewMode === next.terminalViewMode &&
      prev.selectedKey.hedgeMode === next.selectedKey.hedgeMode &&
      prev.isPairDataLoading === next.isPairDataLoading &&
      prev.chartPagePopup === next.chartPagePopup &&
      prev.maxLeverage === next.maxLeverage &&
      prev.themeMode === next.themeMode &&
      prev.theme.palette.type === next.theme.palette.type &&
      prev.layout.hideDepthChart === next.layout.hideDepthChart &&
      prev.layout.hideOrderbook === next.layout.hideOrderbook &&
      prev.layout.hideTradeHistory === next.layout.hideTradeHistory &&
      prev.layout.hideTradingViewChart === next.layout.hideTradingViewChart
  )

  return (
    prev.marketType === next.marketType &&
    prev.selectedKey.keyId === next.selectedKey.keyId &&
    prev.currencyPair === next.currencyPair &&
    prev.terminalViewMode === next.terminalViewMode &&
    prev.selectedKey.hedgeMode === next.selectedKey.hedgeMode &&
    prev.isPairDataLoading === next.isPairDataLoading &&
    prev.chartPagePopup === next.chartPagePopup &&
    prev.maxLeverage === next.maxLeverage &&
    prev.themeMode === next.themeMode &&
    prev.minPriceDigits === next.minPriceDigits &&
    prev.pricePrecision === next.pricePrecision &&
    prev.quantityPrecision === next.quantityPrecision &&
    prev.minSpotNotional === next.minSpotNotional &&
    prev.minFuturesStep === next.minFuturesStep &&
    prev.initialLeverage === next.initialLeverage &&
    prev.theme.palette.type === next.theme.palette.type &&
    prev.layout.hideDepthChart === next.layout.hideDepthChart &&
    prev.layout.hideOrderbook === next.layout.hideOrderbook &&
    prev.layout.hideTradeHistory === next.layout.hideTradeHistory &&
<<<<<<< HEAD
    prev.isChartPageOnboardingDone === next.isChartPageOnboardingDone &&
=======
    prev.layout.hideTradingViewChart === next.layout.hideTradingViewChart &&
>>>>>>> 51c5b8bcda740234e1519e66bd6f2fc6aa916afe
    isEqual(prev.theme, next.theme)
    // false
  )
})
