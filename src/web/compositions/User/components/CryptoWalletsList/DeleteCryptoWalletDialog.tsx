import React from 'react'
import { withFormik } from 'formik'
import Yup from 'yup'
import { compose, withStateHandlers } from 'recompose'
import { isEqual } from 'lodash-es'
import { graphql } from 'react-apollo'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogContent from '@material-ui/core/DialogContent'
import Dialog from '@material-ui/core/Dialog'

import Typography from '@material-ui/core/Typography'

import { deleteCryptoWalletMutation } from '@core/graphql/mutations/user/deleteCryptoWalletMutation'
import { getCryptoWalletsQuery } from '@core/graphql/queries/user/getCryptoWalletsQuery'


import { portfolioKeyAndWalletsQuery } from '@containers/Portfolio/api'

const DeleteCryptoWalletDialogComponent = ({
  handleClickOpen,
  handleClose,
  open,
  wallet = null,
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
      <DialogTitle id="form-dialog-title">
        Delete crypto wallet {wallet.name}?
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          To delete crypto wallet please enter it's name:
        </DialogContentText>
        <TextField
          autoFocus={true}
          margin="dense"
          id="cryptoWalletNameInput"
          name="cryptoWalletNameInput"
          label="CryptoWallet name"
          onChange={handleChange}
          value={values.cryptoWalletNameInput}
          error={errors && !!errors.cryptoWalletNameInput}
          type="text"
          fullWidth={true}
        />
        <Typography color="error">{errors.cryptoWalletNameInput}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  </div>
)

const formikDialog = withFormik({
  validationSchema: Yup.object().shape({
    cryptoWalletNameInput: Yup.string().required(),
  }),
  mapPropsToValues: () => ({
    cryptoWalletNameInput: '',
  }),
  handleSubmit: async ({ cryptoWalletNameInput }, props: any) => {
    const {
      wallet,
      handleClose,
      deleteCryptoWallet,
      forceUpdateUserContainer,
    } = props.props

    const variables = {
      name: wallet.name,
    }
    const checkCryptoWalletName = isEqual(wallet.name, cryptoWalletNameInput)

    if (checkCryptoWalletName) {
      try {
        props.setSubmitting(true)
        await deleteCryptoWallet({
          variables,
          update: (proxy, { data: { deleteCryptoWallet } }) => {
            let proxyData = proxy.readQuery({ query: getCryptoWalletsQuery })
            const cryptoWallets = proxyData.myPortfolios[0].cryptoWallets.slice()
            const index = cryptoWallets.findIndex(
              (v) => v._id === deleteCryptoWallet._id
            )
            cryptoWallets.splice(index, 1)
            proxyData = {
              ...proxyData,
              myPortfolios: { ...proxyData.myPortfolios, cryptoWallets },
            }
            proxy.writeQuery({ query: getCryptoWalletsQuery, data: proxyData })
          },
        })
        await handleClose()
        forceUpdateUserContainer()
      } catch (error) {
        console.log(error)
        props.setFieldError('cryptoWalletNameInput', 'Request error!')
        props.setSubmitting(false)
      }
    } else {
      props.setFieldError(
        'cryptoWalletNameInput',
        'CryptoWallet name error! Check again!'
      )
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

export const DeleteCryptoWalletDialog = compose(
  graphql(deleteCryptoWalletMutation, {
    name: 'deleteCryptoWallet',
    options: {
      refetchQueries: [
        'getKeys',
        'getPortfolio',
        'portfolios',
        { query: portfolioKeyAndWalletsQuery },
      ],
    },
  }),
  graphql(getCryptoWalletsQuery),
  handleState,
  formikDialog
)(DeleteCryptoWalletDialogComponent)
