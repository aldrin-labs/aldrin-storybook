import React, { useState } from 'react'
import { Grid, FormControl } from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'

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
      : { input: { keyId: id, name: trimmedName } }

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
        style={{
          width: '75rem',
          margin: 'auto',
          // height: '22rem',
          // maxHeight: '22rem',
        }}
        open={isOpen}
        onClose={closeDialog}
        maxWidth={'md'}
        aria-labelledby="form-dialog-title"
      >
        <StyledDialogTitle
          style={{
            border: 'none',
            background: 'none',
            justifyContent: 'center',
            height: '8rem',
          }}
          theme={theme}
          disableTypography
          id="form-dialog-title"
        >
          <TypographyTitle
            style={{
              fontFamily: 'Avenir Next Medium',
              textTransform: 'none',
              fontSize: '2.2rem',
              color: theme.palette.grey.onboard,
              letterSpacing: '-0.65px',
            }}
            theme={theme}
          >{`Rename ${target} ${name} to:`}</TypographyTitle>
          {/* <ClearButton theme={theme}>
            <Clear
              theme={theme}
              style={{ fontSize: '2rem' }}
              color="inherit"
              onClick={closeDialog}
            />
          </ClearButton> */}
        </StyledDialogTitle>
        <StyledDialogContent
          theme={theme}
          style={{
            paddingBottom: '1rem',
            height: '15rem',
            display: 'flex',
            justifyContent: 'space-evenly',
            flexDirection: 'column',
          }}
        >
          <Grid theme={theme} style={{ paddingBottom: '1.5rem' }}>
            {/* <Grid
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
            </Grid> */}
            <FormControl theme={theme} fullWidth required>
              <Grid container theme={theme} alignItems="center">
                <StyledInput
                  maxLength={'24'}
                  theme={theme}
                  type="text"
                  width="100"
                  value={newName}
                  onChange={(e) => updateName(e.target.value)}
                  placeholder="Enter new name here"
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
              justify="space-between"
              wrap="nowrap"
              style={{ paddingTop: '2rem' }}
            >
              <BtnCustom
                theme={theme}
                height={'3.7rem'}
                btnWidth={'48%'}
                backgroundColor={'transparent'}
                color={theme.palette.grey.onboard}
                borderColor={theme.palette.grey.onboard}
                borderRadius={'1rem'}
                borderWidth={'0.1rem'}
                fontSize={'1.3rem'}
                textTransform={'capitalize'}
                onClick={closeDialog}
              >
                Cancel
              </BtnCustom>
              <BtnCustom
                theme={theme}
                height={'3.7rem'}
                btnWidth={'48%'}
                borderColor={'none'}
                backgroundColor={theme.palette.blue.main}
                color={'#fff'}
                borderRadius={'1rem'}
                textTransform={'capitalize'}
                fontSize={'1.3rem'}
                id="RenameDialogButton"
                onClick={handleSubmit}
              >
                {`Rename ${target}`}
              </BtnCustom>
            </Grid>
          </Grid>
        </StyledDialogContent>
      </Dialog>
    </>
  )
}

export default withTheme()(RenameKeyDialogComponent)
