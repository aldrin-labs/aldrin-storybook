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
import { Input } from '@sb/components/Input'
import { Cell, Row, StretchedBlock } from '@sb/components/Layout'
import { getStakedTokensFromOpenFarmingTickets } from '@sb/dexUtils/common/getStakedTokensFromOpenFarmingTickets'
import { useConnection } from '@sb/dexUtils/connection'
import { addAmountsToClaimForFarmingTickets } from '@sb/dexUtils/pools/addAmountsToClaimForFarmingTickets'
import { ProgramsMultiton } from '@sb/dexUtils/ProgramsMultiton/ProgramsMultiton'
import { STAKING_PROGRAM_ADDRESS } from '@sb/dexUtils/ProgramsMultiton/utils'
import { calculateUserRewards } from '@sb/dexUtils/staking/calculateUserRewards'
import { loadAccountsFromStakingProgram } from '@sb/dexUtils/staking/loadAccountsFromStakingProgram'
import { useAllFarmingStates } from '@sb/dexUtils/staking/useAllFarmingStates'
import { useAllStakingTickets } from '@sb/dexUtils/staking/useAllStakingTickets'
import { useStakingSnapshotQueues } from '@sb/dexUtils/staking/useStakingSnapshotQueues'
import { useUserTokenAccounts } from '@sb/dexUtils/useUserTokenAccounts'
import { RIN_MINT } from '@sb/dexUtils/utils'
import { useWallet } from '@sb/dexUtils/wallet'
import React, { useEffect, useState } from 'react'
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

interface UserBalanceProps {
  value: number
  visible: boolean
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

const UserStakingInfoContent: React.FC = () => {
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
    // walletPublicKey: wallet.publicKey,
  })

  const totalStaked = getStakedTokensFromOpenFarmingTickets(
    allStakingFarmingTickets
  )
  const setAmount = (v: string) => {
    const newValue = parseFloat(v)
    if (Number.isNaN(newValue)) {
      return false
    }
    setUserInput(newValue)
    return true
  }

  const [allTokensData] = useUserTokenAccounts({ wallet, connection })
  const tokenData = allTokensData?.find((token) => token.mint === RIN_MINT)
  const [
    allStakingSnapshotQueues,
    refreshAllStakingSnapshotQueues,
  ] = useStakingSnapshotQueues({
    wallet,
    connection,
  })

  const userRewards = calculateUserRewards({
    snapshotsQueues: allStakingSnapshotQueues,
    allStakingFarmingTickets: allStakingFarmingTickets,
  })

  const [allStakingStates, refresh] = useAllFarmingStates({
    wallet,
    connection,
  })
  
  useEffect(() => {
    const a = async () => {
      const pool = await loadAccountsFromStakingProgram({
        connection,
        filters: [
          {
            dataSize: 137,
          },
        ],
      })

      const program = ProgramsMultiton.getProgramByAddress({
        wallet,
        connection,
        programAddress: STAKING_PROGRAM_ADDRESS,
      })

      const stakingPool = pool[0]

      const data = Buffer.from(stakingPool.account.data)
      const poolData = program.coder.accounts.decode('StakingPool', data)

      const parsedStakingPool = {
        swapToken: stakingPool.pubkey.toString(),
        poolToken: poolData.poolMint,
        poolSigner: poolData.poolSigner,
        stakingVault: poolData.stakingVault,
        farming: allStakingStates,
      }

      console.log({
        parsedStakingPool,
      })

      const availableToClaim = await addAmountsToClaimForFarmingTickets({
        pools: [parsedStakingPool],
        wallet,
        connection,
        allUserFarmingTickets: allStakingFarmingTickets,
        programAddress: STAKING_PROGRAM_ADDRESS,
      })

      console.log('availableToClaim', availableToClaim)
    }

    a()
  }, [allStakingStates.length])

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
                setIsRestakePopupOpen(true)
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
              disabled
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

export const UserStakingInfo = () => {
  return (
    <Block>
      <StretchedBlock direction="column">
        <ConnectWalletWrapper>
          <UserStakingInfoContent />
        </ConnectWalletWrapper>
      </StretchedBlock>
    </Block>
  )
}
