import { PublicKey } from '@solana/web3.js'
import { COLORS, FONT_SIZES } from '@variables/variables'
import { BN } from 'bn.js'
import React, { useState } from 'react'

import { SvgIcon } from '@sb/components'
import { AmountInput } from '@sb/components/AmountInput'
import { Button } from '@sb/components/Button'
import {
  FlexBlock,
  Page,
  StretchedBlock,
  Row,
  Cell,
} from '@sb/components/Layout'
import { ProgressBar } from '@sb/components/ProgressBarBlock/ProgressBar'
import { Radio } from '@sb/components/RadioButton/RadioButton'
import { InlineText } from '@sb/components/Typography'
import { useConnection } from '@sb/dexUtils/connection'
import { notify } from '@sb/dexUtils/notifications'
import { startSrinStaking } from '@sb/dexUtils/staking/actions'
import {
  useSrinStakingAccounts,
  usePlutoniansStaking,
} from '@sb/dexUtils/staking/hooks'
import { useUserTokenAccounts } from '@sb/dexUtils/token/hooks'
import { useWallet } from '@sb/dexUtils/wallet'

import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getDexTokensPrices } from '@core/graphql/queries/pools/getDexTokensPrices'
import { stripByAmount } from '@core/utils/chartPageUtils'
import { DAY } from '@core/utils/dateUtils'

import { ConnectWalletWrapper } from '../../components/ConnectWalletWrapper'
import { InputWrapper } from '../RinStaking/styles'
import { NumberWithLabel } from '../Staking/components/NumberWithLabel/NumberWithLabel'
import Lock from '../Staking/components/PlutoniansStaking/lock.svg'
import { ContentBlock } from '../Staking/styles'
import Plutonians from './assets/plutoniansMock.png'
import { RewardsComponent } from './components/RewardsComponent/RewardsComponent'
import { RewardDescription } from './components/RewardsComponent/styles'
import {
  REWARDS_BG,
  REWARD_TOKEN_NAME,
  REWARD_TOKEN_MULTIPLIER,
  REWARD_APR_DENOMINATOR,
  EXTRA_REWARDS,
} from './config'
import {
  AdaptiveStakingBlock,
  AprWrap,
  Content,
  ModeContainer,
  RewardContentBlock,
  StakingContainer,
} from './styles'
import { PlutoniansBlockProps } from './types'

