import React, { useState } from 'react'
import { withSnackbar } from 'notistack'
import { compose } from 'recompose'
import { Grid, Typography, withTheme, Input, Link, Theme } from '@material-ui/core'
import Timer from 'react-compound-timer'
import { Loading } from '@sb/components/index'

import { StyledTypography } from '@sb/compositions/Profile/compositions/DepositWithdrawalComponents/AccountBlock.styles'
import InputAmount from '@sb/compositions/Profile/compositions/DepositWithdrawalComponents/InputAmount'

import {
  CoinOption,
  CoinSingleValue,
} from '@sb/components/ReactSelectComponents/CoinOption'

import {
  AccountOption,
  AccountSingleValue,
} from '@sb/components/ReactSelectComponents/AccountOption'

import {
  TypographyCustomHeading,
  DialogWrapper,
  DialogTitleCustom,
} from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { DialogContent } from '@sb/styles/Dialog.styles'

import {
    useSelectedBaseCurrencyAccount,
    useMarket,
    useSelectedQuoteCurrencyAccount,
  } from '@sb/dexUtils/markets';
  import { useWallet } from '@sb/dexUtils/wallet';

interface IProps {
  open: boolean
  handleClose: () => void
  theme: Theme
  baseOrQuote: 'base' | 'quote'
}

const TransferPopup = ({
  open,
  handleClose,
  enqueueSnackbar,
  theme,
  baseOrQuote,
}: IProps) => {

    const { market, baseCurrency, quoteCurrency } = useMarket();

    const { providerName, providerUrl } = useWallet();
    const baseCurrencyAccount = useSelectedBaseCurrencyAccount();
    const quoteCurrencyAccount = useSelectedQuoteCurrencyAccount();
    let coinMint;
    let account;
    let depositCoin;
    if (baseOrQuote === 'base') {
      coinMint = market?.baseMintAddress;
      account = baseCurrencyAccount;
      depositCoin = baseCurrency;
    } else if (baseOrQuote === 'quote') {
      coinMint = market?.quoteMintAddress;
      account = quoteCurrencyAccount;
      depositCoin = quoteCurrency;
    } else {
      account = null;
    }
    if (!coinMint) {
      return null;
    }

  return (
    <>
      <DialogWrapper
        theme={theme}
        aria-labelledby="customized-dialog-title"
        onClose={handleClose}
        open={open}
        style={{
          borderRadius: '50%',
          paddingTop: 0,
        }}
      >
        <DialogTitleCustom id="customized-dialog-title" theme={theme}>
          <TypographyCustomHeading
            fontWeight={'700'}
            theme={theme}
            style={{
              textAlign: 'center',
              fontSize: '1.4rem',
              letterSpacing: '1.5px',
              color: theme.palette.dark.main,
            }}
          >
            Deposit {depositCoin}
          </TypographyCustomHeading>
        </DialogTitleCustom>
        <DialogContent
          theme={theme}
          justify="center"
          style={{
            padding: '0 3rem 3rem',
          }}
        >
          <Grid>
            <Grid style={{ paddingBottom: '1rem', textAlign: 'center' }}>
                  <Typography
                    style={{
                      paddingBottom: '1.4rem',
                      color: theme.palette.dark.main,
                    }}
                  >
                    Mint address:                   
                  </Typography>
                  <Typography
                    style={{
                      paddingBottom: '1.4rem',
                      color: theme.palette.dark.main,
                    }}
                  >
                      {coinMint.toBase58()}
                  </Typography>
                  <Typography
                    style={{
                      paddingBottom: '1.4rem',
                      color: theme.palette.dark.main,
                    }}
                  >
                    SPL Deposit address:
                  </Typography>
                  <Typography
                    style={{
                      paddingBottom: '1.4rem',
                      color: theme.palette.dark.main,
                    }}
                  >
                    {account ? (
                        account.pubkey.toBase58()
                    ) : (
                    <>
                    Visit{' '}
                        <Link rel="noopener noreferrer" target="_blank" to={providerUrl} href={providerUrl}>
                        {providerName}
                    </Link>{' '}
                    to create an account for this mint
                     </>
                    )}
                  </Typography>
            </Grid>
          </Grid>
        </DialogContent>
      </DialogWrapper>
    </>
  )
}

export default compose(
  withSnackbar,
  withTheme(),
)(TransferPopup)
