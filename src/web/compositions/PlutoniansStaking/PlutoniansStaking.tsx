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
  Column,
} from '@sb/components/Layout'
import { ProgressBar } from '@sb/components/ProgressBarBlock/ProgressBar'
import { Radio } from '@sb/components/RadioButton/RadioButton'
import { InlineText } from '@sb/components/Typography'
import { useConnection } from '@sb/dexUtils/connection'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
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
import { PU238_TOKEN_MINT } from '@core/solana'
import {
  stripByAmount,
  stripByAmountAndFormat,
} from '@core/utils/chartPageUtils'
import { DAY, YEAR, estimateTime } from '@core/utils/dateUtils'

import ClockIcon from '@icons/clock.svg'
import InfoIcon from '@icons/infoIcon.svg'

import { ConnectWalletWrapper } from '../../components/ConnectWalletWrapper'
import { DarkTooltip } from '../../components/TooltipCustom/Tooltip'
import { InputWrapper } from '../RinStaking/styles'
import { NumberWithLabel } from '../Staking/components/NumberWithLabel/NumberWithLabel'
import Lock from '../Staking/components/PlutoniansStaking/lock.svg'
import { ContentBlock } from '../Staking/styles'
import Plutonians from './assets/plutoniansMock.png'
import { RewardsComponent } from './components/RewardsComponent/RewardsComponent'
import { RewardDescription } from './components/RewardsComponent/styles'
import {
  REWARDS_BG,
  REWARD_TOKEN_MULTIPLIER,
  REWARD_APR_DENOMINATOR,
  EXTRA_REWARDS,
  PLD_DENOMINATOR,
  NFT_REWARD_MIN_STAKE_AMOUNT,
  NFT_REWARD_MIN_STAKE_AMOUNT_BN,
  PLD_DECIMALS,
} from './config'
import {
  AdaptiveStakingBlock,
  AprWrap,
  Content,
  FormContainer,
  ModeContainer,
  RewardContentBlock,
  StakingContainer,
} from './styles'
import { PlutoniansBlockProps } from './types'

const ONE = new BN(1)

