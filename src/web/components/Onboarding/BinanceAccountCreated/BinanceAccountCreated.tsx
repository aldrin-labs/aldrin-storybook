import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import { withTheme } from '@material-ui/styles'

import {
  TypographyCustomHeading,
  GridCustom,
  DialogWrapper,
  DialogTitleCustom,
} from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Loading } from '@sb/components/index'
import SvgIcon from '@sb/components/SvgIcon'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { DialogContent } from '@sb/styles/Dialog.styles'

import CcaiBinanceLogo from '@icons/ccai&binance.svg'
import { IProps } from './BinanceAccountCreated.types'

@withTheme
export default class BinanceAccountCreated extends React.Component<IProps> {
  state = {
    loading: false,
    loadingLater: false,
  }

  setLoading = (loadArg: boolean) => {
    this.setState({ loading: loadArg })
  }

  setLoadingLater = (loadArg: boolean) => {
    this.setState({ loadingLater: loadArg })
  }

  render() {
    const {
      theme: {
        palette: { black },
      },
      handleClose,
      open,
      completeOnboarding,
    } = this.props

    const { loading, loadingLater } = this.state
    const { setLoading, setLoadingLater } = this

    return (
      <DialogWrapper
        style={{ borderRadius: '50%' }}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        TransitionProps={{
          style: {
            backgroundColor: '#16253D',
          },
        }}
        transitionDuration={{
          enter: 0,
          exit: 3000,
        }}
      >
        <DialogTitleCustom
          id="customized-dialog-title"
          style={{
            backgroundColor: '#fff',
            justifyContent: 'center',
          }}
        >
          <SvgIcon src={CcaiBinanceLogo} width="50%" height="auto" />
        </DialogTitleCustom>
        <DialogContent
          style={{
            padding: '0 3rem 3rem',
            textAlign: 'center',
            justifyContent: 'center',
          }}
        >
          <Grid style={{ width: '440px' }}>
            <GridCustom>
              <TypographyCustomHeading
                fontWeight={'700'}
                borderRadius={'1rem'}
                color={black.custom}
                style={{
                  fontSize: '1.7rem',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  paddingBottom: '2rem',
                }}
              >
                Your broker account created
              </TypographyCustomHeading>

              <Typography
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  padding: '15px',
                }}
              >
                Do you want to deposit funds and start trading now?
              </Typography>
            </GridCustom>
          </Grid>

          <Grid container justify="center" alignItems="center">
            <BtnCustom
              disabled={loadingLater}
              btnWidth={'120px'}
              borderRadius={'8px'}
              borderColor={'#ABBAD1'}
              btnColor={'#ABBAD1'}
              margin={'0 3%'}
              padding="0"
              onClick={async () => {
                setLoadingLater(true)
                await completeOnboarding()
                setLoadingLater(false)
              }}
            >
              {loadingLater ? (
                <Loading size={16} style={{ height: '16px' }} />
              ) : (
                `Later`
              )}
            </BtnCustom>
            <BtnCustom
              disabled={loading}
              btnWidth={'120px'}
              borderRadius={'8px'}
              btnColor={'#165BE0'}
              margin={'0 3%'}
              padding="0"
              onClick={async () => {
                setLoading(true)
                await completeOnboarding()
                this.props.history.push('/profile/deposit')
                setLoading(false)
              }}
            >
              {loading ? (
                <Loading size={16} style={{ height: '16px' }} />
              ) : (
                `Deposit now`
              )}
            </BtnCustom>
          </Grid>
        </DialogContent>
      </DialogWrapper>
    )
  }
}
