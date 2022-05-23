import { Theme, withTheme } from '@material-ui/core'
import { PublicKey } from '@solana/web3.js'
import { COLORS } from '@variables/variables'
import dayjs from 'dayjs'
import React, { useState } from 'react'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import SvgIcon from '@sb/components/SvgIcon'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { WhiteText } from '@sb/components/TraidingTerminal/ConfirmationPopup'
import { TRANSACTION_COMMON_SOL_FEE } from '@sb/components/TraidingTerminal/utils'
import { Text } from '@sb/compositions/Addressbook/index'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { PoolInfo, PoolWithOperation } from '@sb/compositions/Pools/index.types'
import { getTokenDataByMint } from '@sb/compositions/Pools/utils'
import { endStaking } from '@sb/dexUtils/common/actions'
import { FarmingTicket } from '@sb/dexUtils/common/types'
import { useConnection } from '@sb/dexUtils/connection'
import { notify } from '@sb/dexUtils/notifications'
import { UNLOCK_STAKED_AFTER } from '@sb/dexUtils/pools/filterTicketsAvailableForUnstake'
import { getPoolsProgramAddress } from '@sb/dexUtils/ProgramsMultiton'
import { RefreshFunction, TokenInfo } from '@sb/dexUtils/types'
import { useWallet } from '@sb/dexUtils/wallet'

import { filterOpenFarmingTickets } from '@core/solana'

import Close from '@icons/closeIcon.svg'

import { Button } from '../../Tables/index.styles'
import { BoldHeader, StyledPaper } from '../index.styles'

interface UnstakePopupProps {
  theme: Theme
  allTokensData: TokenInfo[]
  selectedPool: PoolInfo
  farmingTicketsMap: Map<string, FarmingTicket[]>
  close: () => void
  refreshTokensWithFarmingTickets: RefreshFunction
  setPoolWaitingForUpdateAfterOperation: (data: PoolWithOperation) => void
}

const Popup: React.FC<UnstakePopupProps> = (props) => {
  const {
    theme,
    allTokensData,
    selectedPool,
    farmingTicketsMap,
    close,
    refreshTokensWithFarmingTickets,
    setPoolWaitingForUpdateAfterOperation,
  } = props
  const { wallet } = useWallet()
  const connection = useConnection()

  const [operationLoading, setOperationLoading] = useState(false)

  const { address: userPoolTokenAccount } = getTokenDataByMint(
    allTokensData,
    selectedPool.poolTokenMint
  )

  const farmingState = selectedPool.farming && selectedPool.farming[0]

  if (!farmingState) return null

  const farmingTickets = farmingTicketsMap.get(selectedPool.swapToken) || []

  const isPoolWithFarming =
    selectedPool.farming && selectedPool.farming.length > 0

  const lastFarmingTicket =
    farmingTickets.length > 0
      ? farmingTickets?.sort((a, b) => +b.startTime - +a.startTime)[0]
      : null

  const unlockAvailableDate =
    lastFarmingTicket && isPoolWithFarming
      ? +lastFarmingTicket.startTime +
        +selectedPool.farming[0].periodLength +
        UNLOCK_STAKED_AFTER
      : 0

  const isUnstakeLocked = unlockAvailableDate > Date.now() / 1000
  const isUnstakeDisabled =
    isUnstakeLocked ||
    filterOpenFarmingTickets(farmingTickets).length === 0 ||
    operationLoading

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={close}
      onEnter={() => {}}
      maxWidth="md"
      open
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer justify="space-between" width="100%">
        <BoldHeader>Unstake Pool Tokens</BoldHeader>
        <SvgIcon style={{ cursor: 'pointer' }} onClick={close} src={Close} />
      </RowContainer>
      <RowContainer justify="flex-start">
        <Text style={{ marginBottom: '1rem' }} fontSize="1.4rem">
          You need to unstake pool tokens to be able to withdraw liquidity. You
          still be able to claim rewards in “Your Liquidity” tab.{' '}
        </Text>
      </RowContainer>

      <RowContainer justify="space-between" margin="2rem 0 0 0">
        <WhiteText>Gas Fees</WhiteText>
        <WhiteText
          style={{
            color: COLORS.success,
          }}
        >
          {TRANSACTION_COMMON_SOL_FEE} SOL
        </WhiteText>
      </RowContainer>

      <RowContainer justify="space-between" margin="3rem 0 2rem 0">
        <DarkTooltip
          title={
            isUnstakeLocked
              ? `Until ${dayjs
                  .unix(unlockAvailableDate)
                  .format('HH:mm:ss MMM DD, YYYY')}`
              : null
          }
        >
          <div style={{ width: '100%', cursor: 'help' }}>
            <Button
              style={{ width: '100%', fontFamily: 'Avenir Next Medium' }}
              disabled={isUnstakeDisabled}
              isUserConfident
              theme={theme}
              showLoader={operationLoading}
              onClick={async () => {
                // loader in popup button
                setOperationLoading(true)
                // loader in table button
                setPoolWaitingForUpdateAfterOperation({
                  pool: selectedPool.swapToken,
                  operation: 'unstake',
                })

                const result = await endStaking({
                  wallet,
                  userPoolTokenAccount: userPoolTokenAccount
                    ? new PublicKey(userPoolTokenAccount)
                    : undefined,
                  stakingPool: selectedPool,
                  farmingTickets,
                  programAddress: getPoolsProgramAddress({
                    curveType: selectedPool.curveType,
                  }),
                  connection,
                })

                setOperationLoading(false)

                notify({
                  type: result === 'success' ? 'success' : 'error',
                  message:
                    result === 'success'
                      ? 'Successfully unstaked.'
                      : result === 'failed'
                      ? 'Unstaking failed, please try again later or contact us in telegram.'
                      : 'Unstaking cancelled.',
                })

                const clearPoolWaitingForUpdate = () =>
                  setPoolWaitingForUpdateAfterOperation({
                    pool: '',
                    operation: '',
                  })

                if (result === 'success') {
                  refreshTokensWithFarmingTickets()
                  clearPoolWaitingForUpdate()
                  close()
                } else {
                  clearPoolWaitingForUpdate()
                  close()
                }
              }}
            >
              {isUnstakeLocked ? 'Locked' : 'Unstake'}
            </Button>
          </div>
        </DarkTooltip>
      </RowContainer>
    </DialogWrapper>
  )
}

export const UnstakePopup = withTheme()(Popup)
