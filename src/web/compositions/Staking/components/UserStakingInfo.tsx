import { stripByAmount } from '@core/utils/chartPageUtils'
import StakeBtn from '@icons/stakeBtn.png'
import { SvgIcon } from '@sb/components'
import {
  Block,
  BlockContent,
  BlockSubtitle,
  BlockTitle
} from '@sb/components/Block'
import { Button } from '@sb/components/Button'
import { ConnectWalletWrapper } from '@sb/components/ConnectWalletWrapper'
import { Input } from '@sb/components/Input'
import { Cell, Row, StretchedBlock } from '@sb/components/Layout'
import { getStakedTokensFromOpenFarmingTickets } from '@sb/dexUtils/common/getStakedTokensFromOpenFarmingTickets'
import { useConnection } from '@sb/dexUtils/connection'
import { notify } from '@sb/dexUtils/notifications'
import { calculateUserRewards } from '@sb/dexUtils/staking/calculateUserRewards'
import { endStaking } from '@sb/dexUtils/staking/endStaking'
import { startStaking } from '@sb/dexUtils/staking/startStaking'
import { useAllStakingTickets } from '@sb/dexUtils/staking/useAllStakingTickets'
import { useStakingSnapshotQueues } from '@sb/dexUtils/staking/useStakingSnapshotQueues'
import { TokenInfo } from '@sb/dexUtils/types'
import { useUserTokenAccounts } from '@sb/dexUtils/useUserTokenAccounts'
import { useWallet } from '@sb/dexUtils/wallet'
import { PublicKey } from '@solana/web3.js'
import React, { useState } from 'react'
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
  WalletRow
} from '../Staking.styles'
import { RestakePopup } from './RestakePopup'


interface UserBalanceProps {
  value: number
  visible: boolean
}

interface StakingInfoProps {
  tokenData: TokenInfo | null
  tokenMint: string
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
  const { tokenData, tokenMint } = props
  const [userInput, setUserInput] = useState(0)
  const [isBalancesShowing, setIsBalancesShowing] = useState(true)
  const [isRestakePopupOpen, setIsRestakePopupOpen] = useState(false)

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

  const setAmount = (v: string) => {
    const newValue = parseFloat(v)
    if (Number.isNaN(newValue)) {
      return false
    }
    setUserInput(newValue)
    return true
  }

  const [allUserAccounts] = useUserTokenAccounts({ wallet, connection })

  const totalStaked = getStakedTokensFromOpenFarmingTickets(
    allStakingFarmingTickets
  ) / Math.pow(10, tokenData?.decimals || 0)

  const [allStakingSnapshotQueues, refresh] = useStakingSnapshotQueues({
    wallet,
    connection,
  })

  const userRewards = calculateUserRewards({
    snapshotsQueues: allStakingSnapshotQueues,
    allStakingFarmingTickets: allStakingFarmingTickets,
  })



  const userAccount = allUserAccounts?.find((_) => _.mint === tokenMint)
  console.log('userAccount: ', userAccount)

  const start = async () => {

    if (!userAccount?.address) {
      notify({ message: 'Account does not exists' })
      return false
    }
    if (tokenData) {
      await startStaking({
        connection,
        wallet,
        amount: 100,
        userPoolTokenAccount: new PublicKey(userAccount.address),
        tokenData,
      })
    }
  }

  const end = async () => {
    if (!userAccount?.address) {
      notify({ message: 'Account does not exists' })
      return false
    }
    await endStaking({
      connection,
      wallet,
      userPoolTokenAccount: new PublicKey(userAccount.address),
    })
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
                    {/* <UserBalance
                      visible={isBalancesShowing}
                      value={userRewards}
                    /> */}
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

        <FormWrap>
          <FormItem>
            <Input
              placeholder="Enter amount..."
              value={`${userInput}`}
              onChange={setAmount}
              append="RIN"
            />
          </FormItem>
          <FormItem>
            <Button
              onClick={() => {
                // setIsRestakePopupOpen(true)
                start()
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
  const { tokenMint, tokenData } = props
  return (
    <Block>
      <StretchedBlock direction="column">
        <ConnectWalletWrapper>
          <UserStakingInfoContent tokenData={tokenData} tokenMint={tokenMint} />
        </ConnectWalletWrapper>
      </StretchedBlock>
    </Block>
  )
}
