import React, { Component } from 'react'
import { DialogWrapper } from '../AddAccountDialog/AddAccountDialog.styles'
import { StyledPaper } from './PopupWrapper.styles'

export const PopupWrapper = ({
  open,
  close,
  children,
}: {
  open: boolean
  close: () => void
  children: any
}) => {
  return (
    <DialogWrapper
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={close}
      maxWidth={'md'}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      {children}
    </DialogWrapper>
  )
}
