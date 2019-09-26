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
import CreatePortfolio from '../CreatePortfolio/CreatePortfolio'

const formikDialog = withFormik({
  validationSchema: Yup.object().shape({
    portfolioName: Yup.string().required(),
  }),
  mapPropsToValues: () => ({
    portfolioName: '',
  }),
  handleSubmit: async ({ portfolioName }, props) => {
    const { CreatePortfolio } = props.props
    const variables = {
      inputPortfolio: {
        name: portfolioName,
      },
    }

    try {
      props.setSubmitting(true)
      await CreatePortfolio({
        variables,
      })
      props.resetForm({})
    } catch (error) {
      console.error(error)
      props.setFieldError('portfolioName', 'Request error!')
      props.setSubmitting(false)
    }
  },
})

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
class Instruction extends React.Component<IProps, IState> {
  state: IState = {
    openCreatePortfolio: false,
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
    } = this.props

    // console.log(this.state)

    return (
      <>
        {/*<CreatePortfolio
          open={this.state.openCreatePortfolio}
          handleClickOpen={this.handleClickOpen}
          handleClose={this.handleClose}
        />*/}

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
              src={'../public/apple-touch-icon.png'}
              style={{
                width: '83px',
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
              Import Keys
            </TypographyCustomHeading>

            <Typography
              style={{
                color: '#4A4A4A',
                fontSize: '24px',
                lineHeight: '31px',
              }}
            >
              Follow these instructions to import your keys from Binance.
            </Typography>
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
                    color: '#4A4A4A',
                    fontSize: '24px',
                    lineHeight: '31px',
                  }}
                >
                  1. Log into your account at https://binance.com

                  2. Navigate to account settings

                  3. Locate the API section and click ‘Enable’

                  4. Copy keys
                </Typography>
              </GridCustom>
            </Grid>

            <Grid container justify="flex-center" alignItems="center">
              <BtnCustom
                backgroundColor="white"
                onClick={() => {
                  this.handleClickOpen()
                  handleClose()
                }}
                style={{
                  maxWidth: '225px',
                  width: '100%',
                  height: '100%',
                  border: '2px solid #E0E5EC',
                  borderRadius: '16px',
                  padding: '8px 47px',
                  color: '#16253D',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  letterSpacing: '1.5px',
                  margin: '0 auto',
                }}
              >
                OK
              </BtnCustom>
            </Grid>
          </DialogContent>
        </DialogWrapper>
      </>
    )
  }
}

export default Instruction
