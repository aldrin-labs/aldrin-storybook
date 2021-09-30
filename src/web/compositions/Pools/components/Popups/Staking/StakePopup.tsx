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
import { HintContainer } from './styles'
import { ExclamationMark } from '@sb/compositions/Chart/components/MarketBlock/MarketBlock.styles'

export const StakePopup = ({
  theme,
  open,
  close,
  pool,
}: {
  theme: Theme
  open: boolean
  close: () => void
  pool: number
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
      <RowContainer justify={'space-between'} width={'100%'}>
        <BoldHeader>Stake Pool Tokens</BoldHeader>
        <SvgIcon style={{ cursor: 'pointer' }} onClick={close} src={Close} />
      </RowContainer>
      <RowContainer justify="flex-start">
        <Text style={{ marginBottom: '1rem' }} fontSize={'1.4rem'}>
          Stake your Pool Tokens to start farming RIN.
        </Text>
      </RowContainer>
      <RowContainer>
        <InputWithCoins
          placeholder={''}
          theme={theme}
          value={pool.staked}
          onChange={() => {}}
          symbol={'Pool Tokens'}
          alreadyInPool={0}
          maxBalance={pool.staked}
          needAlreadyInPool={false}
        />
      </RowContainer>
      <RowContainer justify={'space-between'}>
        <Text>Est. rewards:</Text>
        <Text>
          <span style={{ color: '#A5E898' }}>12</span> RIN/Day for each $
          <span style={{ color: '#A5E898' }}>1000</span>
        </Text>
      </RowContainer>
      <HintContainer justify={'flex-start'} margin="2rem 0">
        <Row width="20%">
          <ExclamationMark
            theme={theme}
            margin={'0 0 0 2rem'}
            fontSize="5rem"
            color={'#fbf2f2'}
          />
        </Row>
        <Row width="80%" align="flex-start" direction="column">
          <Text style={{ margin: '0 0 1.5rem 0' }}>
            Pool tokens will be locked for{' '}
            <span style={{ color: '#A5E898' }}>7 days.</span>{' '}
          </Text>
          <Text>
            Withdrawal will not be available until{' '}
            <span style={{ color: '#A5E898' }}>Aug 15, 2021</span>
          </Text>
        </Row>
      </HintContainer>
      <RowContainer justify="space-between" margin={'3rem 0 2rem 0'}>
        <BlueButton
          style={{ width: '100%', fontFamily: 'Avenir Next Medium' }}
          disabled={false}
          isUserConfident={true}
          theme={theme}
          onClick={() => {}}
        >
          Stake
        </BlueButton>
      </RowContainer>
    </DialogWrapper>
  )
}
