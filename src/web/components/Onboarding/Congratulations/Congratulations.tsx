import React from 'react'
// import { portfolioMainSteps } from '@sb/config/joyrideSteps'
// import JoyrideOnboarding from '@sb/components/JoyrideOnboarding/JoyrideOnboarding'

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

import { IProps, IState } from './Congratulations.types'
import { Logo } from './Congratulations.styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'

const DialogContent = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
}))(MuiDialogContent)

@withTheme()
class Congratulations extends React.Component<IProps, IState> {
  state: IState = {
    key: 0,
    isSelected: true,
    loading: true,
    portfolioName: '',
  }

  componentDidMount() {
    setTimeout(() => this.setState({ loading: false }), 2000)
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

    const { loading } = this.state

    return (
      <>
        {/*<JoyrideOnboarding
          steps={portfolioMainSteps}
          open={this.state.openOnboarding}
        />*/}

        <DialogWrapper
          style={{ borderRadius: '50%' }}
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <Logo src={CubeLogo} />

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
              }}
            >
              CONGRATULATIONS!
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
                    color: '#16253D',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    letterSpacing: '0.2px',
                  }}
                >
                  You have created your first portfolio successfully!
                </Typography>
              </GridCustom>
            </Grid>

            <Grid style={{ width: '440px' }}>
              <GridCustom>
                {!loading ? (
                  <Typography
                    style={{
                      fontSize: '17px',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      paddingTop: '15px',
                      color: '#16253D',
                    }}
                  >
                    Now let us show you our platform
                  </Typography>
                ) : (
                  <Typography
                    style={{
                      color: '#16253D',
                    }}
                  >
                    Your keys is processing. It may take few minutes. You can
                    drink a coffee for now.
                  </Typography>
                )}
              </GridCustom>
            </Grid>

            <Grid container justify="flex-end" alignItems="center">
              {!loading ? (
                <BtnCustom
                  borderRadius={'16px'}
                  onClick={async (e) => {
                    e.preventDefault()
                    await completeOnboarding()
                  }}
                  style={{
                    maxWidth: '133px',
                    background: 'rgb(41, 172, 128)',
                    color: 'rgb(255, 255, 255)',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    letterSpacing: '1.5px',
                    border: '0',
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    padding: '18px 0',
                    borderRadius: '7px',
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    margin: '0px auto',
                    boxShadow: '0px 4px 8px rgba(41, 172, 128, 0.54)',
                  }}
                >
                  GO
                </BtnCustom>
              ) : (
                ''
              )}
            </Grid>
          </DialogContent>
        </DialogWrapper>
      </>
    )
  }
}

export default Congratulations
