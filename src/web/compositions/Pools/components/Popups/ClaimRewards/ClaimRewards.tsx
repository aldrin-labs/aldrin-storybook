import React, { useState } from 'react'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Theme } from '@material-ui/core'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BoldHeader, StyledPaper } from '../index.styles'
import { Text } from '@sb/compositions/Addressbook/index'

import SvgIcon from '@sb/components/SvgIcon'
import Close from '@icons/closeIcon.svg'

import { Button } from '../../Tables/index.styles'
import { PoolInfo, PoolWithOperation } from '@sb/compositions/Pools/index.types'

import { useWallet } from '@sb/dexUtils/wallet'
import { useConnection } from '@sb/dexUtils/connection'
import { notify } from '@sb/dexUtils/notifications'
import { RefreshFunction, TokenInfo } from '@sb/dexUtils/types'
import { withdrawFarmed } from '@sb/dexUtils/pools/withdrawFarmed'
import { FarmingTicket, SnapshotQueue } from '@sb/dexUtils/common/types'

export const ClaimRewards = ({
  theme,
  open,
  selectedPool,
  allTokensData,
  farmingTicketsMap,
  snapshotQueues,
  close,
  refreshTokensWithFarmingTickets,
  setPoolWaitingForUpdateAfterOperation,
}: {
  theme: Theme
  open: boolean
  selectedPool: PoolInfo
  allTokensData: TokenInfo[]
  farmingTicketsMap: Map<string, FarmingTicket[]>
  snapshotQueues: SnapshotQueue[]
  close: () => void
  refreshTokensWithFarmingTickets: RefreshFunction
  setPoolWaitingForUpdateAfterOperation: (data: PoolWithOperation) => void
}) => {
  const { wallet } = useWallet()
  const connection = useConnection()
  const farmingTickets = farmingTicketsMap.get(selectedPool.swapToken) || []

  const [operationLoading, setOperationLoading] = useState(false)

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
        <BoldHeader>Important Message</BoldHeader>
        <SvgIcon style={{ cursor: 'pointer' }} onClick={close} src={Close} />
      </RowContainer>
      <RowContainer justify="flex-start">
        <Text style={{ marginBottom: '1rem' }} fontSize={'1.4rem'}>
        You will need to confirm several transactions in your wallet. One for each day since the last claim.
        </Text>
      </RowContainer>

      <RowContainer justify="space-between" margin={'3rem 0 2rem 0'}>
        <Button
          style={{ width: '100%', fontFamily: 'Avenir Next Medium' }}
          disabled={false}
          isUserConfident={true}
          theme={theme}
          showLoader={operationLoading}
          onClick={async () => {
            // loader in popup button
            setOperationLoading(true)
            // loader in table button
            setPoolWaitingForUpdateAfterOperation({
              pool: selectedPool.swapToken,
              operation: 'claim',
            })

            const clearPoolWaitingForUpdate = () =>
              setPoolWaitingForUpdateAfterOperation({
                pool: '',
                operation: '',
              })

            try {
              const result = await withdrawFarmed({
                wallet,
                connection,
                pool: selectedPool,
                allTokensData,
                farmingTickets,
                snapshotQueues,
              })

              notify({
                type: result === 'success' ? 'success' : 'error',
                message:
                  result === 'success'
                    ? 'Successfully claimed rewards.'
                    : result === 'failed'
                    ? 'Claim rewards failed, please try again later or contact us in telegram.'
                    : 'Claim rewards cancelled.',
              })

              if (result !== 'success') {
                clearPoolWaitingForUpdate()
              } else {
                setTimeout(async () => {
                  refreshTokensWithFarmingTickets()
                  clearPoolWaitingForUpdate()
                }, 7500)

                setTimeout(() => refreshTokensWithFarmingTickets(), 15000)
              }
            } catch (e) {
              clearPoolWaitingForUpdate()

              return
            }

            close()
          }}
        >
          Ok, Got It
        </Button>
      </RowContainer>
    </DialogWrapper>
  )
}
