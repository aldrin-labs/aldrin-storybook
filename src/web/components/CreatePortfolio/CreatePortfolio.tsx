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
import JoyrideOnboarding from '@sb/components/JoyrideOnboarding/JoyrideOnboarding'
import Steps from '@sb/components/Onboarding/Steps/Steps'

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

    const onboardingOk = onboarding !== undefined && onboarding

    return (
        <>
          {
            onboardingOk
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
                </>
              :
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
          }


          <DialogWrapper
            style={{ borderRadius: '50%' }}
            onClose={() => {
              if(onboardingOk) {
                handleClose()
              } else {
                this.handleClose()
              }
            }}
            open={onboardingOk ? open : this.state.open}
            aria-labelledby="customized-dialog-title"
          >
            <DialogTitleCustom
              id="customized-dialog-title"
              onClose={() => {
                if(onboardingOk) {
                  handleClose()
                } else {
                  this.handleClose()
                }
              }}
            >
              <TypographyCustomHeading
                fontWeight={'700'}
                borderRadius={'1rem'}
                color={black.custom}
              >
                { onboardingOk
                  ?
                    <>Set your portfolio name - <Steps current={1} /></>
                  :
                    'Create Portfolio'
                }
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

                      if(values.portfolioName !== '') {
                        if(onboardingOk) {
                          handleClickOpenAccount()
                          handleClose()
                        } else {
                          this.handleClose()
                        }
                      }
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
