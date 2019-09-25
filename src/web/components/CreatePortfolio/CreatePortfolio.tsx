import React from 'react'

import { withFormik } from 'formik'
import Yup from 'yup'
import { compose } from 'recompose'
import { graphql, Query } from 'react-apollo'
import { client } from '@core/graphql/apolloClient'

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
import AddAccountDialog from '@sb/components/AddAccountDialog/AddAccountDialog'

import { GET_BASE_COIN } from '@core/graphql/queries/portfolio/getBaseCoin'
import QueryRenderer, { queryRendererHoc } from '@core/components/QueryRenderer'
import { getMyPortfoliosQuery } from '@core/graphql/queries/portfolio/getMyPortfoliosQuery'
import { portfolioKeyAndWalletsQuery } from '@core/graphql/queries/portfolio/portfolioKeyAndWalletsQuery'
import { createPortfolioMutation } from '@core/graphql/mutations/user/createPortfolioMutation'
import { renamePortfolio } from '@core/graphql/mutations/portfolio/renamePortfolio'
import { updatePortfolioSettingsMutation } from '@core/graphql/mutations/portfolio/updatePortfolioSettingsMutation'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { IProps, IState } from './CreatePortfolio.types'
import { portfolioMainSteps } from '@sb/config/joyrideSteps'
import JoyrideOnboarding from '../Onboarding/JoyrideOnboarding/JoyrideOnboarding'

