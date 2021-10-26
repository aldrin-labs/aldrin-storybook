import { stripByAmount } from '@core/utils/chartPageUtils'
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
import { TokenInfo } from '@sb/dexUtils/types'
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
} from '../Staking.styles'
import { RestakePopup } from './RestakePopup'
import { StakingForm } from './StakingForm'
import { sleep } from '../../../../../../core/src/utils/helpers'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { COLORS } from '@variables/variables'
interface UserBalanceProps {
  value: number
  visible: boolean
}

interface StakingInfoProps {
  tokenData: TokenInfo | null
  tokenMint: string
  stakingPool: StakingPool
}

const UserBalance: React.FC<UserBalanceProps> = (props) => {
  const formatted = stripByAmount(props.value)
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
  const { tokenData, tokenMint, stakingPool } = props
  const [isBalancesShowing, setIsBalancesShowing] = useState(true)
  const [isRestakePopupOpen, setIsRestakePopupOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [availableToClaim, setAvailableToClaim] = useState(null)

  const { wallet } = useWallet()
  const connection = useConnection()

  const walletAddress = wallet?.publicKey?.toString() || ''

  const [
    allStakingFarmingTickets,
    refreshAllStakingFarmingTickets,
  ] = useAllStakingTickets({
    wallet,
    connection,
    walletPublicKey: wallet.publicKey,
  })

  const [
    allStakingSnapshotQueues,
    refreshAllStakingSnapshotQueues,
  ] = useStakingSnapshotQueues({
    wallet,
    connection,
  })

  const [allUserAccounts, refreshUserTokens] = useUserTokenAccounts({
    wallet,
    connection,
  })

  const totalStaked = getStakedTokensFromOpenFarmingTickets(
    allStakingFarmingTickets
  )

  const userRewards = calculateUserRewards({
    snapshotsQueues: allStakingSnapshotQueues,
    allStakingFarmingTickets: allStakingFarmingTickets,
  })

  const userAccount = allUserAccounts?.find((_) => _.mint === tokenMint)

  const refreshAll = async () => {
    refreshAllStakingFarmingTickets()
    refreshAllStakingSnapshotQueues()
    refreshUserTokens()
  }

  const start = useCallback(
    async (amount: number) => {
      if (!userAccount?.address) {
        notify({ message: 'Account does not exists' })
        return false
      }

      if (tokenData) {
        setLoading(true)
        await startStaking({
          connection,
          wallet,
          amount,
          userPoolTokenAccount: new PublicKey(userAccount.address),
          stakingPool,
        })

        await sleep(7500)
        refreshAll()
        setLoading(false)
        return true
      }
      return false
    },
    [
      connection,
      wallet,
      userAccount,
      tokenData,
      refreshAllStakingFarmingTickets,
    ]
  )

  const end = async () => {
    if (!userAccount?.address) {
      notify({ message: 'Account does not exists' })
      return false
    }
    setLoading(true)
    await endStaking({
      connection,
      wallet,
      userPoolTokenAccount: new PublicKey(userAccount.address),
      farmingTickets: allStakingFarmingTickets,
      stakingPool,
    })

    await sleep(5000)
    refreshAll()
    setLoading(false)
    return true
  }

  const [
    stakingTicketsWithAvailableToClaim,
    refreshStakingTicketsWithAvailableToClaim,
  ] = useStakingTicketsWithAvailableToClaim({
    wallet,
    connection,
    walletPublicKey: wallet.publicKey,
    stakingPool,
    allStakingFarmingTickets,
  })

  const availableToClaimTotal = calculateAvailableToClaim(
    stakingTicketsWithAvailableToClaim
  )

  return (
    <>
      <BlockContent border>
        <WalletRow>
          <div>
            <StretchedBlock align="center">
              <BlockTitle>Your RIN Staking</BlockTitle>
              <SvgIcon
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
                  <div>
                    <BlockSubtitle>Rewards:</BlockSubtitle>
                    <UserBalance
                      visible={isBalancesShowing}
                      value={userRewards}
                    />
                  </div>
                  <div>
                    <BlockSubtitle>Available to claim:</BlockSubtitle>
                    <UserBalance
                      visible={isBalancesShowing}
                      value={availableToClaimTotal}
                    />
                  </div>
                  <DarkTooltip
                    title={
                      <p>
                        Rewards distribution takes place on the first day of
                        each month, you will be able to claim your reward for
                        this period on{' '}
                        <span style={{ color: COLORS.success }}>
                          27 November 2021.
                        </span>
                      </p>
                    }
                  >
                    <div>
                      <Button
                        disabled={true}
                        backgroundImage={StakeBtn}
                        fontSize="xs"
                        padding="lg"
                        borderRadius="xxl"
                      >
                        Claim
                      </Button>
                    </div>
                  </DarkTooltip>
                </StretchedBlock>
              </BlockContent>
            </RewardsBlock>
          </Cell>
        </Row>
        {tokenData && (
          <StakingForm
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
  const { tokenMint, tokenData, stakingPool } = props
  return (
    <Block>
      <StretchedBlock direction="column">
        <ConnectWalletWrapper>
          <UserStakingInfoContent
            stakingPool={stakingPool}
            tokenData={tokenData}
            tokenMint={tokenMint}
          />
        </ConnectWalletWrapper>
      </StretchedBlock>
    </Block>
  )
}
