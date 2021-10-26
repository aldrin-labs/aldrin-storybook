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
import { Input, INPUT_FORMATTERS } from '@sb/components/Input'
import { Cell, Row, StretchedBlock } from '@sb/components/Layout'
import { getStakedTokensFromOpenFarmingTickets } from '@sb/dexUtils/common/getStakedTokensFromOpenFarmingTickets'
import { useConnection } from '@sb/dexUtils/connection'
import { notify } from '@sb/dexUtils/notifications'
import { addAmountsToClaimForFarmingTickets } from '@sb/dexUtils/pools/addAmountsToClaimForFarmingTickets'
import { STAKING_PROGRAM_ADDRESS } from '@sb/dexUtils/ProgramsMultiton/utils'
import { calculateUserRewards } from '@sb/dexUtils/staking/calculateUserRewards'
import { endStaking } from '@sb/dexUtils/staking/endStaking'
import { startStaking } from '@sb/dexUtils/staking/startStaking'
import { StakingPool } from '@sb/dexUtils/staking/types'
import { useAllStakingTickets } from '@sb/dexUtils/staking/useAllStakingTickets'
import { useStakingSnapshotQueues } from '@sb/dexUtils/staking/useStakingSnapshotQueues'
import { TokenInfo } from '@sb/dexUtils/types'
import { useUserTokenAccounts } from '@sb/dexUtils/useUserTokenAccounts'
import { useWallet } from '@sb/dexUtils/wallet'
import { PublicKey } from '@solana/web3.js'
import React, { useEffect, useState, useCallback } from 'react'
import { ImagesPath } from '../../Chart/components/Inputs/Inputs.utils'
import {
  Asterisks,
  BalanceRow,
  BalanceWrap,
  Digit,
  FormItem,
  FormWrap,
  RewardsBlock,
  StyledTextDiv,
  TotalStakedBlock,
  WalletBalanceBlock,
  WalletRow,
} from '../Staking.styles'
import { RestakePopup } from './RestakePopup'
import { useFormik } from 'formik'

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

  const [allUserAccounts] = useUserTokenAccounts({ wallet, connection })

  const totalStaked =
    getStakedTokensFromOpenFarmingTickets(allStakingFarmingTickets) /
    Math.pow(10, tokenData?.decimals || 0)

  const userRewards = calculateUserRewards({
    snapshotsQueues: allStakingSnapshotQueues,
    allStakingFarmingTickets: allStakingFarmingTickets,
  })


  const userAccount = allUserAccounts?.find((_) => _.mint === tokenMint)

  // const parsedStakingPool = {
  //   swapToken: stakingPool?.swapToken,
  //   poolToken: stakingPool?.poolTokenMint,
  //   poolSigner: stakingPool?.poolSigner,
  //   stakingVault: stakingPool?.stakingVault,
  //   farming: stakingPool?.farming,
  // }

  useEffect(() => {
    const getAvailableToClaim = async () => {
      const availableToClaim = await addAmountsToClaimForFarmingTickets({
        pools: [stakingPool],
        wallet,
        connection,
        allUserFarmingTickets: allStakingFarmingTickets,
        programAddress: STAKING_PROGRAM_ADDRESS,
      })
      console.log('availableToClaim', availableToClaim)
      setAvailableToClaim(availableToClaim)
    }
    getAvailableToClaim()
  }, [])

  // console.log('RERENDER: ', connection, wallet, userAccount?.address)

  const start = useCallback(async (amount: number) => {
    console.log('start cb:', userAccount)
    if (!userAccount?.address) {
      notify({ message: 'Account does not exists' })
      return false
    }
    if (tokenData) {
      await startStaking({
        connection,
        wallet,
        amount: amount * Math.pow(10, tokenData.decimals),
        userPoolTokenAccount: new PublicKey(userAccount.address),
      })
      return true
    }
    return false
  }, [connection, wallet, userAccount, tokenData]) 

  const form = useFormik({
    initialValues: {
      amount: `${tokenData?.amount || 0}`
    },
    onSubmit: (values) => {
      console.log('SUBMIT:', start)
      start(parseFloat(values.amount))
    }
  })

  const end = async () => {
    if (!userAccount?.address) {
      notify({ message: 'Account does not exists' })
      return false
    }
    await endStaking({
      connection,
      wallet,
      userPoolTokenAccount: new PublicKey(userAccount.address),
      farmingTickets: allStakingFarmingTickets,
      stakingPool,
    })
    return true
  }
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
              {isBalancesShowing ? walletAddress : '＊＊＊'}
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
                    <UserBalance visible={isBalancesShowing} value={400} />
                  </div>
                  <div>
                    <Button
                      backgroundImage={StakeBtn}
                      fontSize="xs"
                      padding="lg"
                      borderRadius="xxl"
                    >
                      Claim
                    </Button>
                  </div>
                </StretchedBlock>
              </BlockContent>
            </RewardsBlock>
          </Cell>
        </Row>

        <FormWrap onSubmit={form.handleSubmit}>
          <FormItem>
            <Input
              placeholder="Enter amount..."
              value={form.values.amount}
              onChange={(v) => form.setFieldValue('amount', v)}
              name="amount"
              append="RIN"
              formatter={INPUT_FORMATTERS.DECIMAL}
            />
          </FormItem>
          <FormItem>
            <Button
              onClick={() => {
                form.submitForm()
              }}
              backgroundImage={StakeBtn}
              fontSize="xs"
              padding="lg"
              borderRadius="xxl"
            >
              Stake
            </Button>
          </FormItem>
          <FormItem>
            <Button
              backgroundImage={StakeBtn}
              fontSize="xs"
              padding="lg"
              borderRadius="xxl"
              disabled={totalStaked === 0}
              onClick={() => end()}
              type="button"
            >
              Unstake all
            </Button>
          </FormItem>
        </FormWrap>
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
