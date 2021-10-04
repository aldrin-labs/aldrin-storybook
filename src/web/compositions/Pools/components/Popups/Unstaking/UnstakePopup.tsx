import React, { useState } from 'react'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Theme } from '@material-ui/core'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BoldHeader, StyledPaper } from '../index.styles'
import { Text } from '@sb/compositions/Addressbook/index'

import SvgIcon from '@sb/components/SvgIcon'

import Close from '@icons/closeIcon.svg'

import { BlueButton } from '@sb/compositions/Chart/components/WarningPopup'
import { getTokenDataByMint } from '@sb/compositions/Pools/utils'
import { PoolInfo } from '@sb/compositions/Pools/index.types'

import { endFarming } from '@sb/dexUtils/pools/endFarming'
import { PublicKey } from '@solana/web3.js'
import { useWallet } from '@sb/dexUtils/wallet'
import { useConnection } from '@sb/dexUtils/connection'
import { notify } from '@sb/dexUtils/notifications'

export const UnstakePopup = ({
  theme,
  open,
  allTokensData,
  pool,
  close,
  refreshAllTokensData,
}: {
  theme: Theme
  open: boolean
  allTokensData: any
  pool: PoolInfo
  close: () => void
  refreshAllTokensData: () => void
}) => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const [operationLoading, setOperationLoading] = useState(false)

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
          showLoader={operationLoading}
          onClick={async () => {
            await setOperationLoading(true)

            const result = await endFarming({
              wallet,
              connection,
              poolPublicKey: new PublicKey(pool.swapToken),
              userPoolTokenAccount: new PublicKey(userPoolTokenAccount),
              farmingStatePublicKey: new PublicKey(pool.farmingStates[0]),
              snapshotQueuePublicKey: new PublicKey(pool.farmingSnapshots[0]),
            })

            await setOperationLoading(false)

            await notify({
              type: result === 'success' ? 'success' : 'error',
              message:
                result === 'success'
                  ? 'Successfully unstaked.'
                  : 'Unstaking cancelled.',
            })

            await refreshAllTokensData()

            await close()
          }}
        >
          Untake
        </BlueButton>
      </RowContainer>
    </DialogWrapper>
  )
}
