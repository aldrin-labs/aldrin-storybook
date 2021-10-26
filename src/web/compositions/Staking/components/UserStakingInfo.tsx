import { stripByAmount, stripByAmountAndFormat } from '@core/utils/chartPageUtils'
import StakeBtn from '@icons/stakeBtn.png'
import { SvgIcon } from '@sb/components'
import {
  Block,
  BlockContent,
  BlockSubtitle,
  BlockTitle,
} from '@sb/components/Block'
import { Button } from '@sb/components/Button'
import { ConnectWalletWrapper } from '@sb/components/ConnectWalletWrapper'
import { Cell, Row, StretchedBlock } from '@sb/components/Layout'
import { getStakedTokensFromOpenFarmingTickets } from '@sb/dexUtils/common/getStakedTokensFromOpenFarmingTickets'
import { useConnection } from '@sb/dexUtils/connection'
import { notify } from '@sb/dexUtils/notifications'
import { addAmountsToClaimForFarmingTickets } from '@sb/dexUtils/pools/addAmountsToClaimForFarmingTickets'
import { STAKING_PROGRAM_ADDRESS } from '@sb/dexUtils/ProgramsMultiton/utils'
import { calculateAvailableToClaim } from '@sb/dexUtils/staking/calculateAvailableToClaim'
import { calculateUserRewards } from '@sb/dexUtils/staking/calculateUserRewards'
import { endStaking } from '@sb/dexUtils/staking/endStaking'
import { startStaking } from '@sb/dexUtils/staking/startStaking'
import { StakingPool } from '@sb/dexUtils/staking/types'
import { useAllStakingTickets } from '@sb/dexUtils/staking/useAllStakingTickets'
import { useStakingSnapshotQueues } from '@sb/dexUtils/staking/useStakingSnapshotQueues'
import { useStakingTicketsWithAvailableToClaim } from '@sb/dexUtils/staking/useStakingTicketsWithAvailableToClaim'
import { RefreshFunction, TokenInfo } from '@sb/dexUtils/types'
import { useUserTokenAccounts } from '@sb/dexUtils/useUserTokenAccounts'
import { useWallet } from '@sb/dexUtils/wallet'
import { PublicKey } from '@solana/web3.js'
import React, { useCallback, useEffect, useState } from 'react'
import { ImagesPath } from '../../Chart/components/Inputs/Inputs.utils'
import {
  Asterisks,
  BalanceRow,
  BalanceWrap,
  Digit,
  RewardsBlock,
  StyledTextDiv,
  TotalStakedBlock,
  WalletBalanceBlock,
  WalletRow,
  ClaimButtonContainer,
} from '../Staking.styles'
import { RestakePopup } from './RestakePopup'
import { StakingForm } from './StakingForm'
import { sleep } from '@core/utils/helpers'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { COLORS } from '@variables/variables'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import { getCurrentFarmingStateFromAll } from '@sb/dexUtils/staking/getCurrentFarmingStateFromAll'
import { FarmingTicket } from '@sb/dexUtils/common/types'
import { filterFarmingTicketsByUserKey } from '@sb/dexUtils/staking/filterFarmingTicketsByUserKey'

interface UserBalanceProps {
  value: number
  visible: boolean
  decimals?: number
}

interface StakingInfoProps {
  tokenData: TokenInfo | undefined
  tokenMint: string
  stakingPool: StakingPool
  refreshAllTokenData: RefreshFunction
  allStakingFarmingTickets: FarmingTicket[]
  refreshAllStakingFarmingTickets: RefreshFunction
}

const UserBalance: React.FC<UserBalanceProps> = (props) => {
  const { decimals, value } = props
  const formatted = decimals
    ? stripDigitPlaces(value, decimals)
    : stripByAmountAndFormat(props.value)
  const len = `${formatted}`.length
  let asterisks = ''
  for (let i = 0; i < len; i++) {
    asterisks += '*'
  }
  return (
    <BalanceRow>
      <Digit>
        {props.visible ? formatted : <Asterisks>{asterisks}</Asterisks>}
      </Digit>
      &nbsp;RIN
    </BalanceRow>
  )
}

