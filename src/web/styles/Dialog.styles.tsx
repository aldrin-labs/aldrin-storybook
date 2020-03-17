import React from 'react'
import MuiDialogContent from '@material-ui/core/DialogContent'
import { withStyles } from '@material-ui/styles'

export const DialogContent = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
}))(MuiDialogContent)
