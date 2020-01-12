import React from 'react'

import { Grid, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
import MuiDialogContent from '@material-ui/core/DialogContent'
import CubeLogo from '@icons/auth0Logo.png'

import { withTheme } from '@material-ui/styles'

import {
  TypographyCustomHeading,
  GridCustom,
  DialogWrapper,
  DialogTitleCustom,
} from '@sb/components/AddAccountDialog/AddAccountDialog.styles'

import { IProps, IState } from './PopupStart.types'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'

const DialogContent = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
}))(MuiDialogContent)

@withTheme
class PopupStart extends React.Component<IProps, IState> {
  state: IState = {
    isSelected: true,
    portfolioName: '',
  }

  render() {
    const { open, setCurrentStep, theme } = this.props

    return (
      <>
        <DialogWrapper
          aria-labelledby="customized-dialog-title"
          open={open}
          style={{
            borderRadius: '50%',
            paddingTop: 0,
          }}
        >
          <DialogTitleCustom
            id="customized-dialog-title"
            style={{
              backgroundColor: theme.palette.background.default,
            }}
          >
            <img
              src={CubeLogo}
              style={{
                display: 'block',
                margin: '0 auto',
                width: '15rem',
                marginTop: '1.5rem',
                marginBottom: '1.5rem',
              }}
            />

            <TypographyCustomHeading
              fontWeight={'700'}
              borderRadius={'1rem'}
              style={{
                textAlign: 'center',
                fontSize: '1.4rem',
                letterSpacing: '1.5px',
                color: '#16253D',
              }}
            >
              Welcome to Cryptocurrencies.Ai
            </TypographyCustomHeading>
          </DialogTitleCustom>
          <DialogContent
            justify="center"
            style={{
              padding: '0 3rem 3rem',
            }}
          >
            <Grid>
              <GridCustom>
                <Typography
                  style={{
                    maxWidth: '26rem',
                    width: '100%',
                    margin: '0 auto',
                    color: '#7284A0',
                    fontSize: '1.3rem',
                    lineHeight: '1.3rem',
                  }}
                >
                  First, you need to create a portfolio (there may be more than
                  one!) and connect your exchange accounts to it. After that we
                  suggest you to get acquainted with our features.
                </Typography>
              </GridCustom>
              <GridCustom>
                <Typography
                  style={{
                    fontSize: '1.2rem',
                    lineHeight: '1.2rem',
                    textAlign: 'center',
                    color: '#16253D',
                  }}
                >
                  Let’s create your first portfolio!
                </Typography>
              </GridCustom>
            </Grid>

            <Grid container justify="flex-center" alignItems="center">
              <BtnCustom
                backgroundColor="white"
                onClick={() => {
                  setCurrentStep('addAccount')
                }}
                style={{
                  maxWidth: '15rem',
                  width: '100%',
                  height: '100%',
                  border: '2px solid #0B1FD1',
                  borderRadius: '.8rem',
                  padding: '.4rem 1rem',
                  color: '#0B1FD1',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  fontSize: '1.2rem',
                  letterSpacing: '1.5px',
                  margin: '0 auto',
                }}
              >
                GET STARTED
              </BtnCustom>
            </Grid>
          </DialogContent>
        </DialogWrapper>
      </>
    )
  }
}

export default PopupStart
