import React from 'react'
import { Dialog, DialogTitle, Grid, FormControl } from '@material-ui/core'
import { StyledPaper, TypographyTitle } from './SignalPreferencesDialog.styles'

const SignalPreferencesDialog = ({ isDialogOpen, closeDialog }) => {
  return (
    <Dialog
      PaperComponent={StyledPaper}
      style={{ width: '75rem', margin: 'auto' }}
      fullScreen={false}
      onClose={closeDialog}
      maxWidth={'md'}
      open={isDialogOpen}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle
        disableTypography
        id="responsive-dialog-title"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid #E0E5EC',
          backgroundColor: '#F2F4F6',
          height: '4rem',
        }}
      >
        <TypographyTitle>signal preferences</TypographyTitle>
      </DialogTitle>
    </Dialog>
  )
}

export default SignalPreferencesDialog
