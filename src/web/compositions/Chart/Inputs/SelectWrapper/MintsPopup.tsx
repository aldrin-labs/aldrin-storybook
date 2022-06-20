import React from 'react'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'

import { CoinAddressWithLabel, MarketAddressWithLabel } from './MintsPopupRow'
import { StyledPaper } from './SelectWrapperStyles'

export const MintsPopup = ({
  onClose,
  open,
  symbol = 'RIN/USDC',
  marketAddress,
}: {
  onClose: () => void
  open: boolean
  symbol: string
  marketAddress: string
}) => {
  const [base, quote] = symbol.split('/')

  return (
    <DialogWrapper
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={onClose}
      maxWidth="md"
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <MarketAddressWithLabel marketAddress={marketAddress} />
      <CoinAddressWithLabel symbol={base} />
      <CoinAddressWithLabel symbol={quote} />
    </DialogWrapper>
  )
}
