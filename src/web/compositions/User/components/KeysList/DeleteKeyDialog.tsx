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

import { portfolioKeyAndWalletsQuery } from '@containers/Portfolio/api'

const DeleteKeyDialogComponent = ({
  handleClickOpen,
  handleClose,
  open,
  keyName = 'none',
  handleChange,
  values,
  handleSubmit,
  errors,
}) => (
  <div>
    <Button onClick={handleClickOpen}>Delete</Button>
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Delete key {keyName}?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To delete key please enter it's name:
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="keyNameInput"
          name="keyNameInput"
          label="Key name"
          onChange={handleChange}
          value={values.keyNameInput}
          error={errors && !!errors.keyNameInput}
          type="text"
          fullWidth
        />
        <Typography color="error">{errors.keyNameInput}</Typography>
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
    keyNameInput: Yup.string().required(),
  }),
  mapPropsToValues: () => ({
    keyNameInput: '',
  }),
  handleSubmit: async ({ keyNameInput }, props) => {
    const {
      keyName,
      handleClose,
      deleteExchangeKey,
      forceUpdateUserContainer,
    } = props.props
    const variables = {
      name: keyNameInput,
      removeTrades: true,
    }
    const checkKeyName = isEqual(keyName, keyNameInput)

    if (checkKeyName) {
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
        forceUpdateUserContainer()
      } catch (error) {
        console.log(error)
        props.setFieldError('keyNameInput', 'Request error!')
        props.setSubmitting(false)
      }
    } else {
      props.setFieldError('keyNameInput', 'Key name error! Check again!')
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

export const DeleteKeyDialog = compose(
  graphql(deleteExchangeKeyMutation, {
    name: 'deleteExchangeKey',
    options: {
      refetchQueries: [
        'getKeys',
        'getPortfolio',
        'portfolios',
        { query: portfolioKeyAndWalletsQuery },
      ],
    },
  }),
  graphql(getKeysQuery),
  handleState,
  formikDialog
)(DeleteKeyDialogComponent)
