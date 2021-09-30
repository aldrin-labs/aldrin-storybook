import React, { useState } from 'react'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Theme } from '@material-ui/core'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BoldHeader, Line, StyledPaper } from '../index.styles'
import { Text } from '@sb/compositions/Addressbook/index'

import SvgIcon from '@sb/components/SvgIcon'

import Close from '@icons/closeIcon.svg'

import { BlueButton } from '@sb/compositions/Chart/components/WarningPopup'
import { InputWithCoins } from '../components'

export const StakePopup = ({
  theme,
  open,
  close,
}: {
  theme: Theme
  open: boolean
  close: () => void
}) => {
  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={close}
      onEnter={() => {}}
      maxWidth={'md'}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <Row justify={'space-between'} width={'100%'}>
        <BoldHeader>Stake Pool Tokens</BoldHeader>
        <SvgIcon style={{ cursor: 'pointer' }} onClick={close} src={Close} />
      </Row>
      <RowContainer justify="flex-start">
        <Text style={{ marginBottom: '1rem' }} fontSize={'1.4rem'}>
          Stake your Pool Tokens to start farming RIN.
        </Text>
      </RowContainer>
      <RowContainer>
        <InputWithCoins
          placeholder={''}
          theme={theme}
          value={1}
          onChange={() => {}}
          symbol={'Pool Tokens'}
          alreadyInPool={10}
          maxBalance={10}
          needAlreadyInPool={false}
        />
      </RowContainer>
      <RowContainer justify="space-between" margin={'3rem 0 2rem 0'}>
        <BlueButton
          style={{ width: '100%', fontFamily: 'Avenir Next Medium' }}
          disabled={false}
          isUserConfident={true}
          theme={theme}
          onClick={() => {}}
        >
          Stake{' '}
        </BlueButton>
      </RowContainer>
    </DialogWrapper>
  )
}
