import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import { withStyles, withTheme } from '@material-ui/styles'
import MuiDialogContent from '@material-ui/core/DialogContent'

import CcaiBinanceLogo from '@icons/ccai&binance.svg'
import {
  GridCustom,
  DialogWrapper,
  DialogTitleCustom,
} from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import SvgIcon from '@sb/components/SvgIcon'

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
          <GridCustom
            container
            direction={'column'}
            alignItems={'center'}
            justify={'center'}
          >
            <SvgIcon src={CcaiBinanceLogo} width="50%" height="auto" />
          </GridCustom>{' '}
        </DialogTitleCustom>
        <DialogContent
          justify="center"
          style={{
            padding: '0 3rem 3rem',
            textAlign: 'center',
          }}
        >
          <Grid style={{ width: '440px' }}>
            <Grid>
              <Typography
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  paddingTop: '15px',
                }}
              >
                When you’ll be ready go
              </Typography>
            </Grid>
            <Grid style={{ marginBottom: '2rem'}}>
              <Typography
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  paddingTop: '0.5rem',
                  color: '#16253D',
                }}
              >
                profile > Hybrid account > Deposit/withdrawal
              </Typography>
            </Grid>
          </Grid>

          <Grid container justify="center" alignItems="center">
            <BtnCustom
              btnWidth={'85px'}
              borderRadius={'8px'}
              btnColor={'#165BE0'}
              onClick={async () => {
                await completeOnboarding()
              }}
            >
              ok
            </BtnCustom>
          </Grid>
        </DialogContent>
      </DialogWrapper>
    )
  }
}
