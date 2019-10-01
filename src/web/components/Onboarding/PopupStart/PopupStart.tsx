import React from 'react'

import { Grid, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
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

@withTheme()
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
          // onClose={() => handleClose('instructions')}
          aria-labelledby="customized-dialog-title"
          open={open}
          style={{
            borderRadius: '50%',
          }}
        >
          <DialogTitleCustom
            id="customized-dialog-title"
            // onClose={() => handleClose('instructions')}
            style={{
              backgroundColor: theme.palette.background.default,
            }}
          >
            <img
              src={CubeLogo}
              style={{
                display: 'block',
                margin: '0 auto',
                marginTop: '30px',
                marginBottom: '30px',
              }}
            />

            <TypographyCustomHeading
              fontWeight={'700'}
              borderRadius={'1rem'}
              style={{
                textAlign: 'center',
                fontSize: '28px',
                letterSpacing: '1.5px',
                color: '#16253D',
              }}
            >
              Hi! Nice to meet you!
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
                    maxWidth: '466px',
                    width: '100%',
                    margin: '0 auto',
                    color: '#7284A0',
                    fontSize: '24px',
                    lineHeight: '31px',
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
                    fontSize: '24px',
                    lineHeight: '31px',
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
                  setCurrentStep('createPortfolio')
                }}
                style={{
                  maxWidth: '275px',
                  width: '100%',
                  height: '100%',
                  border: '2px solid #0B1FD1',
                  borderRadius: '16px',
                  padding: '8px 47px',
                  color: '#0B1FD1',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  fontSize: '24px',
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