const Block: React.FC<PlutoniansBlockProps> = (props) => {
  const {
    getDexTokensPricesQuery: { getDexTokensPrices: prices = [] },
  } = props

  const { wallet } = useWallet()
  const connection = useConnection()
  // const [isRewardsUnlocked, setIsRewardsUnlocked] = useState(true)

  const [selectedTierIndex, setSelectedTierIndex] = useState(0) // TODO: rewrite with real keys

  const [tokenAccounts, refreshTokenAccounts] = useUserTokenAccounts()

  const { data: stakingPool, mutate: updatePools } = usePlutoniansStaking()

  // const rewardTokenMint = stakingPool?.rewardTokenMint.toString() || ''
  const stakeTokenMint = stakingPool?.stakeTokenMint.toString() || ''

  const pu238TokenName = getTokenNameByMintAddress(PU238_TOKEN_MINT)
  // const rewardTokenName = getTokenNameByMintAddress(rewardTokenMint)
  const stakeTokenName = getTokenNameByMintAddress(stakeTokenMint)

  const rewardPrice =
    (prices.find((dp) => dp.symbol === pu238TokenName)?.price || 0) *
    REWARD_TOKEN_MULTIPLIER

  const stakeTokenPrice =
    prices.find((dp) => dp.symbol === stakeTokenName)?.price || 0

  const selectedTokenAccount = tokenAccounts.find(
    (ta) => ta.mint === stakingPool?.stakeTokenMint.toString()
  )

  const { data: stakingAccounts, mutate: updateStakeAccounts } =
    useSrinStakingAccounts()

  const tiers = stakingPool?.tiers.slice(0, 4).reverse() || []

  const selectedTier = tiers[selectedTierIndex]
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
      const refreshAllResult = await refreshAll()
      console.log('refreshAllResult: ', refreshAllResult)
      setLoading(false)
    } catch (e) {
      console.warn('Unable to stake PLD:', e)
      notify({ message: 'Something went wrong' })
      await refreshAll()
      setLoading(false)
    }
  }

  const apr =
    (parseInt(selectedTier?.account.apr.toString() || '0', 10) /
      REWARD_APR_DENOMINATOR) *
    100

  const lockDuration = selectedTier?.account.lockDuration || ONE
  const unlockDate =
    stakeAccountForTier?.account.depositedAt.add(lockDuration).toNumber() || 0

  const timePassed =
    Date.now() / 1000 -
    (stakeAccountForTier?.account.depositedAt.toNumber() || 0)

  const timeLeft = Math.max(0, unlockDate - Date.now() / 1000)

  const estimate = estimateTime(timeLeft)

  const isStakingDisabled =
    loading ||
    !(parseFloat(amount) > 0) ||
    !selectedTokenAccount ||
    timeLeft > 0

  const timeProgresss = timePassed / lockDuration.toNumber()

  const estimateRewardsInStakeTokens =
    selectedTier && stakeAccountForTier
      ? (((parseInt(selectedTier.account.apr.toString(), 10) *
          selectedTier.account.lockDuration.toNumber()) /
          REWARD_APR_DENOMINATOR /
          YEAR) *
          parseFloat(stakeAccountForTier.account.amount.toString())) /
        PLD_DENOMINATOR
      : 0

  const rewardsUsdValue = estimateRewardsInStakeTokens * stakeTokenPrice

  const estimateRewardsInPu =
    rewardPrice === 0 ? '-' : rewardsUsdValue / rewardPrice

  return (
    <Page>
      <Content>
        <FlexBlock alignItems="center" direction="column">
          <StakingContainer>
            {tiers.map((tier, idx) => {
              const tierReward = tier.account.nftRewardGroupsData
                .map(
                  (nft) =>
                    `${nft.account.quantity > 1 ? nft.account.quantity : ''} ${
                      nft.account.name
                    }`
                )
                .join(' + ')

              const stakingAccount = stakingAccounts?.get(
                tier.publicKey.toString()
              )

              const currentTierLockDuration = tier?.account.lockDuration || ONE

              const unlockTime =
                stakingAccount?.account.depositedAt
                  .add(currentTierLockDuration)
                  .toNumber() || 0

              const timeLeftUntillUnlock = Math.max(
                0,
                unlockTime - Date.now() / 1000
              )

              const estimateTimeForTiar = estimateTime(timeLeftUntillUnlock)

              const currentTierTimePassed =
                Date.now() / 1000 -
                (stakingAccount?.account.depositedAt.toNumber() || 0)

              const currentTierTimeProgress =
                currentTierTimePassed / currentTierLockDuration.toNumber()

              const stakedAmount =
                stakingAccount?.account.amount.toNumber() /
                  10 ** PLD_DECIMALS || '--'

              return (
                <ModeContainer
                  $bg={isStaked ? null : REWARDS_BG[idx]}
                  // eslint-disable-next-line react/no-array-index-key
                  key={`tier_${tier.publicKey.toString()}`}
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
                        label={
                          stakingAccount
                            ? `${stripByAmountAndFormat(stakedAmount)} PLD`
                            : `${
                                (parseInt(
                                  tier?.account.apr.toString() || '0',
                                  10
                                ) /
                                  REWARD_APR_DENOMINATOR) *
                                100
                              }% APR ${tierReward ? '+ NFT' : ''} `
                        }
                      />
                    </AprWrap>
                  </FlexBlock>
                  {stakingAccount ? (
                    <ProgressBar
                      background={COLORS.newBlack}
                      width={`${currentTierTimeProgress * 100}%`}
                      padding="0.5em"
                    >
                      {isRewardsUnlocked ? (
                        'Unlocked!'
                      ) : (
                        <>
                          {estimateTimeForTiar.days &&
                            `${estimateTimeForTiar.days}d `}
                          {estimateTimeForTiar.hours &&
                            `${estimateTimeForTiar.hours}h `}
                          {estimateTimeForTiar.minutes &&
                            `${estimateTimeForTiar.minutes}m `}
                        </>
                      )}
                    </ProgressBar>
                  ) : (
                    <InlineText size="sm" weight={600}>
                      {EXTRA_REWARDS[idx]}
                    </InlineText>
                  )}
                </ModeContainer>
              )
            })}
          </StakingContainer>

          <StakingContainer>
            <AdaptiveStakingBlock>
              <FormContainer direction="column" justifyContent="center">
                {isStaked ? (
                  <ProgressBar width={`${timeProgresss * 100}%`}>
                    {isRewardsUnlocked ? (
                      'Unlocked!'
                    ) : (
                      <>
                        {estimate.days && `${estimate.days}d `}
                        {estimate.hours && `${estimate.hours}h `}
                        {estimate.minutes && `${estimate.minutes}m `}
                        <InlineText weight={400}> Left to unlock</InlineText>
                      </>
                    )}
                  </ProgressBar>
                ) : (
                  <ContentBlock
                    style={{ alignItems: isStaked ? 'flex-start' : 'center' }}
                  >
                    <InlineText size="sm">
                      You have to stake at least {NFT_REWARD_MIN_STAKE_AMOUNT}{' '}
                      PLD to be eligible for Aldrin Skin NFT drop.
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
                              APR
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
                            style={{ margin: '2rem 0 0 0', height: '42px' }}
                            align="center"
                            width="xl"
                          >
                            {parseFloat(amount) >
                            NFT_REWARD_MIN_STAKE_AMOUNT ? (
                              <>
                                <InlineText
                                  color="newGreen"
                                  size="lg"
                                  weight={700}
                                >
                                  Eligible
                                </InlineText>
                                <RewardDescription size="sm" weight={600}>
                                  {EXTRA_REWARDS[selectedTierIndex]}
                                </RewardDescription>
                              </>
                            ) : (
                              <Column>
                                <InlineText
                                  color="newGreen"
                                  size="md"
                                  weight={700}
                                >
                                  Stake more than {NFT_REWARD_MIN_STAKE_AMOUNT}{' '}
                                  PLD
                                </InlineText>
                                <InlineText size="sm">
                                  to get {EXTRA_REWARDS[selectedTierIndex]}
                                </InlineText>
                              </Column>
                            )}
                          </StretchedBlock>
                        </RewardContentBlock>
                      </Cell>
                    </Row>
                  </>
                ) : (
                  <StretchedBlock width="xl">
                    <ContentBlock width="48%">
                      <StretchedBlock width="xl">
                        <DarkTooltip title="Your actual rewards depend on the market price of the PLD and PU238 at the time of claiming and their projection may change dynamically over time during the lockup period.">
                          <FlexBlock alignItems="center">
                            <InlineText color="primaryGray" size="sm">
                              Est. Rewards
                            </InlineText>
                            &nbsp;
                            <SvgIcon
                              src={InfoIcon}
                              width="12px"
                              height="12px"
                            />
                          </FlexBlock>
                        </DarkTooltip>
                      </StretchedBlock>
                      <InlineText
                        style={{ margin: '1rem 0' }}
                        color="newGreen"
                        size="lg"
                        weight={700}
                      >
                        {stripByAmountAndFormat(estimateRewardsInPu, 2)}
                      </InlineText>
                      <StretchedBlock align="center" width="xl">
                        <InlineText size="sm" weight={600}>
                          ${' '}
                          {rewardsUsdValue
                            ? stripByAmountAndFormat(rewardsUsdValue, 2)
                            : '-'}
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
                            {EXTRA_REWARDS[selectedTierIndex]}
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
                        {stakeAccountForTier.account.amount.gt(
                          NFT_REWARD_MIN_STAKE_AMOUNT_BN
                        ) ? (
                          <>
                            <StretchedBlock
                              style={{ margin: '3rem 0 0 0' }}
                              align="flex-start"
                              width="xl"
                            >
                              <RewardDescription size="sm" weight={600}>
                                {EXTRA_REWARDS[selectedTierIndex]}
                              </RewardDescription>
                            </StretchedBlock>
                          </>
                        ) : (
                          <>
                            <InlineText color="newGreen" size="md" weight={700}>
                              Stake more than {NFT_REWARD_MIN_STAKE_AMOUNT} PLD
                            </InlineText>
                          </>
                        )}
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
                      $loading={loading}
                      style={{
                        fontWeight: '500',
                        padding: '1em',
                      }}
                    >
                      <SvgIcon
                        style={{ margin: '0 5px' }}
                        width="12px"
                        height="12px"
                        src={ClockIcon}
                      />
                      Unstake{' '}
                      {parseFloat(
                        stakeAccountForTier?.account.amount.toString()
                      ) / PLD_DENOMINATOR}{' '}
                      PLD and Claim Rewards
                    </Button>
                  ) : (
                    <Button
                      onClick={stake}
                      $width="xl"
                      $fontSize="sm"
                      disabled={isStakingDisabled}
                      $loading={loading}
                      style={{
                        fontWeight: '600',
                        padding: '1em',
                      }}
                    >
                      Stake
                    </Button>
                  )}
                </ConnectWalletWrapper>
              </FormContainer>
            </AdaptiveStakingBlock>
          </StakingContainer>
        </FlexBlock>
        s{' '}
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
