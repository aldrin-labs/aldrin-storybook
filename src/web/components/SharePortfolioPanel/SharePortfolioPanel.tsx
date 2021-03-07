import React, { useState } from 'react'
import { Grid } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import SvgIcon from '@sb/components/SvgIcon'
import ArrowBottom from '@icons/arrowBottom.svg'
import {
  TypographyHeading,
  StyledButton,
  StyledLink,
} from './SharePortfolioPanel.style'
import SelectPortfolioPeriod from '@sb/components/SelectPortfolioPeriod'
import PortfolioSelector from '../../compositions/Chart/Inputs/PortfolioSelector/index'
import TransferPopup from '@sb/compositions/Chart/components/TransferPopup'
import Dropdown from '@sb/components/Dropdown'
import { IProps } from './SharePortfolio.types'
import { MASTER_BUILD } from '@core/utils/config'

import PillowButton from '@sb/components/SwitchOnOff/PillowButton'
import { StyledInputLabel } from '@sb/compositions/Optimization/Import/Import.styles'
import { pink } from '@material-ui/core/colors'

const SharePortfolioPanel = ({
  portfolioName,
  onToggleUSDBTC,
  isUSDCurrently,
  isSPOTCurrently,
  setPageType,
  choosePeriod,
  theme,
  pathname,
  logout,
}) => {
  const selectStyles = (theme: Theme) => ({
    height: '100%',
    // background: theme.palette.white.background,
    marginRight: '.8rem',
    cursor: 'pointer',
    padding: 0,
    border: 'none',
    // backgroundColor: theme.palette.white.background,
    // border: theme.palette.border.main,
    // borderRadius: '0.75rem',
    // boxShadow: '0px 0px 1.2rem rgba(8, 22, 58, 0.1)',
    width: '5%',
    '& div': {
      cursor: 'pointer',
      // color: theme.palette.text.grey,
      textTransform: 'capitalize',
      fontSize: '1.4rem',
    },
    '& svg': {
      color: theme.palette.grey.light,
    },
    '.custom-select-box__control': {
      padding: '0 .75rem',
    },
    '.custom-select-box__menu': {
      minWidth: '130px',
      marginTop: '0',
      borderRadius: '0',
      boxShadow: '0px 4px 8px rgba(10,19,43,0.1)',
    },
  })

  const [loading, setLoading] = useState(false)
  const [open, togglePopup] = useState(false)
  const [transferFromSpotToFutures, setTransferFromSpotToFutures] = useState(
    false
  )
  const { enqueueSnackbar } = useSnackbar()
  const marketType = isSPOTCurrently ? 0 : 1

  return (
    <Grid
      container
      justify="space-between"
      alignItems="center"
      style={{
        padding: '3rem 24px',
        height: '45%',
        background: '#F9FBFD',
      }}
    >
      <Grid item>
        <Grid container justify="flex-start" alignItems="center">
          <Grid
            item
            style={{
              marginRight: '1rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <TypographyHeading textColor={theme.palette.black.registration}>
              {portfolioName}
            </TypographyHeading>
            {/* <SvgIcon src={ArrowBottom} width={'14px'} /> */}
            {/* <PortfolioSelector
              isChartPage={false}
              selectStyles={selectStyles(theme)}
              theme={theme}
              marketType={marketType}
              style={{ width: '20%', minWidth: '0', marginLeft: '.8rem' }}
              id={'portfolioSelector'}
              value={'portfolio'}
            /> */}
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

          <Grid item style={{ display: 'flex', position: 'relative' }}>
            {!isSPOTCurrently && (
              <Grid
                style={{
                  width: '25rem',
                  color: '#7284A0',
                  letterSpacing: '0.05rem',
                  fontSize: '1rem',
                  fontFamily: 'Avenir Next Demi',
                  position: 'absolute',
                  top: '0',
                  right: '-1rem',
                  transform: 'translateY(-150%)',
                }}
              >
                Transfer between your spot and futures accounts
              </Grid>
            )}

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
        isFuturesWarsKey={false}
        loading={loading}
        setLoading={setLoading}
      />
    </Grid>
  )
}

export default SharePortfolioPanel
