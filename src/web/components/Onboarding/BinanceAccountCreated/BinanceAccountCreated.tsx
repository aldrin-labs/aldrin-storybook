import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import { withTheme } from '@material-ui/styles'

import {
  TypographyCustomHeading,
  GridCustom,
  DialogWrapper,
  DialogTitleCustom,
} from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import SvgIcon from '@sb/components/SvgIcon'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { DialogContent } from '@sb/styles/Dialog.styles'

import CcaiBinanceLogo from '@icons/ccai&binance.svg'
import { IProps } from './BinanceAccountCreated.types'

@withTheme
export default class BinanceAccountCreated extends React.Component<IProps> {
  render() {
    const {
      theme: {
        palette: { black },
      },
      handleClose,
      open,
      completeOnboarding,
      setCurrentStep,
    } = this.props

    return (
      <DialogWrapper
        style={{ borderRadius: '50%' }}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitleCustom
          id="customized-dialog-title"
          onClose={handleClose}
          justify="center"
          style={{
            backgroundColor: '#fff',
          }}
        >
          <SvgIcon src={CcaiBinanceLogo} width="50%" height="auto" />
          {/* <TypographyCustomHeading
            fontWeight={'700'}
            borderRadius={'1rem'}
            color={black.custom}
            style={{
              textAlign: 'center',
              textTransform: 'uppercase',
            }}
          >
            Your hybrid account created
          </TypographyCustomHeading> */}
        </DialogTitleCustom>
        <DialogContent
          justify="center"
          style={{
            padding: '0 3rem 3rem',
            textAlign: 'center',
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
            Your hybrid account created
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
              btnWidth={'120px'}
              borderRadius={'8px'}
              borderColor={'#ABBAD1'}
              btnColor={'#ABBAD1'}
              margin={'0 3%'}
              padding="0"
              onClick={() => {
                setCurrentStep('binanceAccountCreatedLater')
              }}
            >
              Later
            </BtnCustom>
            <BtnCustom
              btnWidth={'120px'}
              borderRadius={'8px'}
              btnColor={'#165BE0'}
              margin={'0 3%'}
              padding="0"
              onClick={async () => {
                await completeOnboarding()
                this.props.history.push('/profile/deposit')
              }}
            >
              Deposit now
            </BtnCustom>
          </Grid>
        </DialogContent>
      </DialogWrapper>
    )
  }
}
