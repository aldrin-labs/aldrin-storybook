import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import { withStyles, withTheme } from '@material-ui/styles'
import MuiDialogContent from '@material-ui/core/DialogContent'

import {
  TypographyCustomHeading,
  GridCustom,
  DialogWrapper,
  DialogTitleCustom,
} from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import SvgIcon from '@sb/components/SvgIcon'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'

import CcaiBinanceLogo from '@icons/ccai&binance.svg'
import { IProps } from './BinanceAccountCreated.types'

const DialogContent = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
}))(MuiDialogContent)

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
          <TypographyCustomHeading
            fontWeight={'700'}
            borderRadius={'1rem'}
            color={black.custom}
            style={{
              textAlign: 'center',
              textTransform: 'uppercase',
            }}
          >
            Your hybrid account created
          </TypographyCustomHeading>
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
              <Typography
                style={{
                  fontSize: '17px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  paddingTop: '15px',
                }}
              >
                Do you want to deposit funds and start trading now?
              </Typography>
            </GridCustom>
          </Grid>

          <Grid container justify="flex-end" alignItems="center">
            <BtnCustom
              btnWidth={'85px'}
              borderRadius={'32px'}
              btnColor={'#165BE0'}
              onClick={() => {
                setCurrentStep('binanceAccountCreatedLater')
              }}
            >
              Later
            </BtnCustom>
            <BtnCustom
              btnWidth={'85px'}
              borderRadius={'32px'}
              btnColor={'#165BE0'}
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
