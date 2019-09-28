import React from 'react'

import { withFormik } from 'formik'
import Yup from 'yup'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'

import { Grid, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
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
import { createPortfolioMutation } from '@core/graphql/mutations/user/createPortfolioMutation'

import { IProps, IState } from './PopupStart.types'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import CreatePortfolio from '@sb/components/CreatePortfolio/CreatePortfolio'

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
class PopupStart extends React.Component<IProps, IState> {
  state: IState = {
    openCreatePortfolio: false,
    openAddAccountDialog: false,
    isSelected: true,

    portfolioName: '',
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

 handleClickOpenAccount = () => {
    this.setState({ openAddAccountDialog: true })
  }

 handleCloseAccount = () => {
    this.setState({ openAddAccountDialog: false })
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
      setOnboarding,
      activeKeys,
      open,
      portfolioId,
      baseCoin,
    } = this.props

    console.log('PopupStart', portfolioId)

    return (
      <>
        <CreatePortfolio
          open={this.state.openCreatePortfolio}
          handleClickOpen={this.handleClickOpen}
          handleClose={this.handleClose}

          openAddAccountDialog={this.state.openAddAccountDialog}
          handleClickOpenAccount={this.handleClickOpenAccount}
          handleCloseAccount={this.handleCloseAccount}

          onboarding={true}
          portfolioId={portfolioId}
          baseCoin={baseCoin}
        />

        <DialogWrapper
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
          style={{
            borderRadius: '50%',
          }}
        >
          <DialogTitleCustom
            id="customized-dialog-title"
            onClose={handleClose}
            style={{
              backgroundColor: '#fff'
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
              Hi! Nice to met you!
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
                  First, you need to create a portfolio (there may be more than one!) and connect your exchange accounts to it. After that we suggest you to get acquainted with our features.
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
              {/*<BtnCustom
                btnWidth={'143px'}
                borderRadius={'16px'}
                btnColor={blue.custom}
                onClick={(e) => {
                  e.preventDefault()

                  handleClose()
                }}
              >
                GET STARTED
              </BtnCustom>*/}

              <BtnCustom
                backgroundColor="white"
                onClick={() => {
                  this.handleClickOpen()
                  handleClose()
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
