import React from 'react'
import { Dialog, DialogTitle, Grid } from '@material-ui/core'
import { Clear } from '@material-ui/icons'

// import { roundAndFormatNumber } from '@core/utils/PortfolioTableUtils'

import {
  TypographyTitle,
  StyledDialogContent,
  ClearButton,
} from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'

import OrderbookTable from './OrderbookTable'
import { StyledPaper, StyledArrow } from './OrderbookDialog.styles'

const OrderbookDialog = ({ isDialogOpen, closeDialog, data }) => {
  const buyOrdersData = data.ordersA ? JSON.parse(data.ordersA) : { asks: [] }

  const middleOrdersData = data.ordersB
    ? JSON.parse(data.ordersB)
    : { asks: [] }

  const sellOrdersData = data.orders
    ? { bids: JSON.parse(data.orders) }
    : { bids: [] }

  return (
    <Dialog
      PaperComponent={StyledPaper}
      style={{ width: '100%', margin: 'auto' }}
      fullScreen={false}
      onClose={closeDialog}
      maxWidth={'md'}
      open={isDialogOpen}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle
        disableTypography
        id="responsive-dialog-title"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid #E0E5EC',
          backgroundColor: '#F2F4F6',
          height: '4rem',
        }}
      >
        <TypographyTitle>Orderbook</TypographyTitle>
        <ClearButton>
          <Clear
            style={{ fontSize: '2rem' }}
            color="inherit"
            onClick={closeDialog}
          />
        </ClearButton>
      </DialogTitle>
      <StyledDialogContent>
        <Grid container direction={'row'} alignItems={'flex-start'}>
          <OrderbookTable title={'Buy'} data={{ ...buyOrdersData }} />
          <StyledArrow color={'inherit'} />
          <OrderbookTable title={'_'} data={{ ...middleOrdersData }} />
          <StyledArrow color={'inherit'} />
          <OrderbookTable title={'Sell'} data={{ ...sellOrdersData }} />
        </Grid>
      </StyledDialogContent>
    </Dialog>
  )
}

export default OrderbookDialog
