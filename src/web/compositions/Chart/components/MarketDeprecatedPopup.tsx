import React, { useState } from 'react'
import styled from 'styled-components'

import { Paper, Theme } from '@material-ui/core'
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'

import { WhiteText } from '@sb/components/TraidingTerminal/ConfirmationPopup'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import { BlueButton, Title } from './WarningPopup'
import { useMarket } from '@sb/dexUtils/markets'
import CloseIcon from '@icons/closeIcon.svg'
import SvgIcon from '@sb/components/SvgIcon'

export const StyledPaper = styled(Paper)`
  border-radius: 2rem;
  width: 50rem;
  height: auto;
  background: #222429;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4rem 2rem 2rem;
`

export const MarketDeprecatedPopup = ({
  theme,
  oldMarketID,
  newMarketID,
}: {
  theme: Theme
  oldMarketID: string
  newMarketID: string
}) => {
  const { market, baseCurrency, quoteCurrency } = useMarket()
  const [isPopupOpen, setIsPopupOpen] = useState(true)

  const currentMarketPublicKey = market?.publicKey?.toString()
  const showNewMarket = currentMarketPublicKey === newMarketID
  const showPopup =
    currentMarketPublicKey === newMarketID ||
    currentMarketPublicKey === oldMarketID

  if (!showPopup || !isPopupOpen) {
    return null
  }
  const onClose = () => setIsPopupOpen(false)

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={onClose}
      maxWidth={'md'}
      open={isPopupOpen}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer style={{ marginBottom: '10rem' }} justify={'space-between'}>
        <Title>{!showNewMarket ? 'Market Deprecated' : 'Market Updated'}</Title>{' '}
        <SvgIcon
          onClick={() => onClose()}
          src={CloseIcon}
          style={{ cursor: 'pointer' }}
          width={'2rem'}
          height={'2rem'}
        />
      </RowContainer>
      <RowContainer direction={'column'} style={{ marginBottom: '2rem' }}>
        <WhiteText style={{ fontSize: '1.7rem', marginBottom: '2rem' }}>
          {baseCurrency}/{quoteCurrency} is moved to a new market ID, liquidity
          is also moving.
        </WhiteText>
        <WhiteText style={{ display: 'inline', fontSize: '1.7rem' }}>
          You can close your open orders on this market and continue your
          trading on the new one:{' '}
          <a
            style={{ color: theme.palette.blue.serum, textDecoration: 'none' }}
            href={`${baseCurrency}_${quoteCurrency}`}
          >
            {' '}
            {baseCurrency}/{quoteCurrency}
          </a>
        </WhiteText>
      </RowContainer>
      <RowContainer
        justify="space-between"
        style={{ margin: '10rem 0 2rem 0' }}
      >
        <BlueButton style={{ width: '100%' }} theme={theme} onClick={onClose}>
          Ok
        </BlueButton>
      </RowContainer>
    </DialogWrapper>
  )
}
