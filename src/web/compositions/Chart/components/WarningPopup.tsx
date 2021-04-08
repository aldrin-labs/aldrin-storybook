import { Paper } from '@material-ui/core'
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import React from 'react'
import styled from 'styled-components'
import {
  MainTitle,
  WhiteText,
} from '@sb/components/TraidingTerminal/ConfirmationPopup'

const StyledPaper = styled(Paper)`
  border-radius: 2rem;
  width: 50rem;
  height: auto;
  background: #222429;
  border: 0.1rem solid #3a475c;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem;
  padding: 3rem;
`

export const WarningPopup = (theme) => {
  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={() => {}}
      maxWidth={'md'}
      open={true}
      aria-labelledby="responsive-dialog-title"
    ></DialogWrapper>
  )
}
