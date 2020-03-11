import React from 'react'
// import { portfolioMainSteps } from '@sb/config/joyrideSteps'
// import JoyrideOnboarding from '@sb/components/JoyrideOnboarding/JoyrideOnboarding'

import { Grid, Typography } from '@material-ui/core'
import { withTheme } from '@material-ui/styles'

import CubeLogo from '@icons/auth0Logo.png'
import {
  TypographyCustomHeading,
  GridCustom,
  DialogWrapper,
  DialogTitleCustom,
} from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Loading } from '@sb/components/index'

import { IProps, IState } from './Congratulations.types'
import { Logo } from './Congratulations.styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { DialogContent } from '@sb/styles/Dialog.styles'

@withTheme
class Congratulations extends React.Component<IProps, IState> {
  state: IState = {
    loading: false,
  }

  setLoading = (loadArg: boolean) => {
    this.setState({ loading: loadArg })
  }
  render() {
    const {
      theme: {
        palette: { black },
      },
      open,
      completeOnboarding,
    } = this.props

    const { loading } = this.state
    const { setLoading } = this

    return (
      <>
        {/*<JoyrideOnboarding
          steps={portfolioMainSteps}
          open={this.state.openOnboarding}
        />*/}

        <DialogWrapper
          style={{ borderRadius: '50%' }}
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
          <Logo src={CubeLogo} />

          <DialogTitleCustom
            id="customized-dialog-title"
            style={{
              backgroundColor: '#fff',
              justifyContent: 'center',
              padding: '0 2rem 4rem 2rem',
            }}
          >
            <TypographyCustomHeading
              fontWeight={'700'}
              color={black.custom}
              style={{
                fontSize: '2rem',
                textAlign: 'center',
              }}
            >
              CONGRATULATIONS!
            </TypographyCustomHeading>
          </DialogTitleCustom>
          <DialogContent
            style={{
              padding: '0 3rem 3rem',
              textAlign: 'center',
              justifyContent: 'center',
            }}
          >
            <Grid
              container
              justify="center"
              alignItems="center"
              style={{ paddingBottom: '2rem' }}
            >
              <Typography
                style={{
                  color: '#16253D',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  letterSpacing: '0.2px',
                }}
              >
                You have created your first portfolio successfully!
              </Typography>
            </Grid>

            <Grid
              container
              justify="center"
              alignItems="center"
              style={{ paddingBottom: '4rem' }}
            >
              <Typography
                style={{
                  color: '#16253D',
                }}
              >
                Your keys is processing. It may take few minutes. You can drink
                a coffee for now.
              </Typography>
            </Grid>

            <Grid container justify="center" alignItems="center">
              <BtnCustom
                onClick={async () => {
                  setLoading(true)
                  await completeOnboarding()
                  setLoading(false)
                }}
                disabled={loading}
                btnWidth={'50%'}
                borderRadius={'8px'}
                btnColor={'#165BE0'}
                fontSize="1.6rem"
                padding="2rem"
                borderWidth="2px"
              >
                {loading ? (
                  <Loading size={16} style={{ height: '16px' }} />
                ) : (
                  `OK`
                )}
              </BtnCustom>
            </Grid>
          </DialogContent>
        </DialogWrapper>
      </>
    )
  }
}

export default Congratulations