const Block: React.FC<PlutoniansBlockProps> = (props) => {
  const {
    getDexTokensPricesQuery: { getDexTokensPrices: prices = [] },
  } = props

  const prcPrice =
    (prices.find((dp) => dp.symbol === REWARD_TOKEN_NAME)?.price || 0) *
    REWARD_TOKEN_MULTIPLIER

  const { wallet } = useWallet()
  const connection = useConnection()
  // const [isRewardsUnlocked, setIsRewardsUnlocked] = useState(true)

  const [selectedTierIndex, setSelectedTierIndex] = useState(0) // TODO: rewrite with real keys

  const [tokenAccounts, refreshTokenAccounts] = useUserTokenAccounts()

  const { data: stakingPool, mutate: updatePools } = usePlutoniansStaking()

  const selectedTokenAccount = tokenAccounts.find(
    (ta) => ta.mint === stakingPool?.stakeTokenMint.toString()
  )

  console.log('stakingPool: ', stakingPool)

  const { data: stakingAccounts, mutate: updateStakeAccounts } =
    useSrinStakingAccounts()

  const selectedTier = stakingPool?.tiers[selectedTierIndex]
  const stakeAccountForTier = stakingAccounts?.get(
    selectedTier?.publicKey.toString() || ''
  )

  const isStaked = !!stakeAccountForTier

  const isRewardsUnlocked =
    selectedTier && stakeAccountForTier
      ? stakeAccountForTier.account.depositedAt
          .add(selectedTier.account.lockDuration)
          .ltn(Date.now())
      : false

  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  // useEffect(() => {
  //   if (!selectedTokenAccount) {
  //     const rewardsMint = stakingPool?.rewardTokenMint.toString()
  //     const sta = tokenAccounts.find((ta) => ta.mint === rewardsMint)
  //     setSelectedTokenAccount(sta)
  //   }
  // }, [tokenAccounts, stakingPool])

  const refreshAll = () =>
    Promise.all([updatePools(), updateStakeAccounts(), refreshTokenAccounts()])

  const stake = async () => {
    if (!selectedTokenAccount) {
      throw new Error('No tokens for stake!')
    }
    if (!stakingPool) {
      throw new Error('No stakingPool!')
    }

    if (!selectedTier) {
      throw new Error('No tier selected!')
    }

    const depositAmount = new BN(
      (parseFloat(amount) * 10 ** selectedTokenAccount.decimals).toFixed(0)
    )
    try {
      setLoading(true)
      console.log('DATA: ', {
        wallet,
        connection,
        amount: depositAmount,
        stakingPool: stakingPool.stakingPool,
        stakingTier: selectedTier.publicKey,
      })
      const result = await startSrinStaking({
        wallet,
        connection,
        amount: depositAmount,
        stakingPool: stakingPool.stakingPool,
        stakingTier: selectedTier.publicKey,
        userStakeTokenaccount: new PublicKey(selectedTokenAccount.address),
        poolStakeTokenaccount: stakingPool.stakeTokenaccount,
      })
      notify({
        message: result === 'success' ? 'Succesfully staked' : 'Staking failed',
      })
      await refreshAll()
      setLoading(false)
    } catch (e) {
      console.warn('Unable to stake PLD:', e)
      notify({ message: 'Something went wrong' })
      setLoading(false)
    }
  }

  const isStakingDisabled =
    loading || !(parseFloat(amount) > 0) || !selectedTokenAccount

  console.log(
    'isStakingDisabled: ',
    isStakingDisabled,
    stakingPool?.stakeTokenMint.toString()
  )
  const apr =
    (parseInt(selectedTier?.account.apr.toString() || '0', 10) /
      REWARD_APR_DENOMINATOR) *
    100

  return (
    <Page>
      <Content>
        <FlexBlock alignItems="center" direction="column">
          <StakingContainer>
            {(stakingPool?.tiers || []).slice(0, 4).map((tier, idx) => {
              const tierReward = tier.account.nftRewardGroupsData
                .map(
                  (nft) =>
                    `${nft.account.quantity > 1 ? nft.account.quantity : ''} ${
                      nft.account.name
                    }`
                )
                .join(' + ')
              return (
                <ModeContainer
                  $bg={REWARDS_BG[idx]}
                  // eslint-disable-next-line react/no-array-index-key
                  key={`tier_${idx}`}
                  checked={selectedTierIndex === idx}
                  onClick={() => setSelectedTierIndex(idx)}
                  backgroundColor={COLORS.cardsBack}
                >
                  <FlexBlock direction="column">
                    <StretchedBlock align="center">
                      <FlexBlock alignItems="center">
                        <SvgIcon src={Lock} alt="locked" />
                        <InlineText size="md" weight={700}>
                          &nbsp;
                          {tier?.account.lockDuration.divn(DAY).toString()} Days
                        </InlineText>
                      </FlexBlock>
                      <Radio
                        checked={selectedTierIndex === idx}
                        change={() => setSelectedTierIndex(idx)}
                      />
                    </StretchedBlock>
                    <AprWrap>
                      <NumberWithLabel
                        size={FONT_SIZES.es}
                        value={null}
                        label={`${
                          (parseInt(tier?.account.apr.toString() || '0', 10) /
                            REWARD_APR_DENOMINATOR) *
                          100
                        }% APR ${tierReward ? '+ NFT' : ''} `}
                      />
                    </AprWrap>
                  </FlexBlock>
                  {/* {tierReward && (
                    <InlineText size="sm" weight={600}>
                      {EXTRA_REWARDS[idx]}
                    </InlineText>
                  )} */}
                  <InlineText size="sm" weight={600}>
                    {/* {tierReward} */}
                    {EXTRA_REWARDS[idx]}
                  </InlineText>
                </ModeContainer>
              )
            })}
          </StakingContainer>

          <StakingContainer>
            <AdaptiveStakingBlock>
              <FlexBlock direction="column" style={{ padding: '1em' }}>
                {isStaked ? (
                  <ProgressBar width={isRewardsUnlocked ? '100%' : '50%'}>
                    {isRewardsUnlocked ? (
                      'Unlocked!'
                    ) : (
                      <>
                        25d 21h 39m
                        <InlineText weight={400}>Left to unlock</InlineText>
                      </>
                    )}
                  </ProgressBar>
                ) : (
                  <ContentBlock
                    style={{ alignItems: isStaked ? 'flex-start' : 'center' }}
                  >
                    <InlineText size="sm">
                      You have to stake at least 1000 PLD to be eligible for
                      Aldrin Skin NFT drop.
                    </InlineText>
                  </ContentBlock>
                )}

                {!isStaked ? (
                  <>
                    <InputWrapper style={{ width: '100%' }}>
                      <AmountInput
                        label="Stake"
                        placeholder="0"
                        amount={selectedTokenAccount?.amount || 0}
                        mint={stakingPool?.stakeTokenMint.toString() || ''}
                        name="amount"
                        value={amount}
                        onChange={setAmount}
                      />
                    </InputWrapper>
                    <Row>
                      <Cell col={12} colMd={6}>
                        <RewardContentBlock>
                          <StretchedBlock width="xl">
                            <InlineText color="primaryGray" size="sm">
                              APY
                            </InlineText>
                            {/* <SvgIcon src={InfoIcon} width="12px" height="12px" /> */}
                          </StretchedBlock>
                          <StretchedBlock
                            style={{ margin: '3rem 0 0 0' }}
                            align="center"
                            width="xl"
                          >
                            <InlineText color="newGreen" size="lg" weight={700}>
                              {stripByAmount(apr, 2)} %
                            </InlineText>
                            <RewardDescription size="md" weight={600}>
                              PU238
                            </RewardDescription>
                          </StretchedBlock>
                        </RewardContentBlock>
                      </Cell>
                      <Cell col={12} colMd={6}>
                        <RewardContentBlock last>
                          <StretchedBlock width="xl">
                            <InlineText color="primaryGray" size="sm">
                              NFT
                            </InlineText>
                            {/* <SvgIcon src={InfoIcon} width="12px" height="12px" /> */}
                          </StretchedBlock>
                          <StretchedBlock
                            style={{ margin: '3rem 0 0 0' }}
                            align="center"
                            width="xl"
                          >
                            <InlineText color="newGreen" size="lg" weight={700}>
                              Eligible
                            </InlineText>
                            <RewardDescription size="sm" weight={600}>
                              Aldrin Skin + 2 components
                            </RewardDescription>
                          </StretchedBlock>
                        </RewardContentBlock>
                      </Cell>
                    </Row>
                  </>
                ) : (
                  <StretchedBlock width="xl">
                    <ContentBlock width="48%">
                      <StretchedBlock width="xl">
                        <InlineText color="primaryGray" size="sm">
                          Rewards
                        </InlineText>
                        {/* <SvgIcon src={InfoIcon} width="12px" height="12px" /> */}
                      </StretchedBlock>
                      <InlineText
                        style={{ margin: '1rem 0' }}
                        color="newGreen"
                        size="lg"
                        weight={700}
                      >
                        24.25
                      </InlineText>
                      <StretchedBlock align="center" width="xl">
                        <InlineText size="sm" weight={600}>
                          $ 120.24
                        </InlineText>
                        <RewardDescription size="md" weight={600}>
                          PU238
                        </RewardDescription>
                      </StretchedBlock>
                    </ContentBlock>
                    {isRewardsUnlocked ? (
                      <RewardsComponent imgSrc={Plutonians}>
                        <StretchedBlock style={{ padding: '1.3em 1em' }}>
                          <RewardDescription weight={700} size="sm">
                            Aldrin Skin + 2 components3
                          </RewardDescription>
                        </StretchedBlock>
                      </RewardsComponent>
                    ) : (
                      <ContentBlock width="48%">
                        <StretchedBlock width="xl">
                          <InlineText color="primaryGray" size="sm">
                            NFT
                          </InlineText>
                          {/* <SvgIcon src={InfoIcon} width="12px" height="12px" /> */}
                        </StretchedBlock>
                        <StretchedBlock
                          style={{ margin: '3rem 0 0 0' }}
                          align="flex-start"
                          width="xl"
                        >
                          <RewardDescription size="sm" weight={600}>
                            Aldrin Skin + 2 components2
                          </RewardDescription>
                        </StretchedBlock>
                      </ContentBlock>
                    )}
                  </StretchedBlock>
                )}
                <ConnectWalletWrapper size="button-only">
                  {isStaked ? (
                    <Button
                      $width="xl"
                      $fontSize="sm"
                      disabled={isStakingDisabled}
                      style={{
                        fontWeight: '500',
                        padding: '1em',
                        color: COLORS.lightGray,
                      }}
                    >
                      Unstake 10.522 PLD and Claim Rewards &amp; Common Small
                      Fighter
                    </Button>
                  ) : (
                    <Button
                      onClick={stake}
                      $width="xl"
                      $fontSize="md"
                      disabled={isStakingDisabled}
                      style={{
                        fontWeight: '600',
                        padding: '1em',
                        color: COLORS.primaryWhite,
                      }}
                    >
                      Stake
                    </Button>
                  )}
                </ConnectWalletWrapper>
              </FlexBlock>
            </AdaptiveStakingBlock>
          </StakingContainer>
        </FlexBlock>
      </Content>
    </Page>
  )
}

export const PlutoniansStaking = queryRendererHoc({
  query: getDexTokensPrices,
  name: 'getDexTokensPricesQuery',
  fetchPolicy: 'cache-and-network',
  withoutLoading: true,
  pollInterval: 60000,
})(Block)
