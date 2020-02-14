import React, { useState } from 'react'
import { Grid, FormControl } from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog'

import Clear from '@material-ui/icons/Clear'
import {
  ClearButton,
  StyledPaper,
  StyledDialogTitle,
  StyledDialogContent,
  TypographyTitle,
  TypographySectionTitle,
  Line,
  StyledInput,
  StyledButton,
} from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'

import { ErrorText } from '@sb/components/SignalPreferencesDialog/SignalPreferencesDialog.styles'

import { OpenDeleteButton } from './DeleteKeyDialog.styles'

const DeleteAccountDialogComponent = ({
  data,
  deleteMutation,
  closeMainPopup,
  disabled = false,
  isPortfolio = false,
  enqueueSnackbar,
}) => {
  const { name } = data
  const target = isPortfolio ? 'portfolio' : 'account'

  const [isOpen, toggleDialog] = useState(false)
  const [checkName, updateName] = useState('')
  const [error, setError] = useState('')

  const openDialog = () => toggleDialog(true)

  const closeDialog = () => {
    toggleDialog(false)
    updateName('')
    setError('')
    closeMainPopup()
  }

  const showDeleteKeyStatus = ({ status = 'ERR', errorMessage = 'Something went wrong with deleting your key' }: { status: "ERR" | "OK", errorMessage: string }) => {
    if (status === 'OK') {
      enqueueSnackbar(`Your key was successfully deleted`, { variant: 'success' })
    } else {
      enqueueSnackbar(`Error: ${errorMessage}`, { variant: 'error' })
    }
  }


  const handleSubmit = async () => {
    if (checkName.toLowerCase() === name.toLowerCase()) {
      try {
        const response = await deleteMutation({
          variables: { name: name, removeTrades: false },
        })
        const { status, errorMessage } = response.data.deleteExchangeKey

        showDeleteKeyStatus({ status, errorMessage })
        
        if (status !== 'OK') {
          setError('Something went wrong')
          return
        }
        closeDialog()

      } catch(e) {
        setError('Something went wrong')
        showDeleteKeyStatus({ status: 'ERR', errorMessage: e.message })
      }
    } else {
      setError('Names do not match')
    }
  }

  return (
    <>
      <OpenDeleteButton onClick={openDialog} disabled={disabled}>
        Delete
      </OpenDeleteButton>
      <Dialog
        PaperComponent={StyledPaper}
        style={{ width: '75rem', margin: 'auto' }}
        open={isOpen}
        onClose={closeDialog}
        maxWidth={'md'}
        style={{ transition: 'opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms' }}
        aria-labelledby="form-dialog-title"
      >
        <StyledDialogTitle disableTypography id="form-dialog-title">
          <TypographyTitle>{`Delete ${target} "${name}"?`}</TypographyTitle>
          <ClearButton>
            <Clear
              style={{ fontSize: '2rem' }}
              color="inherit"
              onClick={closeDialog}
            />
          </ClearButton>
        </StyledDialogTitle>
        <StyledDialogContent style={{ paddingBottom: '1rem' }}>
          <Grid style={{ paddingBottom: '1.5rem' }}>
            <Grid
              style={{ padding: '1rem' }}
              container
              alignItems="center"
              wrap="nowrap"
            >
              <TypographySectionTitle>
                To delete a {target}, please enter it's name
              </TypographySectionTitle>
              <Line />
            </Grid>
            <FormControl fullWidth required>
              <Grid container alignItems="center">
                <StyledInput
                  type="text"
                  width="100"
                  value={checkName}
                  onChange={(e) => updateName(e.target.value)}
                  placeholder={`Type ${target} name...`}
                  style={{ marginLeft: '0rem' }}
                />
              </Grid>
              {error ? (
                <ErrorText style={{ paddingTop: '.5rem' }}>{error}</ErrorText>
              ) : null}
            </FormControl>
            <Grid
              container
              alignItems="center"
              justify="flex-end"
              wrap="nowrap"
              style={{ paddingTop: '2rem' }}
            >
              <StyledButton
                onClick={handleSubmit}
                color="primary"
                id="DeleteDialogButton"
              >
                Delete
              </StyledButton>
            </Grid>
          </Grid>
        </StyledDialogContent>
      </Dialog>
    </>
  )
}

export default DeleteAccountDialogComponent
