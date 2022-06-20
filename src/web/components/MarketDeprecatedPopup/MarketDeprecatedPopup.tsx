import { Theme } from '@material-ui/core'
import React from 'react'
import { Link } from 'react-router-dom'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import SvgIcon from '@sb/components/SvgIcon'
import { WhiteText } from '@sb/components/TraidingTerminal/ConfirmationPopup'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import {
  BlueButton,
  Title,
} from '@sb/compositions/Chart/components/WarningPopup'
import { useMarket } from '@sb/dexUtils/markets'
import { useLocalStorageState } from '@sb/dexUtils/utils'

import CloseIcon from '@icons/closeIcon.svg'

import { StyledPaper } from './MarketDeprecatedPopup.styles'

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
  const [isDeprecatedMarketPopupOpen, setIsDeprecatedMarketPopupOpen] =
    useLocalStorageState(`isDeprecatedMarketPopupOpen-${oldMarketID}`, true)
  const [isUpdatedMarketPopupOpen, setIsUpdatedMarketPopupOpen] =
    useLocalStorageState(`isUpdatedMarketPopupOpen-${newMarketID}`, true)

  const currentMarketPublicKey = market?.publicKey?.toString()
  const isNewMarket = currentMarketPublicKey === newMarketID
  const showPopup =
    (currentMarketPublicKey === newMarketID && isUpdatedMarketPopupOpen) ||
    (currentMarketPublicKey === oldMarketID && isDeprecatedMarketPopupOpen)

  if (!showPopup || !currentMarketPublicKey) {
    return null
  }

  const onClose = () =>
    isNewMarket
      ? setIsUpdatedMarketPopupOpen(false)
      : setIsDeprecatedMarketPopupOpen(false)

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={() => {}} // close only by ok
      maxWidth="md"
      open
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer style={{ marginBottom: '10rem' }} justify="space-between">
        <Title>{isNewMarket ? 'Market Updated' : 'Market Deprecated'}</Title>{' '}
        <SvgIcon
          onClick={() => onClose()}
          src={CloseIcon}
          style={{ cursor: 'pointer' }}
          width="2rem"
          height="2rem"
        />
      </RowContainer>
      <RowContainer direction="column" style={{ marginBottom: '2rem' }}>
        <WhiteText style={{ fontSize: '1.7rem', marginBottom: '2rem' }}>
          {baseCurrency}/{quoteCurrency} is moved to a new market ID, liquidity
          is also moving.
        </WhiteText>
        <WhiteText style={{ display: 'inline', fontSize: '1.7rem' }}>
          You can close your open orders on{' '}
          {isNewMarket ? (
            <>
              <span>old</span>{' '}
              <Link
                style={{
                  color: theme.palette.blue.serum,
                  textDecoration: 'none',
                }}
                to={`/chart/spot/${baseCurrency}_${quoteCurrency}_deprecated`}
              >
                {baseCurrency}/{quoteCurrency}
              </Link>
            </>
          ) : (
            'this'
          )}{' '}
          market and continue your trading on the new one{' '}
          {isNewMarket ? (
            'here'
          ) : (
            <>
              :{' '}
              <Link
                style={{
                  color: theme.palette.blue.serum,
                  textDecoration: 'none',
                }}
                to={`/chart/spot/${baseCurrency}_${quoteCurrency}`}
              >
                {baseCurrency}/{quoteCurrency}
              </Link>
            </>
          )}
        </WhiteText>
      </RowContainer>
      <RowContainer
        justify="space-between"
        style={{ margin: '10rem 0 2rem 0' }}
      >
        <BlueButton style={{ width: '100%' }} onClick={onClose}>
          Ok
        </BlueButton>
      </RowContainer>
    </DialogWrapper>
  )
}
