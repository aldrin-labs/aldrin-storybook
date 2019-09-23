import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'

import { withTheme } from '@material-ui/styles'

import { Grid } from '@material-ui/core'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import {
  TypographyCustomHeading,
  GridCustom,
  InputBaseCustom,
  DialogWrapper,
  DialogTitleCustom,
  Legend,
  LinkCustom,
} from './AddAccountDialog.styles'

import SvgIcon from '@sb/components/SvgIcon'
import Plus from '@icons/Plus.svg'

import { withFormik } from 'formik'
import Yup from 'yup'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'

import { keysNames } from '@core/graphql/queries/chart/keysNames'
import { getKeysQuery } from '@core/graphql/queries/user/getKeysQuery'
import { addExchangeKeyMutation } from '@core/graphql/mutations/user/addExchangeKeyMutation'

import SelectExchangeList from '@sb/components/SelectExchangeList/SelectExchangeList'
import { handleSelectChangePrepareForFormik } from '@core/utils/UserUtils'
import { portfolioKeyAndWalletsQuery } from '@core/graphql/queries/portfolio/portfolioKeyAndWalletsQuery'
import Congratulations from '../Congratulations/Congratulations'
import Instruction from './Instruction/Instruction'

const MIN_CHAR = 3

const FormError = ({ children }: any) => (
  <Typography color="error">{children}</Typography>
)

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    name: Yup.string()
      .required()
      .min(MIN_CHAR)
      .trim(),
    apiKey: Yup.string()
      .required()
      .min(MIN_CHAR)
      .trim(),
    secretOfApiKey: Yup.string()
      .required()
      .min(MIN_CHAR)
      .trim(),
    exchange: Yup.string()
      .required()
      .min(MIN_CHAR)
      .trim(),
  }),
  mapPropsToValues: (props: any) => ({
    name: '',
    apiKey: '',
    secretOfApiKey: '',
    exchange: '',
  }),
  handleSubmit: async (values, { props, setSubmitting, resetForm }) => {
    const variables = {
      name: values.name,
      apiKey: values.apiKey,
      secret: values.secretOfApiKey,
      exchange: values.exchange.toLowerCase(),
      date: Math.round(+Date.now() / 1000),
    }

    try {
      await props.addExchangeKey({
        variables,
        update: (proxy, { data: { addExchangeKey } }) => {
          const proxyData = proxy.readQuery({ query: getKeysQuery })
          proxyData.myPortfolios[0].keys.push(addExchangeKey)
          proxy.writeQuery({ query: getKeysQuery, data: proxyData })
        },
      })
      resetForm({})
      setSubmitting(false)
    } catch (error) {
      setSubmitting(false)
      console.log(error)
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
class AddAccountDialog extends React.Component<IProps, IState> {
  state: IState = {
    openCongratulations: false,
    loading: false,
    isSelected: true,
  }

  handleRadioBtn = () => {
    this.setState({
      isSelected: !this.state.isSelected,
    })
  }

  handleClickOpen = () => {
    this.setState({
      openCongratulations: true,
    }, () => {
      setTimeout(() => {
        this.setState({
          loading: true
        })
      }, 4000)
    })

  }

  handleClose = () => {
    this.setState({ openCongratulations: false })
  }

  render() {
    // const { handleClose } = this
    const {
      theme: {
        palette: { blue, black },
      },
      values,
      touched,
      errors,
      handleChange,
      handleBlur,
      handleSubmit,
      validateForm,
      dirty,
      isSubmitting,
      handleClickOpen,
      handleClose,
      open,
    } = this.props

    return (
      <>
        <Congratulations
          open={this.state.openCongratulations}
          loading={this.state.loading}
          handleClickOpen={this.handleClickOpen}
          handleClose={this.handleClose}
        />

        {/*<Instruction
          open={this.state.openCongratulations}
          loading={this.state.loading}
          handleClickOpen={this.handleClickOpen}
          handleClose={this.handleClose}
        />*/}

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
              STEP 2/2
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
              connect your exchanges
            </TypographyCustomHeading>
          </DialogTitleCustom>
          <DialogContent
            justify="center"
            style={{
              padding: '0 3rem 3rem',
            }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault()
                validateForm().then(async () => {
                  await handleSubmit()
                  handleClose()
                })
              }}
              style={{ width: '440px' }}
            >
              <Grid>
                <GridCustom>
                  <Legend>Exchange</Legend>
                  <SelectExchangeList
                    isClearable={true}
                    value={
                      values.exchange
                        ? [{ label: values.exchange, value: values.exchange }]
                        : null
                    }
                    onChange={handleSelectChangePrepareForFormik.bind(
                      this,
                      'exchange'
                    )}
                    controlStyles={{
                      border: '1px solid #e0e5ec',
                      borderRadius: '1rem',
                      padding: '0 1rem',
                      background: '#fff',

                      border: '1px solid #E0E5EC',
                      boxSizing: 'border-box',
                      boxShadow: 'rgba(0, 0, 0, 0.11) 0px 1px 2px inset',
                    }}
                    singleValueStyles={{
                      color: '#abbad1',
                      fontSize: '1.3rem',
                    }}
                    optionStyles={{
                      color: '#abbad1',
                      fontSize: '1.3rem',
                    }}
                  />
                </GridCustom>
                <GridCustom>
                  <Legend>Account name</Legend>
                  <InputBaseCustom
                    error={touched.name && !!errors.name}
                    id="name"
                    name="name"
                    label="Name"
                    autoComplete="off"
                    value={values.name || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Type name..."
                    type="text"
                    margin="normal"
                    style={{
                      border: '1px solid #E0E5EC',
                      boxSizing: 'border-box',
                      boxShadow: 'rgba(0, 0, 0, 0.11) 0px 1px 2px inset',
                    }}
                    helperText={
                      touched.name &&
                      errors.name && <FormError>{errors.name}</FormError>
                    }
                  />
                </GridCustom>
                <GridCustom>
                  <Legend>Api key</Legend>
                  <InputBaseCustom
                    error={touched.apiKey && !!errors.apiKey}
                    id="apiKey"
                    type="text"
                    name="apiKey"
                    label="API Key"
                    autoComplete="off"
                    value={values.apiKey || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter API key here..."
                    margin="normal"
                    style={{
                      border: '1px solid #E0E5EC',
                      boxSizing: 'border-box',
                      boxShadow: 'rgba(0, 0, 0, 0.11) 0px 1px 2px inset',
                    }}
                    helperText={
                      touched.apiKey &&
                      errors.apiKey && <FormError>{errors.apiKey}</FormError>
                    }
                  />
                </GridCustom>
                <GridCustom>
                  <Legend>Secret key</Legend>
                  <InputBaseCustom
                    error={touched.secretOfApiKey && !!errors.secretOfApiKey}
                    id="secretOfApiKey"
                    name="secretOfApiKey"
                    label="Secret"
                    autoComplete="off"
                    value={values.secretOfApiKey || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter secret key here..."
                    type="text"
                    margin="normal"
                    style={{
                      border: '1px solid #E0E5EC',
                      boxSizing: 'border-box',
                      boxShadow: 'rgba(0, 0, 0, 0.11) 0px 1px 2px inset',
                    }}
                    helperText={
                      touched.secretOfApiKey &&
                      errors.secretOfApiKey && (
                        <FormError>{errors.secretOfApiKey}</FormError>
                      )
                    }
                  />
                </GridCustom>
              </Grid>

              <Grid container justify="space-between" alignItems="center">
                <LinkCustom href={'#'}>How to get keys?</LinkCustom>

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
                  type="submit"
                  disabled={!dirty || isSubmitting}
                  onClick={() => {
                    this.handleClickOpen()
                    handleClose()
                  }}
                >
                  FINISH
                </BtnCustom>
              </Grid>
            </form>
          </DialogContent>
        </DialogWrapper>
      </>
    )
  }
}

export default compose(
  graphql(addExchangeKeyMutation, {
    name: 'addExchangeKey',
    options: ({ baseCoin }) => ({
      refetchQueries: [
        {
          query: portfolioKeyAndWalletsQuery,
          variables: { baseCoin },
        },
        { query: getKeysQuery },
        { query: keysNames },
      ],
    }),
  }),
  formikEnhancer
)(AddAccountDialog)
