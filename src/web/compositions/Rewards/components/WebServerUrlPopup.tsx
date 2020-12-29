import React, { useState } from 'react'

import { notify } from '@sb/dexUtils/notifications'

import {
  StyledDialogContent,
} from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import { PurpleButton, StyledPaper, PasteButton } from '@sb/compositions/Addressbook/components/Popups/NewCoinPopup'
import { Input, Text } from '@sb/compositions/Addressbook/index'
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { RowContainer } from '@sb/compositions/AnalyticsRoute'

const WebServerUrlPopup = ({
  theme,
  open,
  handleClose,
  openNextPopup
}) => {
  const [address, updateAddress] = useState('')
  const [showLoader, updateShowLoader] = useState(false)

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      style={{ width: '85rem', margin: 'auto' }}
      fullScreen={false}
      onClose={handleClose}
      maxWidth={'md'}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <StyledDialogContent
        style={{ background: theme.palette.grey.input }}
        theme={theme}
        id="share-dialog-content"
      >
        <div style={{ padding: '3rem 0', textAlign: 'left' }}>
          <Text>Paste your web-server URL</Text>
          <div style={{ position: 'relative', marginTop: '1.5rem' }}>
            <Input
              style={{
                background: theme.palette.grey.input,
                color: theme.palette.text.light,
                border: `0.1rem solid ${theme.palette.text.white}`,
                outline: 'none',
              }}
              id={'address'}
              type={'text'}
              value={address}
              onChange={(e) => updateAddress(e.target.value)}
            />
            <PasteButton
              onClick={() => {
                navigator.clipboard
                  .readText()
                  .then((clipText) => updateAddress(clipText))
              }}
            >
              Paste
            </PasteButton>
          </div>
          <RowContainer> 
            
            <PurpleButton
              text={'Confirm'}
              showLoader={showLoader}
              width="70%"
              height="4.5rem"
              margin={'1rem 0 0 0'}
              onClick={async () => {
                if (address === '') {
                  notify({
                    type: 'error',
                    message: `Web-server url field should not be empty`,
                  })

                  return
                }

                await updateAddress('')
                await openNextPopup()
                await handleClose()
              }}
            />
          </RowContainer>
        </div>
      </StyledDialogContent>
    </DialogWrapper>
  )
}

export default WebServerUrlPopup
