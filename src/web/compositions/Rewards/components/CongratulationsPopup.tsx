import React, { useState } from 'react'

import { notify } from '@sb/dexUtils/notifications'
import { CircularProgressbar as Circle } from 'react-circular-progressbar'

import {
  StyledDialogContent,
} from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import { PurpleButton, StyledPaper, PasteButton } from '@sb/compositions/Addressbook/components/Popups/NewCoinPopup'
import { Input, Text } from '@sb/compositions/Addressbook/index'
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { RowContainer } from '@sb/compositions/AnalyticsRoute'

const CongratulationsPopup = ({
  theme,
  open,
  handleClose,
}) => {

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
        <div style={{ padding: '3rem 0', textAlign: 'center' }}>
          <Text>Congratulations! You’re Twitter Farming Validator now!</Text>
          <div style={{ position: 'relative', margin: '2.5rem 0 0 0' }}>
          <Circle
              styles={{
                root: { width: '40%' },
                path: {
                  stroke: theme.palette.green.shine,
                  filter:
                    'drop-shadow(0px 0px 24px rgba(199, 255, 208, 0.67));',
                },
                trail: { stroke: theme.palette.grey.circle },
                text: {
                  fill: theme.palette.green.shine,
                  fontWeight: 'bold',
                  transform: 'translateY(3%)',
                },
              }}
              value={50}
              strokeWidth={21}
              text={`5 / 10`}
            />
          </div>
          <RowContainer style={{ margin: '3rem 0 2rem 0'}}>
            <Text>
              Validators online
            </Text>
          </RowContainer>
          <RowContainer> 
          
            <PurpleButton
              text={'OK'}
              width="70%"
              height="4.5rem"
              margin={'1rem 0 0 0'}
              onClick={async () => {
                await handleClose()
              }}
            />
          </RowContainer>
        </div>
      </StyledDialogContent>
    </DialogWrapper>
  )
}

export default CongratulationsPopup
