import React, { useState } from 'react'
import { Grid } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import {
  TypographyHeading,
  StyledButton,
  StyledLink,
} from './SharePortfolioPanel.style'
import SelectPortfolioPeriod from '@sb/components/SelectPortfolioPeriod'
import TransferPopup from '@sb/compositions/Chart/components/TransferPopup'
import { IProps } from './SharePortfolio.types'
import { MASTER_BUILD } from '@core/utils/config'

import PillowButton from '@sb/components/SwitchOnOff/PillowButton'

const SharePortfolioPanel = ({
  portfolioName,
  onToggleUSDBTC,
  isUSDCurrently,
  isSPOTCurrently,
  setPageType,
  choosePeriod,
  theme,
}) => {
  const [loading, setLoading] = useState(false)
  const [open, togglePopup] = useState(false)
  const [transferFromSpotToFutures, setTransferFromSpotToFutures] = useState(
    false
  )
  const { enqueueSnackbar } = useSnackbar()

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

  return (
    <Grid
      container
      justify="space-between"
      alignItems="center"
      style={{
        padding: '1.6rem 24px',
        height: '45%',
        background: '#F9FBFD',
      }}
    >
      <Grid item>
        <Grid container justify="flex-start" alignItems="center">
          <Grid item style={{ marginRight: '1rem' }}>
            <TypographyHeading textColor={theme.palette.black.registration}>
              {portfolioName}
            </TypographyHeading>
          </Grid>
          {/* <Grid item>
              <StyledButton
                padding="0.4rem 1rem 0.35rem 1rem"
                borderRadius={'12px'}
                onClick={handleOpenSharePortfolio}
              >
                share portfolio
              </StyledButton>
            </Grid> */}
        </Grid>
      </Grid>

      <Grid item>
        <Grid
          container
          justify="flex-start"
          alignItems="center"
          id="sharePortfolioSwitcher"
        >
          <Grid item>
            <SelectPortfolioPeriod
              isSPOTCurrently={isSPOTCurrently}
              chooseHistoryPeriod={choosePeriod}
            />
          </Grid>
          <Grid item style={{ display: 'flex' }}>
            {isSPOTCurrently ? (
              <>
                <StyledLink
                  active
                  to="/profile/deposit"
                  padding="0.5rem 2rem 0.4rem 2rem"
                  borderRadius={'.8rem'}
                >
                  Deposit
                </StyledLink>
                <StyledLink
                  to="/profile/withdrawal"
                  padding=".5rem .8rem 0.4rem .8rem"
                  borderRadius={'.8rem'}
                  style={{ marginLeft: '1.3rem' }}
                >
                  Withdrawal
                </StyledLink>
              </>
            ) : (
              <>
                <StyledButton
                  active
                  padding="0.5rem 2rem 0.4rem 2rem"
                  borderRadius={'.8rem'}
                  onClick={() => {
                    setTransferFromSpotToFutures(true)
                    togglePopup(true)
                  }}
                >
                  {/* here should be popup with selector keyId */}
                  Transfer in
                </StyledButton>
                <StyledButton
                  padding=".5rem 1.6rem 0.4rem 1.6rem"
                  borderRadius={'.8rem'}
                  style={{ marginLeft: '1.3rem' }}
                  onClick={() => {
                    setTransferFromSpotToFutures(false)
                    togglePopup(true)
                  }}
                >
                  {/* here should be popup with selector keyId */}
                  Transfer out
                </StyledButton>
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
      <TransferPopup
        open={open}
        theme={theme}
        handleClose={() => togglePopup(false)}
        transferFromSpotToFutures={transferFromSpotToFutures}
        haveSelectedAccount={false}
        showFuturesTransfer={showFuturesTransfer}
        isFuturesWarsKey={false}
        loading={loading}
        setLoading={setLoading}
      />
    </Grid>
  )
}

export default SharePortfolioPanel
