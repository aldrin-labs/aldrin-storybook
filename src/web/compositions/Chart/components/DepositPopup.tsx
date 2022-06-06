import { Grid, Typography, Link } from '@material-ui/core'
import copy from 'clipboard-copy'
import { withSnackbar } from 'notistack'
import React from 'react'
import { compose } from 'recompose'
import { useTheme } from 'styled-components'

import {
  TypographyCustomHeading,
  DialogWrapper,
  DialogTitleCustom,
} from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import SvgIcon from '@sb/components/SvgIcon'
import {
  useSelectedBaseCurrencyAccount,
  useMarket,
  useSelectedQuoteCurrencyAccount,
} from '@sb/dexUtils/markets'
import { useWallet } from '@sb/dexUtils/wallet'
import { DialogContent } from '@sb/styles/Dialog.styles'

import copyIcon from '@icons/copySerum.svg'

interface IProps {
  open: boolean
  handleClose: () => void
  baseOrQuote: 'base' | 'quote'
}

const TransferPopup = ({
  open,
  handleClose,
  enqueueSnackbar,
  baseOrQuote,
}: IProps) => {
  const { market, baseCurrency, quoteCurrency } = useMarket()
  const theme = useTheme()
  const { providerName, providerUrl } = useWallet()
  const baseCurrencyAccount = useSelectedBaseCurrencyAccount()
  const quoteCurrencyAccount = useSelectedQuoteCurrencyAccount()
  let coinMint
  let account
  let depositCoin

  if (baseOrQuote === 'base') {
    coinMint = market?.baseMintAddress
    account = baseCurrencyAccount
    depositCoin = baseCurrency
  } else if (baseOrQuote === 'quote') {
    coinMint = market?.quoteMintAddress
    account = quoteCurrencyAccount
    depositCoin = quoteCurrency
  } else {
    account = null
  }
  if (!coinMint) {
    return null
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
        <DialogTitleCustom id="customized-dialog-title">
          <TypographyCustomHeading
            fontWeight="700"
            style={{
              textAlign: 'left',
              fontSize: '1.6rem',
              letterSpacing: '1.5px',
              color: theme.colors.gray1,
            }}
          >
            Deposit {depositCoin}
          </TypographyCustomHeading>
        </DialogTitleCustom>
        <DialogContent
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
                Mint address (Don't send funds to this address):
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
                  style={{
                    cursor: 'pointer',
                    marginLeft: '0.5rem',
                    fill: '#71E0EC',
                  }}
                  onClick={() => {
                    enqueueSnackbar('Copied!', {
                      variant: 'success',
                    })
                    copyMintAddress()
                    setIsRemindToStakePopupOpen(true)
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
                  color: account ? theme.colors.blue5 : theme.colors.gray1,
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
                      style={{
                        cursor: 'pointer',
                        marginLeft: '0.5rem',
                        fill: '#71E0EC',
                      }}
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
                    <Link
                      style={{
                        color: theme.colors.gray1,
                        textDecoration: 'none',
                      }}
                      rel="noopener noreferrer"
                      target="_blank"
                      to={providerUrl}
                      href={providerUrl}
                    >
                      <span style={{ color: theme.colors.blue5 }}>
                        {providerName}
                      </span>
                    </Link>{' '}
                    to create an account for this mint
                  </>
                )}
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>{' '}
      </DialogWrapper>
    </>
  )
}

export default compose(withSnackbar)(TransferPopup)
