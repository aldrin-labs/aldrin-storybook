import CloseIcon from '@icons/closeIcon.svg'
import { SvgIcon } from '@sb/components'
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { BlockTitle } from '@sb/components/Block'
import { Body, StretchedBlock } from '@sb/components/Layout'
import { Text } from '@sb/components/Typography'
import React from 'react'
import { StyledPaper } from '../Staking.styles'

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
      {' '}
      <Body>
        <StretchedBlock align="center">
          <BlockTitle>Your RIN Staking</BlockTitle>
          <SvgIcon
            src={CloseIcon}
            onClick={() => {
              close()
            }}
          />
        </StretchedBlock>
        <StretchedBlock>
          {' '}
          <Text maxWidth="100%" size="sm">
            The reward is recalculated daily for the duration of the staking
            period. But claim your you can reward after the first day of each
            following month.
          </Text>
        </StretchedBlock>
      </Body>
    </DialogWrapper>
  )
}
