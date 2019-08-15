import React, { useState } from 'react'
import { Dialog, DialogTitle, Grid } from '@material-ui/core'
import { Clear, Refresh } from '@material-ui/icons'

// import { roundAndFormatNumber } from '@core/utils/PortfolioTableUtils'

import {
  StyledPaper,
  TypographyTitle,
  StyledDialogContent,
  Line,
  ClearButton,
} from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'

import {
  SignalPropertyGrid,
  PropertyName,
  SectionTitle,
  PropertyInput,
  SaveButton,
  RefreshButton,
  ErrorText,
} from '@sb/components/SignalPreferencesDialog/SignalPreferencesDialog.styles'

import OrderBookBody from '@sb/compositions/Chart/Tables/OrderBookTable/Tables/Asks/OrderBookTable'
import SpreadTable from '@sb/compositions/Chart/Tables/OrderBookTable/Tables/Bids/SpreadTable'

const OrderbookDialog = ({ isDialogOpen, closeDialog, data }) => {
  const newDataAsks = data ? JSON.parse(data.asks) : []
  const newDataBids = data ? JSON.parse(data.bids) : []

  const asksData = newDataAsks.map((ask) => ({
    price: +(+ask[0]).toFixed(2),
    size: +ask[1][0],
    total: +ask[1][1],
  }))

  const bidsData = newDataBids.map((bid) => ({
    price: +(+bid[0]).toFixed(2),
    size: +bid[1][0],
    total: +bid[1][1],
  }))

  console.log('rowdata', asksData, bidsData)

  // const asksData = [
  //   { price: 1000, size: 1000, total: 1000 },
  //   { price: 1000, size: 1000, total: 1000 },
  //   { price: 1000, size: 1000, total: 1000 },
  //   { price: 1000, size: 1000, total: 1000 },
  //   { price: 1000, size: 1000, total: 1000 },
  //   { price: 1000, size: 1000, total: 1000 },
  //   { price: 1000, size: 1000, total: 1000 },
  //   { price: 1000, size: 1000, total: 1000 },
  // ]
  // const bidsData = [{ price: 1000, size: 1000, total: 1000 }]

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
        {/* <Grid
          style={{ padding: '.8rem 0' }}
          container
          alignItems="center"
          wrap="nowrap"
        >
          <SectionTitle>Orderbook</SectionTitle>
          <Line />
        </Grid> */}
        <Grid container direction={'column'}>
          <OrderBookBody data={asksData} />

          {/* <HeadRow
            {...{
              primary,
              type,
              palette,
              quote,
              spread,
              digitsAfterDecimalForSpread: Math.max(
                digitsAfterDecimalForBidsPrice,
                digitsAfterDecimalForAsksPrice
              ),
              key: 'bids_headrow',
            }}
          /> */}

          <div
            style={{ width: '100%', height: '30px', background: '#F2F4F6' }}
          />

          <SpreadTable data={bidsData} />
        </Grid>
      </StyledDialogContent>
    </Dialog>
  )
}

export default OrderbookDialog
