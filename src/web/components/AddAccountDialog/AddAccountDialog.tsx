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
    open: false,
    isSelected: true,
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

  render() {
    const { handleClose } = this
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
    } = this.props

    return (
      <>
        <BtnCustom
          btnWidth={'auto'}
          height={'auto'}
          btnColor={'#165BE0'}
          borderRadius={'1rem'}
          color={'#165BE0'}
          margin={'1.6rem 0 0 2rem'}
          padding={'.5rem 1rem .5rem 0'}
          fontSize={'1.4rem'}
          letterSpacing="1px"
          onClick={this.handleClickOpen}
          style={{
            border: 'none',
          }}
        >
          <SvgIcon
            src={Plus}
            width="3.5rem"
            height="auto"
            style={{
              marginRight: '.8rem',
            }}
          />
          Add Account
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
              Add Api Key
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
                    }}
                    singleValueStyles={{
                      color: '#6D7786',
                      fontSize: '1.3rem',
                    }}
                    optionStyles={{
                      color: '#6D7786',
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
                  btnWidth={'85px'}
                  borderRadius={'32px'}
                  btnColor={!dirty || isSubmitting ? 'rgba(0, 0, 0, 0.26)' : blue.custom}
                  type="submit"
                  disabled={!dirty || isSubmitting}
                >
                  ADD
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
