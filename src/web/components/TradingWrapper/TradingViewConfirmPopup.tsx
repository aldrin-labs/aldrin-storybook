import React, { useState } from 'react'
import styled from 'styled-components'
import { Dialog, Paper } from '@material-ui/core'

import {
  TypographyTitle,
  StyledDialogContent,
  ClearButton,
  StyledDialogTitle,
} from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import SvgIcon from '@sb/components/SvgIcon'
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import Warning from '@icons/warning.svg'

const StyledPaper = styled(Paper)`
  border-radius: 2rem;
  width: 65rem;
`

const TradingViewConfirmPopup = ({
  theme,
  open,
  handleClose,
  updateWrapperState,
}) => {
  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      style={{ width: '85rem', margin: 'auto' }}
      fullScreen={false}
      onClose={handleClose}
      maxWidth="md"
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <StyledDialogContent
        style={{ background: '#303743', textAlign: 'center' }}
        theme={theme}
        id="share-dialog-content"
      >
        <div style={{ paddingTop: '3rem' }}>
          <SvgIcon src={Warning} width="10rem" height="10rem" />
        </div>
        <div
          style={{
            fontSize: '1.8rem',
            color: '#fff',
            fontFamily: 'DM Sans',
            padding: '6rem 4rem 4rem 4rem',
          }}
        >
          The bot will stop when you close the tab. Do not close the tab if you
          want the bot to work properly.
        </div>
        <BtnCustom
          // disable={!enableEdit}
          needMinWidth={false}
          btnWidth="15rem"
          height="4.5rem"
          fontSize="1.4rem"
          padding="1rem 2rem"
          borderRadius=".8rem"
          borderColor={theme.palette.blue.serum}
          btnColor="#fff"
          backgroundColor={theme.palette.blue.serum}
          textTransform="none"
          margin="1rem 0 0 0"
          transition="all .4s ease-out"
          onClick={() => {
            handleClose()
            updateWrapperState('TVAlertsBotEnabled', false)
          }}
        >
          OK
        </BtnCustom>
      </StyledDialogContent>
    </DialogWrapper>
  )
}

export default TradingViewConfirmPopup