const formikDialog = withFormik({
  validationSchema: Yup.object().shape({
    portfolioName: Yup.string().required(),
  }),
  mapPropsToValues: () => ({
    portfolioName: '',
  }),
  handleSubmit: async ({ portfolioName }, props) => {
    const { createPortfolio, renamePortfolio, onboarding, portfolioId } = props.props

    if(onboarding !== undefined && onboarding) {

      const variablesRename = {
        inputPortfolio: {
          id: portfolioId,
          name: portfolioName,
        },
      }

      try {
        props.setSubmitting(true)

        const res = await renamePortfolio({
          variables: variablesRename,
        })

        console.log('renamePortfolio res - ', res)

        props.resetForm({})
      } catch (error) {
        console.error(error)
        props.setFieldError('portfolioName', 'Request error!')
        props.setSubmitting(false)
      }
    } else {
      const variables = {
        inputPortfolio: {
          name: portfolioName,
        },
      }

      try {
        props.setSubmitting(true)

        await createPortfolio({
          variables,
        })

        props.resetForm({})
      } catch (error) {
        console.error(error)
        props.setFieldError('portfolioName', 'Request error!')
        props.setSubmitting(false)
      }
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
class CreatePortfolio extends React.Component<IProps, IState> {
  state: IState = {
    open: false,
    openOnboarding: false,
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
      open: true,
    })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  handleShowOnboarding = () => {
    this.setState({ openOnboarding: true })
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
      onboarding,
      openAddAccountDialog,
      handleClickOpenAccount,
      handleCloseAccount,
      open,
      handleClickOpen,
      handleClose,
      portfolioId,
      baseCoin,
    } = this.props

    return (
      onboarding !== undefined && onboarding
        ?
          <>
            <JoyrideOnboarding
              steps={portfolioMainSteps}
              open={this.state.openOnboarding}
            />

            <AddAccountDialog
              open={openAddAccountDialog}
              handleClickOpen={handleClickOpenAccount}
              handleClose={handleCloseAccount}
              onboarding={true}
              baseCoin={baseCoin}
            />

            <DialogWrapper
              style={{ borderRadius: '50%' }}
              onClose={handleClose}
              aria-labelledby="customized-dialog-title"
              open={open}

            >
              <DialogTitleCustom
                id="customized-dialog-title"
                onClose={handleClose}
                style={{
                  background: '#fff',
                  paddingBottom: '8px',
                }}
              >
                <Typography
                  style={{
                    fontFamily: 'DM Sans',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    lineHeight: '24px',
                    letterSpacing: '1px',
                    paddingBottom: '10px',
                    color: black.custom,
                  }}
                >
                  STEP 1/2
                </Typography>
                <TypographyCustomHeading
                  fontWeight={'700'}
                  borderRadius={'1rem'}
                  color={black.custom}
                  textTransform={'uppercase'}
                  style={{
                    fontSize: '20px',
                    letterSpacing: '1.5px',
                    textAlign: 'center',
                  }}
                >
                  Set your portfolio name
                </TypographyCustomHeading>
              </DialogTitleCustom>

              <DialogContent
                justify="center"
                style={{
                  padding: '0 3rem 3rem',
                }}
              >
                <Grid style={{ width: '440px' }}>
                  <GridCustom>
                    {/*<Legend>Portfolio name</Legend>*/}
                    <InputBaseCustom
                      placeholder="Type name..."
                      name="portfolioName"
                      onChange={handleChange}
                      value={values.portfolioName}
                      error={errors && !!errors.portfolioName}
                      style={{
                        border: '1px solid #E0E5EC',
                        boxSizing: 'border-box',
                        boxShadow: 'rgba(0, 0, 0, 0.11) 0px 1px 2px inset',
                      }}
                    />

                    <Typography color="error">{errors.portfolioName}</Typography>
                  </GridCustom>
                </Grid>

                <Grid container justify="space-between" alignItems="center">
                  <div
                    onClick={() => {
                      this.handleShowOnboarding()
                      handleClose()
                    }}
                    style={{
                      color: '#7284A0',
                      fontFamily: 'DM Sans',
                      fontWeight: 400,
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    Create portfolio later
                  </div>
                  <BtnCustom
                    style={{
                      maxWidth: '152px',
                      width: '100%',
                      height: '100%',
                      border: '2px solid #0B1FD1',
                      borderRadius: '16px',
                      padding: '7px 47px',
                      color: '#0B1FD1',
                      textTransform: 'uppercase',
                      textAlign: 'center',
                      fontSize: '14px',
                      letterSpacing: '1.5px',
                    }}
                    btnColor={blue.custom}
                    backgroundColor="white"
                    onClick={(e) => {
                      e.preventDefault()

                      validateForm().then(async () => {
                        const res = await handleSubmit()
                        console.log('res',await handleSubmit())

                        if(values.portfolioName !== '') {
                          handleClickOpenAccount()
                          handleClose()
                        }
                      })
                    }}
                  >
                    SAVE
                  </BtnCustom>

                </Grid>
              </DialogContent>
            </DialogWrapper>
          </>
        :
          <>
            <BtnCustom
              btnWidth={'17rem'}
              height={'3.5rem'}
              btnColor={'#16253D'}
              backgroundColor="white"
              borderRadius={'1rem'}
              padding={'0'}
              fontSize={'1.175rem'}
              letterSpacing="1px"
              onClick={this.handleClickOpen}
              style={{
                position: 'absolute',
                left: '50%',
                bottom: '1.5rem',
                transform: 'translateX(-50%)',
                border: '2px solid #E0E5EC',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
              }}
            >
              Create portfolio
            </BtnCustom>
            <DialogWrapper
              style={{ borderRadius: '50%' }}
              onClose={this.handleClose}
              aria-labelledby="customized-dialog-title"
              open={this.state.open}
            >
              <DialogTitleCustom
                id="customized-dialog-title"
                onClose={this.handleClose}
              >
                <TypographyCustomHeading
                  fontWeight={'700'}
                  borderRadius={'1rem'}
                  color={black.custom}
                >
                  Create Portfolio
                </TypographyCustomHeading>
              </DialogTitleCustom>
              <DialogContent
                justify="center"
                style={{
                  padding: '0 3rem 3rem',
                }}
              >
                <Grid style={{ width: '440px' }}>
                  <GridCustom>
                    <Legend>Portfolio name</Legend>
                    <InputBaseCustom
                      placeholder=""
                      name="portfolioName"
                      onChange={handleChange}
                      value={values.portfolioName}
                      error={errors && !!errors.portfolioName}
                    />
                    <Typography color="error">{errors.portfolioName}</Typography>
                  </GridCustom>
                </Grid>

                <Grid container justify="flex-end" alignItems="center">
                  <BtnCustom
                    btnWidth={'85px'}
                    borderRadius={'32px'}
                    btnColor={blue.custom}
                    onClick={(e) => {
                      e.preventDefault()

                      validateForm().then(async () => {
                        await handleSubmit()
                        this.handleClose()
                      })
                    }}
                  >
                    CREATE
                  </BtnCustom>
                </Grid>
              </DialogContent>
            </DialogWrapper>
          </>
    )
  }
}


export default compose(
  graphql(createPortfolioMutation, {
    name: 'createPortfolio',
    options: ({ baseCoin }) => ({
      refetchQueries: [
        { query: getMyPortfoliosQuery, variables: { baseCoin } },
      ],
    }),
  }),
  graphql(renamePortfolio, {
    name: 'renamePortfolio',
    options: ({ baseCoin }) => ({
      refetchQueries: [
        { query: getMyPortfoliosQuery, variables: { baseCoin } },
      ],
    }),
  }),
  formikDialog,
)(CreatePortfolio)
