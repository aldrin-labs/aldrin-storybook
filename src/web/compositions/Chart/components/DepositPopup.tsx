import React, { useState } from 'react'
import { withSnackbar } from 'notistack'
import { compose } from 'recompose'
import copy from 'clipboard-copy'
import { Grid, Typography, withTheme, Input, Link, Theme } from '@material-ui/core'
import Timer from 'react-compound-timer'
import { Loading } from '@sb/components/index'

import copyIcon from '@icons/copy.svg'
import SvgIcon from '@sb/components/SvgIcon'

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

    const copyMintAddress = () => {
      copy(coinMint?.toBase58())
    }

    const copySPLAddress = () => {
      copy(account?.pubkey?.toBase58())
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
        PaperProps={{
          style: {
            minWidth: '480px',
          },
        }}
      >
        <DialogTitleCustom id="customized-dialog-title" theme={theme}>
          <TypographyCustomHeading
            fontWeight={'700'}
            theme={theme}
            style={{
              textAlign: 'left',
              fontSize: '1.6rem',
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
            padding: '5rem',
          }}
        >
          <Grid>
            <Grid style={{ paddingBottom: '0', textAlign: 'left' }}>
                  <Typography
                    style={{
                      textTransform: 'uppercase',
                      color: '#818AA6',
                      fontWeight: 'bold',
                      fontSize: '1.6rem',
                      letterSpacing: '1px',
                      paddingBottom: '1rem',
                    }}
                  >
                    Mint address:                   
                  </Typography>
                  <Typography
                    style={{
                        color: '#71E0EC',
                        fontWeight: 'bold',
                        fontSize: '1.6rem',
                        paddingBottom: '4.4rem',
                        letterSpacing: '1px',
                    }}
                  >
                      {coinMint.toBase58()}
                        <SvgIcon
                          src={copyIcon}
                          width="11px"
                          height="auto"
                          style={{ cursor: 'pointer', marginLeft: '0.5rem', fill: '#71E0EC' }}
                          onClick={() => {
                            enqueueSnackbar('Copied!', {
                              variant: 'success',
                            })
                            copyMintAddress()
                          }}
                        />
                  </Typography>
                  <Typography
                    style={{
                      textTransform: 'uppercase',
                      color: '#818AA6',
                      fontWeight: 'bold',
                      fontSize: '1.6rem',
                      letterSpacing: '1px',
                      paddingBottom: '1rem',
                    }}
                  >
                    SPL Deposit address:
                  </Typography>
                  <Typography
                    style={{
                      color: account ? '#71E0EC' : theme.palette.type === 'light' ? '' : '#fff',
                      fontWeight: 'bold',
                      fontSize: '1.6rem',
                      letterSpacing: '1px',
                  }}
                  >
                    {account ? (
                        <>
                        {account.pubkey.toBase58()}
                        <SvgIcon
                          src={copyIcon}
                          width="11px"
                          height="auto"
                          style={{ cursor: 'pointer', marginLeft: '0.5rem', fill: '#71E0EC' }}
                          onClick={() => {
                            enqueueSnackbar('Copied!', {
                              variant: 'success',
                            })
                            copySPLAddress()
                          }}
                        />
                        </>
                    ) : (
                    <>
                    Visit{' '}
                    <Link style={{ color: '#71E0EC', textDecoration: 'none' }} rel="noopener noreferrer" target="_blank" to={providerUrl} href={providerUrl}>
                        <span style={{ color: '#71E0EC' }}>
                          {providerName}
                        </span>  
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
