import React from 'react'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogContent from '@material-ui/core/DialogContent'
import Dialog from '@material-ui/core/Dialog'
import Typography from '@material-ui/core/Typography'


import { withFormik } from 'formik'
import Yup from 'yup'
import { compose, withStateHandlers } from 'recompose'

import TransparentExtendedFAB from '@sb/components/TransparentExtendedFAB'

import { IProps, IhandleSubmitProps } from './types'

const SaveLayoutDialogComponent = ({ ...props }: IProps) => {
    const { handleClickOpen,
      handleClose,
      open,
      handleChange,
      values,
      handleSubmit,
      errors,
    } = props
    return (<div>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        >
        {text}
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogContent>
          <DialogContentText>
            To save layout please enter name:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="layoutNameInput"
            name="layoutNameInput"
            label="Layout name"
            onChange={handleChange}
            value={values.layoutNameInput}
            type="text"
            fullWidth
          />
          <Typography color="error">{errors.layoutNameInput}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} id="SaveDialogButton">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>)
  }

const formikDialog = withFormik({
  validationSchema: Yup.object().shape({
    layoutNameInput: Yup.string().required(),
  }),
  mapPropsToValues: () => ({
    layoutNameInput: '',
  }),
  handleSubmit: async ({ layoutNameInput }, props: IhandleSubmitProps) => {
    const {
      handleClose,
      saveLayout,
    } = props.props

    try {
      props.setSubmitting(true)
      await saveLayout(layoutNameInput)
      await handleClose()
    } catch (error) {
      console.log(error)
      props.setSubmitting(false)
    }

  },
})

const handleState = withStateHandlers(
  ({ open = false }: {open: boolean}) => ({
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

export const SaveLayoutDialog = compose(
  handleState,
  formikDialog
)(SaveLayoutDialogComponent)
