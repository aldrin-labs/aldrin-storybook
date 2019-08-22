import React from 'react'
import { withFormik } from 'formik'
import Yup from 'yup'
import { compose, withStateHandlers } from 'recompose'
import { graphql } from 'react-apollo'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogContent from '@material-ui/core/DialogContent'
import Dialog from '@material-ui/core/Dialog'

import Typography from '@material-ui/core/Typography'

import { renameExchangeKeyMutation } from '@core/graphql/mutations/user/renameExchangeKeyMutation'
import { getKeysQuery } from '@core/graphql/queries/user/getKeysQuery'
import { keysNames } from '@core/graphql/queries/chart/keysNames'
import { portfolioKeyAndWalletsQuery } from '@core/graphql/queries/portfolio/portfolioKeyAndWalletsQuery'

const RenameKeyDialogComponent = ({
  handleClickOpen,
  handleClose,
  open,
  keyName = 'none',
  handleChange,
  values,
  handleSubmit,
  errors,
  customHandler
}) => (
  <div>
    {customHandler ? customHandler(handleClickOpen) : <Button onClick={handleClickOpen}>Rename</Button>}
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Rename key {keyName}?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To rename a key, please enter its new name
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
        <Button onClick={handleSubmit} color="primary" id="RenameDialogButton">
          Rename
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
      exchangeKey,
      handleClose,
      renameExchangeKey,
      forceUpdateUserContainer,
    } = props.props
    
    const variables = {
      input: {
          keyId: exchangeKey._id,
          name: keyNameInput
      }
    }

    try {
      props.setSubmitting(true)
      await renameExchangeKey({
        variables
      })
      await handleClose()
      forceUpdateUserContainer()
    } catch (error) {
      console.log(error)
      props.setFieldError('keyNameInput', 'Request error!')
      props.setSubmitting(false)
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

export const RenameKeyDialog = compose(
  graphql(renameExchangeKeyMutation, {
    name: 'renameExchangeKey',
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
)(RenameKeyDialogComponent)
