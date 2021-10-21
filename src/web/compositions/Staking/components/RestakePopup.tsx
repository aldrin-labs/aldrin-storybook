import React, { useState } from 'react'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Theme } from '@material-ui/core'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { StyledPaper } from '../Staking.styles'
import { StretchedBlock } from '@sb/components/Layout'
import { BlockTitle } from '@sb/components/Block'
import { SvgIcon } from '@sb/components'
import CloseIcon from '@icons/closeIcon.svg'

export const RestakePopup = ({
  open,
  close,
}: {
  open: boolean
  close: () => void
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
      <StretchedBlock align="center">
        <BlockTitle>Your RIN Staking</BlockTitle>
        <SvgIcon
          src={CloseIcon}
          onClick={() => {
            close()
          }}
        />
      </StretchedBlock>
    </DialogWrapper>
  )
}
