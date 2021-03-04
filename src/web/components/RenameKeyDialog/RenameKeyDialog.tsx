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

import { withTheme } from '@material-ui/styles'
import { ErrorText } from '@sb/components/SignalPreferencesDialog/SignalPreferencesDialog.styles'
import { OpenRenameButton } from '@sb/components/RenameKeyDialog/RenameKeyDialog.styles'

const RenameKeyDialogComponent = ({
  data,
  theme,
  renameMutation,
  closeMainPopup,
  needRenameButton = true,
  isPortfolio = false,
  portfolioId,
}) => {
  const { name, _id: id } = data
  const target = isPortfolio ? 'portfolio' : 'account'

  const [isOpen, toggleDialog] = useState(!needRenameButton)
  const [newName, updateName] = useState('')
  const [error, setError] = useState('')

  const openDialog = () => toggleDialog(true)

  const closeDialog = () => {
    toggleDialog(false)
    setError('')
    updateName('')
    closeMainPopup()
  }

  const handleSubmit = async () => {
    const trimmedName = newName.trim()

    const variables = isPortfolio
      ? { inputPortfolio: { id, name: trimmedName } }
      : { input: { keyId: id, name: trimmedName, portfolioId: portfolioId } }

    if (trimmedName.length < 3) {
      setError('Please enter name with at least 3 characters ')
      return false
    }

    if (trimmedName.length > 20) {
      return setError('Please limit name to 20 characters')
    }

    closeDialog()

    const { data } = await renameMutation({
      variables,
    })

    const { executed, error } = data.renameExchangeKey || data.renamePortfolio

    if (!executed) {
      return setError(error)
    }
  }
  return (
    <>
      {needRenameButton ? (
        <OpenRenameButton theme={theme} onClick={openDialog}>
          Rename
        </OpenRenameButton>
      ) : null}
      <Dialog
        theme={theme}
        PaperComponent={StyledPaper}
        style={{ width: '75rem', margin: 'auto' }}
        open={isOpen}
        onClose={closeDialog}
        maxWidth={'md'}
        style={{ transition: 'opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms' }}
        aria-labelledby="form-dialog-title"
      >
        <StyledDialogTitle
          theme={theme}
          disableTypography
          id="form-dialog-title"
        >
          <TypographyTitle
            theme={theme}
          >{`Rename ${target} "${name}"?`}</TypographyTitle>
          <ClearButton theme={theme}>
            <Clear
              theme={theme}
              style={{ fontSize: '2rem' }}
              color="inherit"
              onClick={closeDialog}
            />
          </ClearButton>
        </StyledDialogTitle>
        <StyledDialogContent theme={theme} style={{ paddingBottom: '1rem' }}>
          <Grid theme={theme} style={{ paddingBottom: '1.5rem' }}>
            <Grid
              theme={theme}
              style={{ padding: '1rem' }}
              container
              alignItems="center"
              wrap="nowrap"
            >
              <TypographySectionTitle theme={theme}>
                TO RENAME A KEY, PLEASE ENTER ITS NEW NAME
              </TypographySectionTitle>
              <Line theme={theme} />
            </Grid>
            <FormControl theme={theme} fullWidth required>
              <Grid container theme={theme} alignItems="center">
                <StyledInput
                  maxLength={'24'}
                  theme={theme}
                  type="text"
                  width="100"
                  value={newName}
                  onChange={(e) => updateName(e.target.value)}
                  placeholder="Type new name..."
                  style={{ marginLeft: '0rem' }}
                />
              </Grid>
              {error ? (
                <ErrorText theme={theme} style={{ paddingTop: '.5rem' }}>
                  {error}
                </ErrorText>
              ) : null}
            </FormControl>
            <Grid
              theme={theme}
              container
              alignItems="center"
              justify="flex-end"
              wrap="nowrap"
              style={{ paddingTop: '2rem' }}
            >
              <StyledButton
                theme={theme}
                onClick={handleSubmit}
                color="primary"
                id="RenameDialogButton"
              >
                Rename
              </StyledButton>
            </Grid>
          </Grid>
        </StyledDialogContent>
      </Dialog>
    </>
  )
}

export default withTheme()(RenameKeyDialogComponent)