const UserStakingInfoContent: React.FC<StakingInfoProps> = (props) => {
  const {
    tokenData,
    tokenMint,
    stakingPool,
    refreshAllTokenData,
    allStakingFarmingTickets,
    refreshAllStakingFarmingTickets,
  } = props
  const [isBalancesShowing, setIsBalancesShowing] = useState(true)
  const [isRestakePopupOpen, setIsRestakePopupOpen] = useState(false)
  const [loading, setLoading] = useState({ stake: false, unstake: false })

  const { wallet } = useWallet()
  const connection = useConnection()

  const walletAddress = wallet?.publicKey?.toString() || ''

  const userFarmingTickets = filterFarmingTicketsByUserKey({
    allFarmingTickets: allStakingFarmingTickets,
    walletPublicKey: wallet.publicKey,
  })

  const [
    allStakingSnapshotQueues,
    refreshAllStakingSnapshotQueues,
  ] = useStakingSnapshotQueues({
    wallet,
    connection,
  })

  const totalStaked = getStakedTokensFromOpenFarmingTickets(userFarmingTickets)

  const userRewards = calculateUserRewards({
    snapshotsQueues: allStakingSnapshotQueues,
    allStakingFarmingTickets: userFarmingTickets,
  })

  const refreshAll = async () => {
    await Promise.all([
      refreshAllStakingFarmingTickets(),
      refreshAllStakingSnapshotQueues(),
      refreshAllTokenData(),
    ])
  }

  const start = useCallback(
    async (amount: number) => {
      if (!tokenData?.address) {
        notify({ message: 'Account does not exists' })
        return false
      }

      setLoading({ stake: true, unstake: false })
      const result = await startStaking({
        connection,
        wallet,
        amount,
        userPoolTokenAccount: new PublicKey(tokenData.address),
        stakingPool,
      })

      notify({
        type: result === 'success' ? 'success' : 'error',
        message:
          result === 'success'
            ? 'Successfully staked.'
            : result === 'failed'
            ? 'Staking failed, please try again later or contact us in telegram.'
            : 'Staking cancelled.',
      })

      if (result === 'success') {
        await sleep(7500)
        await refreshAll()
      }

      setLoading({ stake: false, unstake: false })
      return true
    },
    [connection, wallet, tokenData, refreshAllStakingFarmingTickets]
  )

  const end = async () => {
    if (!tokenData?.address) {
      notify({ message: 'Create RIN token account please.' })
      return false
    }

    setLoading({ stake: false, unstake: true })

    const result = await endStaking({
      connection,
      wallet,
      userPoolTokenAccount: new PublicKey(tokenData.address),
      farmingTickets: userFarmingTickets,
      stakingPool,
    })

    notify({
      type: result === 'success' ? 'success' : 'error',
      message:
        result === 'success'
          ? 'Successfully unstaked.'
          : result === 'failed'
          ? 'Unstaking failed, please try again later or contact us in telegram.'
          : 'Unstaking cancelled.',
    })

    if (result === 'success') {
      await sleep(5000)
      await refreshAll()
    }

    setLoading({ stake: false, unstake: false })
    return true
  }

  const [
    stakingTicketsWithAvailableToClaim,
  ] = useStakingTicketsWithAvailableToClaim({
    wallet,
    connection,
    walletPublicKey: wallet.publicKey,
    stakingPool,
    allStakingFarmingTickets: userFarmingTickets,
  })

  const availableToClaimTotal = calculateAvailableToClaim(
    stakingTicketsWithAvailableToClaim
  )

  const lastFarmingTicket = userFarmingTickets.sort(
    (ticketA, ticketB) => +ticketB.startTime - +ticketA.startTime
  )[0]

  const currentFarmingState = getCurrentFarmingStateFromAll(stakingPool.farming)

  const unlockAvailableDate = lastFarmingTicket
    ? +lastFarmingTicket.startTime + +currentFarmingState?.periodLength
    : 0

  const isUnstakeLocked = unlockAvailableDate > Date.now() / 1000

  return (
    <>
      <BlockContent border>
        <WalletRow>
          <div>
            <StretchedBlock align="center">
              <BlockTitle>Your RIN Staking</BlockTitle>
              <SvgIcon
                style={{ cursor: 'pointer' }}
                src={isBalancesShowing ? ImagesPath.eye : ImagesPath.closedEye}
                width={'1.5em'}
                height={'auto'}
                onClick={() => {
                  setIsBalancesShowing(!isBalancesShowing)
                }}
              />
            </StretchedBlock>
            <StyledTextDiv>
              {isBalancesShowing ? walletAddress : '***'}
            </StyledTextDiv>
          </div>
          <WalletBalanceBlock>
            <BlockSubtitle>Available in wallet:</BlockSubtitle>
            <BalanceWrap>
              <UserBalance
                visible={isBalancesShowing}
                value={tokenData?.amount || 0}
              />
            </BalanceWrap>
          </WalletBalanceBlock>
        </WalletRow>
      </BlockContent>
      <BlockContent>
        <Row>
          <Cell colMd={4} colLg={12} colXl={4}>
            <TotalStakedBlock inner>
              <BlockContent>
                <BlockSubtitle>Total staked:</BlockSubtitle>
                <UserBalance visible={isBalancesShowing} value={totalStaked} />
              </BlockContent>
            </TotalStakedBlock>
          </Cell>
          <Cell colMd={8} colLg={12} colXl={8}>
            <RewardsBlock inner>
              <BlockContent>
                <StretchedBlock>
                  <DarkTooltip title={`${stripByAmount(userRewards)} RIN`}>
                    <div>
                      <BlockSubtitle>Rewards:</BlockSubtitle>
                      <UserBalance
                        visible={isBalancesShowing}
                        value={userRewards}
                        decimals={3}
                      />
                    </div>
                  </DarkTooltip>

                  <div>
                    <BlockSubtitle>Available to claim:</BlockSubtitle>
                    <UserBalance
                      visible={isBalancesShowing}
                      value={availableToClaimTotal}
                    />
                  </div>

                  <ClaimButtonContainer>
                    <DarkTooltip
                      title={
                        <>
                          <p>
                            Rewards distribution takes place on the first day of
                            each month, you will be able to claim your reward
                            for this period on{' '}
                            <span style={{ color: COLORS.success }}>
                              27 November 2021.
                            </span>
                          </p>
                        </>
                      }
                    >
                      <span>
                        <Button
                          variant={'disabled'}
                          fontSize="xs"
                          padding="lg"
                          borderRadius="xxl"
                        >
                          Claim
                        </Button>
                      </span>
                    </DarkTooltip>
                    <Button fontSize="xs" padding="lg" variant="link" disabled>
                      Restake
                    </Button>
                  </ClaimButtonContainer>
                </StretchedBlock>
              </BlockContent>
            </RewardsBlock>
          </Cell>
        </Row>
        {tokenData && (
          <StakingForm
            isUnstakeLocked={isUnstakeLocked}
            unlockAvailableDate={unlockAvailableDate}
            tokenData={tokenData}
            totalStaked={totalStaked}
            start={start}
            end={end}
            loading={loading}
          />
        )}
      </BlockContent>
      <RestakePopup
        open={isRestakePopupOpen}
        close={() => setIsRestakePopupOpen(false)}
      />
    </>
  )
}

export const UserStakingInfo: React.FC<StakingInfoProps> = (props) => {
  const {
    tokenMint,
    tokenData,
    stakingPool,
    refreshAllTokenData,
    allStakingFarmingTickets,
    refreshAllStakingFarmingTickets,
  } = props
  return (
    <Block>
      <StretchedBlock direction="column">
        <ConnectWalletWrapper>
          <UserStakingInfoContent
            stakingPool={stakingPool}
            tokenData={tokenData}
            tokenMint={tokenMint}
            refreshAllTokenData={refreshAllTokenData}
            allStakingFarmingTickets={allStakingFarmingTickets}
            refreshAllStakingFarmingTickets={refreshAllStakingFarmingTickets}
          />
        </ConnectWalletWrapper>
      </StretchedBlock>
    </Block>
  )
}
