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
import { HintContainer } from '../Staking/styles'
import { getTokenDataByMint } from '@sb/compositions/Pools/utils'
import { PoolInfo } from '@sb/compositions/Pools/index.types'
import AttentionComponent from '@sb/components/AttentionBlock'

import { endFarming } from '@sb/dexUtils/pools/endFarming'
import { PublicKey } from '@solana/web3.js'
import { useWallet } from '@sb/dexUtils/wallet'
import { useConnection } from '@sb/dexUtils/connection'

export const UnstakePopup = ({
  theme,
  open,
  allTokensData,
  pool,
  close,
}: {
  theme: Theme
  open: boolean
  allTokensData: any
  pool: PoolInfo
  close: () => void
}) => {
  const { wallet } = useWallet()
  const connection = useConnection()
  const {
    amount: maxPoolTokenAmount,
    address: userPoolTokenAccount,
    decimals: poolTokenDecimals,
  } = getTokenDataByMint(allTokensData, pool.poolTokenMint)

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
        <BoldHeader>Unstake Pool Tokens</BoldHeader>
        <SvgIcon style={{ cursor: 'pointer' }} onClick={close} src={Close} />
      </RowContainer>
      <RowContainer justify="flex-start">
        <Text style={{ marginBottom: '1rem' }} fontSize={'1.4rem'}>
          You need to unstake pool tokens to be able to withdraw liquidity. You
          still be able to claim rewards in “Your Liquidity” tab.{' '}
        </Text>
      </RowContainer>

      <RowContainer justify="space-between" margin={'3rem 0 2rem 0'}>
        <BlueButton
          style={{ width: '100%', fontFamily: 'Avenir Next Medium' }}
          disabled={false}
          isUserConfident={true}
          theme={theme}
          onClick={() => {
            endFarming({
              wallet,
              connection,
              poolPublicKey: new PublicKey(pool.swapToken),
              userPoolTokenAccount: new PublicKey(userPoolTokenAccount),
              farmingStatePublicKey: new PublicKey(pool.farmingStatePublicKey),
              snapshotQueuePublicKey: new PublicKey(pool.farmingSnapshotQueue),
            })
          }}
        >
          Untake{' '}
        </BlueButton>
      </RowContainer>
    </DialogWrapper>
  )
}
