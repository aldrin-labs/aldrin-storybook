import Close from '@icons/closeIcon.svg'
import { Theme } from '@material-ui/core'
import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import SvgIcon from '@sb/components/SvgIcon'
import { Text } from '@sb/compositions/Addressbook/index'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { PoolInfo, PoolWithOperation } from '@sb/compositions/Pools/index.types'
import { RefreshFunction, WalletAdapter } from '@sb/dexUtils/types'
import { Connection } from '@solana/web3.js'
import React, { useState } from 'react'
import { Button } from '../../Tables/index.styles'
import { InputWithCoins } from '../components'
import { BoldHeader, StyledPaper } from '../index.styles'

export const RemindToStakePopup = ({
  theme,
  open,
  allTokensData,
  selectedPool,
  wallet,
  connection,
  maxPoolTokenAmount,
  close,
  refreshTokensWithFarmingTickets,
  setPoolWaitingForUpdateAfterOperation,
}: {
  theme: Theme
  open: boolean
  allTokensData: any
  selectedPool: PoolInfo
  wallet: WalletAdapter
  connection: Connection
  maxPoolTokenAmount: number
  close: () => void
  refreshTokensWithFarmingTickets: RefreshFunction
  setPoolWaitingForUpdateAfterOperation: (data: PoolWithOperation) => void
}) => {
  const [operationLoading, setOperationLoading] = useState(false)
  const [poolTokenAmount, setPoolTokenAmount] = useState<number | string>(
    maxPoolTokenAmount
  )
  const farmingState = selectedPool.farming[0]
  if (!farmingState) return null

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
        <BoldHeader>Don’t forget to stake LP tokens</BoldHeader>
        <SvgIcon style={{ cursor: 'pointer' }} onClick={close} src={Close} />
      </RowContainer>
      <RowContainer justify="flex-start">
        <Text style={{ marginBottom: '1rem' }} fontSize={'1.4rem'}>
          Stake your LP tokens to start framing RIN & MNDE.
        </Text>
      </RowContainer>
      <RowContainer>
        <InputWithCoins
          placeholder={'0'}
          theme={theme}
          onChange={setPoolTokenAmount}
          value={poolTokenAmount}
          symbol={'Pool Tokens'}
          // alreadyInPool={0}
          maxBalance={maxPoolTokenAmount}
          needAlreadyInPool={false}
        />
      </RowContainer>
      <RowContainer justify="space-between" margin={'3rem 0 2rem 0'}>
        <Button
          style={{ width: '100%', fontFamily: 'Avenir Next Medium' }}
          disabled={false}
          isUserConfident={true}
          theme={theme}
          showLoader={operationLoading}
          onClick={() => {}}
        >
          Stake
        </Button>
      </RowContainer>
    </DialogWrapper>
  )
}
