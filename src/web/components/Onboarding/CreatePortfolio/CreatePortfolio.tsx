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
import AddAccountDialog from '../AddAccountDialog/AddAccountDialog'

import { getMyPortfoliosQuery } from '@core/graphql/queries/portfolio/getMyPortfoliosQuery'
import { portfolioKeyAndWalletsQuery } from '@core/graphql/queries/portfolio/portfolioKeyAndWalletsQuery'
import { createPortfolioMutation } from '@core/graphql/mutations/user/createPortfolioMutation'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { IProps, IState } from './CreatePortfolio.types'

const formikDialog = withFormik({
  validationSchema: Yup.object().shape({
    portfolioName: Yup.string().required(),
  }),
  mapPropsToValues: () => ({
    portfolioName: '',
  }),
  handleSubmit: async ({ portfolioName }, props) => {
    const { createPortfolio } = props.props
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
      openAddAccountDialog: true,
    })
  }

  handleClose = () => {
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
      open,
    } = this.props

    return (
      <>
        <AddAccountDialog
          open={this.state.openAddAccountDialog}
          handleClickOpen={this.handleClickOpen}
          handleClose={this.handleClose}
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

            <Grid container justify="flex-end" alignItems="center">
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
                    await handleSubmit()

                    if(values.portfolioName !== '') {
                      this.handleClickOpen()
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
    )
  }
}

export default compose(
  graphql(createPortfolioMutation, {
    name: 'createPortfolio',
    options: {
      refetchQueries: [{ query: getMyPortfoliosQuery }],
    },
  }),
  formikDialog
)(CreatePortfolio)
