import React from 'react'
import MuiDialogContent from '@material-ui/core/DialogContent'
import { withStyles } from '@material-ui/styles'

export const DialogContent = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2,
    background: theme.palette.white.background,
    borderBottomRightRadius: '20px',
    borderBottomLeftRadius: '20px',
    border:
      (theme &&
        theme.palette &&
        theme.palette.border &&
        theme.palette.border.main) ||
      '.1rem solid #e0e5ec',
    borderTop: '0',
  },
}))(MuiDialogContent)
