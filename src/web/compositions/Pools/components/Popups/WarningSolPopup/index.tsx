import React, { useState } from 'react'
import styled from 'styled-components'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Theme } from '@material-ui/core'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import SvgIcon from '@sb/components/SvgIcon'

import Close from '@icons/closeIcon.svg'
import { Text } from '@sb/compositions/Addressbook/index'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { StyledPaper } from '../index.styles'

const UpdatedPaper = styled(({ ...props }) => <StyledPaper {...props} />)`
  width: 54rem;
`

export const WarningSolPopup = ({
  theme,
  open,
  close,
  createAdditionalSolAddress,
}: {
  theme: Theme
  open: boolean
  close: () => void
  createAdditionalSolAddress: () => void
}) => {
  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={UpdatedPaper}
      fullScreen={false}
      onClose={close}
      maxWidth="md"
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer justify="space-between">
        <Text fontSize="2.3rem" fontFamily="Avenir Next Demi">
          Confirm New SOL Address Creation
        </Text>
        <SvgIcon style={{ cursor: 'pointer' }} onClick={close} src={Close} />
      </RowContainer>
      <RowContainer direction="column" padding="3rem 0">
        <Text fontFamily="Avenir Next Medium">
          Due to the peculiarities of Solana, it is impossible to perform
          actions with the default SOL token address from the wallet. If you
          want to add SOL to this pool an additional SOL address will be created
          for you, through which the transaction will pass.
        </Text>
        <Text
          style={{ marginTop: '2rem' }}
          color="#93A0B2"
          fontFamily="Avenir Next Medium"
        >
          When you withdraw from the pool, the funds will return to the default
          address.
        </Text>
      </RowContainer>
      <RowContainer justify="space-between">
        <BtnCustom
          theme={theme}
          onClick={() => {
            close()
          }}
          needMinWidth={false}
          btnWidth="calc(55% - 3rem)"
          height="100%"
          fontSize="1.4rem"
          borderRadius="1.6rem"
          borderColor="#f2fbfb"
          btnColor="#f2fbfb"
          backgroundColor="transparent"
          textTransform="none"
          transition="all .4s ease-out"
          padding="1.5rem 2rem"
          style={{ whiteSpace: 'nowrap' }}
        >
          Cancel{' '}
        </BtnCustom>
        <BtnCustom
          theme={theme}
          onClick={createAdditionalSolAddress}
          needMinWidth={false}
          btnWidth="calc(55% - 3rem)"
          height="100%"
          fontSize="1.4rem"
          borderRadius="1.6rem"
          borderColor={theme.palette.blue.serum}
          btnColor="#fff"
          backgroundColor={theme.palette.blue.serum}
          textTransform="none"
          transition="all .4s ease-out"
          padding="1.5rem 2rem"
          style={{ whiteSpace: 'nowrap' }}
        >
          Confirm
        </BtnCustom>
      </RowContainer>
    </DialogWrapper>
  )
}
