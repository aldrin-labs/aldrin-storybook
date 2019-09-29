import React from 'react'

import { withFormik } from 'formik'
import Yup from 'yup'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
// import { portfolioMainSteps } from '@sb/config/joyrideSteps'
// import JoyrideOnboarding from '@sb/components/JoyrideOnboarding/JoyrideOnboarding'

import { Grid, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import MainLogo from '@icons/Logo.svg'
import CubeLogo from '@icons/auth0Logo.png'

import { withTheme } from '@material-ui/styles'

import {
  TypographyCustomHeading,
  GridCustom,
  InputBaseCustom,
  DialogWrapper,
  DialogTitleCustom,
  Legend,
} from '@sb/components/AddAccountDialog/AddAccountDialog.styles'

import { getMyPortfoliosQuery } from '@core/graphql/queries/portfolio/getMyPortfoliosQuery'
import { portfolioKeyAndWalletsQuery } from '@core/graphql/queries/portfolio/portfolioKeyAndWalletsQuery'

import { IProps, IState } from './Congratulations.types'
import { Logo } from './Congratulations.styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'


const DialogTitle = withStyles((theme) => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.grey[500],
  },
}))((props) => {
  const { children, classes, onClose } = props
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="Close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  )
})

const DialogContent = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
}))(MuiDialogContent)

@withTheme()
class Congratulations extends React.Component<IProps, IState> {
  state: IState = {
    openCreatePortfolio: false,
    openOnboarding: false,
    key: 0,
    isSelected: true,

    portfolioName: '',
  }

  handleOnboardingOpen = () => {
    this.setState({
      openOnboarding: true,
    })
  }

  handleRadioBtn = () => {
    this.setState({
      isSelected: !this.state.isSelected,
    })
  }

  handleClickOpen = () => {
    this.setState({
      openCreatePortfolio: true,
    })
  }

  handleClose = () => {
    this.setState({ openCreatePortfolio: false })
  }

  render() {
    const {
      theme: {
        palette: { blue, black },
      },
      handleChange,
      values,
      handleSubmit,
      errors,
      validateForm,
      handleClickOpen,
      handleClose,
      open,
      loading,
    } = this.props

    console.log('open',open)

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
                  You have created your first portfolio successfully!</Typography>
              </GridCustom>
            </Grid>

            <Grid style={{ width: '440px' }}>
              <GridCustom>
                {
                  loading
                    ?
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
                    :
                      <Typography
                        style={{
                          color: '#16253D',
                        }}
                      >
                        Your keys is processing. It may take few minutes. You can drink a coffee for now.
                      </Typography>
                }

              </GridCustom>
            </Grid>

            <Grid container justify="flex-end" alignItems="center">
              {
                loading
                  ?
                    <BtnCustom
                      borderRadius={'16px'}
                      onClick={(e) => {
                        e.preventDefault()

                        handleClose()

                        // this.handleOnboardingOpen()
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
                  :
                    ''
              }


            </Grid>
          </DialogContent>
        </DialogWrapper>
      </>
    )
  }
}

export default Congratulations
