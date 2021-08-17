import React from 'react'

import { Theme } from '@material-ui/core'
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'

import { StyledPaper } from './SelectWrapperStyles'
import { CoinAddressWithLabel, MarketAddressWithLabel } from './MintsPopupRow'

export const MintsPopup = ({
  theme,
  onClose,
  open,
  symbol = 'RIN/USDC',
  marketAddress,
}: {
  theme: Theme
  onClose: () => void
  open: boolean
  symbol: string
  marketAddress: string
}) => {
  const [base, quote] = symbol.split('/')

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={onClose}
      maxWidth={'md'}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <MarketAddressWithLabel marketAddress={marketAddress} />
      <CoinAddressWithLabel symbol={base} />
      <CoinAddressWithLabel symbol={quote} />
    </DialogWrapper>
  )
}
