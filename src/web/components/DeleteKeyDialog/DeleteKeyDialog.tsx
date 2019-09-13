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

  const handleSubmit = async () => {
    if (checkName.toLowerCase() === name.toLowerCase()) {
      const response = await deleteMutation({
        variables: { name: checkName, removeTrades: true },
      })

      response ? closeDialog() : setError('Something went wrong')
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

//       try {
//         props.setSubmitting(true)
//         await deleteExchangeKey({
//           variables,
//           update: (proxy, { data: { deleteExchangeKey } }) => {
//             let proxyData = proxy.readQuery({ query: getKeysQuery })
//             const keys = proxyData.myPortfolios[0].keys.slice()
//             const index = keys.findIndex((v) => v._id === deleteExchangeKey._id)
//             keys.splice(index, 1)
//             proxyData = {
//               ...proxyData,
//               myPortfolios: { ...proxyData.myPortfolios, keys },
//             }
//             proxy.writeQuery({ query: getKeysQuery, data: proxyData })
//           },
//         })
//         await handleClose()
//         forceUpdateAccountContainer()
//       } catch (error) {
//         console.log(error)
//         props.setFieldError('accountNameInput', 'Request error!')
//         props.setSubmitting(false)
//       }

export default DeleteAccountDialogComponent
