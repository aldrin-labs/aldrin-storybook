import React from 'react'
import { withFormik } from 'formik'
import Yup from 'yup'
import { compose, withStateHandlers } from 'recompose'
import { graphql } from 'react-apollo'
import { isEqual } from 'lodash-es'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogContent from '@material-ui/core/DialogContent'
import Dialog from '@material-ui/core/Dialog'

import Typography from '@material-ui/core/Typography'

import { deleteExchangeKeyMutation } from '@core/graphql/mutations/user/deleteExchangeKeyMutation'
import { getKeysQuery } from '@core/graphql/queries/user/getKeysQuery'
import { keysNames } from '@core/graphql/queries/chart/keysNames'
import { portfolioKeyAndWalletsQuery } from '@core/graphql/queries/portfolio/portfolioKeyAndWalletsQuery'

const DeleteAccountDialogComponent = ({
  handleClickOpen,
  handleClose,
  open,
  accountName = 'none',
  handleChange,
  values,
  handleSubmit,
  errors,
}) => (
  <div>
    <div className="deleteAccountDialog-toggler" onClick={handleClickOpen}>Delete</div>
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Delete account {accountName}?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To delete account please enter it's name:
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="accountNameInput"
          name="accountNameInput"
          label="Account name"
          onChange={handleChange}
          value={values.accountNameInput}
          error={errors && !!errors.accountNameInput}
          type="text"
          fullWidth
        />
        <Typography color="error">{errors.accountNameInput}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" id="DeleteDialogButton">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  </div>
)

const formikDialog = withFormik({
  validationSchema: Yup.object().shape({
    accountNameInput: Yup.string().required(),
  }),
  mapPropsToValues: () => ({
    accountNameInput: '',
  }),
  handleSubmit: async ({ accountNameInput }, props) => {
    const {
      accountName,
      handleClose,
      deleteExchangeKey,
      forceUpdateAccountContainer,
    } = props.props
    const variables = {
      name: accountNameInput,
      removeTrades: true,
    }
    const checkAccountName = isEqual(accountName, accountNameInput)

    if (checkAccountName) {
      try {
        props.setSubmitting(true)
        await deleteExchangeKey({
          variables,
          update: (proxy, { data: { deleteExchangeKey } }) => {
            let proxyData = proxy.readQuery({ query: getKeysQuery })
            const keys = proxyData.myPortfolios[0].keys.slice()
            const index = keys.findIndex((v) => v._id === deleteExchangeKey._id)
            keys.splice(index, 1)
            proxyData = {
              ...proxyData,
              myPortfolios: { ...proxyData.myPortfolios, keys },
            }
            proxy.writeQuery({ query: getKeysQuery, data: proxyData })
          },
        })
        await handleClose()
        forceUpdateAccountContainer()
      } catch (error) {
        console.log(error)
        props.setFieldError('accountNameInput', 'Request error!')
        props.setSubmitting(false)
      }
    } else {
      props.setFieldError('accountNameInput', 'Account name error! Check again!')
    }
  },
})

const handleState = withStateHandlers(
  ({ open = false }) => ({
    open,
  }),
  {
    handleClickOpen: () => () => ({
      open: true,
    }),
    handleClose: () => () => ({
      open: false,
    }),
  }
)

export const DeleteAccountDialog = compose(
  graphql(deleteExchangeKeyMutation, {
    name: 'deleteExchangeKey',
    options: {
      refetchQueries: [
        'getKeys',
        'getPortfolio',
        'portfolios',
        { query: portfolioKeyAndWalletsQuery },
        { query: getKeysQuery },
        { query: keysNames },
      ],
    },
  }),
  graphql(getKeysQuery),
  handleState,
  formikDialog
)(DeleteAccountDialogComponent)
