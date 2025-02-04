import { PublicKey } from '@solana/web3.js'
import { COLORS, FONT_SIZES } from '@variables/variables'
import { ProgramAccount } from 'anchor020'
import { BN } from 'bn.js'
import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { SvgIcon } from '@sb/components'
import { AmountInput } from '@sb/components/AmountInput'
import { BlockContent } from '@sb/components/Block'
import { Button } from '@sb/components/Button'
import {
  FlexBlock,
  Page,
  StretchedBlock,
  Row,
  Cell,
  Column,
} from '@sb/components/Layout'
import { Modal } from '@sb/components/Modal'
import { TimeProgressBar } from '@sb/components/ProgressBarBlock/ProgressBar'
import { queryRendererHoc } from '@sb/components/QueryRenderer'
import { Radio } from '@sb/components/RadioButton/RadioButton'
import { InlineText, Text } from '@sb/components/Typography'
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
import { useRegionRestriction } from '@sb/hooks/useRegionRestriction'

import { getDexTokensPrices } from '@core/graphql/queries/pools/getDexTokensPrices'
import { SRinNftRewardGroup } from '@core/solana'
import {
  stripByAmount,
  stripByAmountAndFormat,
} from '@core/utils/chartPageUtils'
import { DAY, YEAR } from '@core/utils/dateUtils'
import { formatNumberToUSFormat } from '@core/utils/PortfolioTableUtils'

import ClockIcon from '@icons/clock.svg'
import InfoIcon from '@icons/infoIcon.svg'

import { ConnectWalletWrapper } from '../../components/ConnectWalletWrapper'
import { DarkTooltip } from '../../components/TooltipCustom/Tooltip'
import { claimSrinNFTs } from '../../dexUtils/staking/actions/claimSrinNFTs'
import { endSrinStaking } from '../../dexUtils/staking/actions/endSrinStaking'
import { useSrinNftReceipts } from '../../dexUtils/staking/hooks/useSrinNftReceipts'
import { InputWrapper } from '../RinStaking/styles'
import { NumberWithLabel } from '../Staking/components/NumberWithLabel/NumberWithLabel'
import Lock from '../Staking/components/PlutoniansStaking/lock.svg'
import { ContentBlock } from '../Staking/styles'
import { SpanContainer } from '../StakingV2/components/Popups/RinStaking/index.styles'
import Plutonians from './assets/plutoniansMock.png'
import { RewardsComponent } from './components/RewardsComponent/RewardsComponent'
import { RewardDescription } from './components/RewardsComponent/styles'
import {
  REWARDS_BG,
  REWARD_TOKEN_MULTIPLIER,
  REWARD_APR_DENOMINATOR,
  PLD_DENOMINATOR,
  PLD_DECIMALS,
  STAKINGS,
} from './config'
import {
  AdaptiveStakingBlock,
  AprWrap,
  Content,
  FormContainer,
  ModeContainer,
  ProgressWrap,
  RewardContentBlock,
  StakingContainer,
  TextBlock,
  UnclaimedTitle,
} from './styles'
import { PlutoniansBlockProps } from './types'

const ONE = new BN(1)

const Block: React.FC<PlutoniansBlockProps> = (props) => {
  const {
    getDexTokensPricesQuery: { getDexTokensPrices: prices = [] },
  } = props

  const params = useParams<{ symbol: string }>()
  const { symbol = 'PLD' } = params
  const staking = STAKINGS[symbol.toUpperCase()] || STAKINGS.PLD
  const isRegionRestricted = useRegionRestriction()

  const { wallet } = useWallet()
  const connection = useConnection()

  const [selectedTierIndex, setSelectedTierIndex] = useState(0) // TODO: rewrite with real keys

  const [tokenAccounts, refreshTokenAccounts] = useUserTokenAccounts()

  const { data: stakingPool, mutate: updatePools } = usePlutoniansStaking(
    staking.stakingPool
  )

  const { data: nftReceipes, mutate: updateReceipts } = useSrinNftReceipts()

  const stakeTokenMint = stakingPool?.stakeTokenMint.toString() || ''
  const rewardTokenMint = stakingPool?.rewardTokenMint.toString() || ''

  const rewardTokenName = getTokenNameByMintAddress(rewardTokenMint)
  const stakeTokenName = getTokenNameByMintAddress(stakeTokenMint)

  const rewardPrice =
    (prices.find((dp) => dp.symbol === rewardTokenName)?.price || 0) *
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

  // const nftReward = selectedTier?.nftRewards
  //   ? selectedTier.nftRewards[0]
  //   : undefined

  // const minStakeTokensForRewardBn = nftReward?.account.minStakeTokensForReward
  const { minStakeTokensForRewardBn, minStakeTokensForReward } = staking

  // const minStakeTokensForReward = parseFloat(
  //   minStakeTokensForRewardBn?.toString() || '0'
  // )

  const stakeAccountForTier = stakingAccounts?.get(
    selectedTier?.publicKey.toString() || ''
  )

  const isStaked = !!stakeAccountForTier

  const isRewardsUnlocked =
    selectedTier && stakeAccountForTier
      ? stakeAccountForTier.account.depositedAt
          .add(selectedTier.account.lockDuration.seconds)
          .toNumber() <
        Date.now() / 1000
      : false

  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [isClaimModalClosed, setClaimModalClosed] = useState(false)

  const refreshAll = () =>
    Promise.all([
      updatePools(),
      updateStakeAccounts(),
      refreshTokenAccounts(),
      updateReceipts(),
    ])

  const reward = useMemo(() => {
    if (nftReceipes && nftReceipes?.length) {
      const receipt = nftReceipes[0]
      const allRewards =
        stakingPool?.tiers
          .map((t) => t.nftRewards)
          .flat()
          .filter((t): t is ProgramAccount<SRinNftRewardGroup> => !!t) || []

      const rewardForReceipt = allRewards.find((r) =>
        r.publicKey.equals(receipt.account.nftReward)
      )

      return rewardForReceipt
    }
    return undefined
  }, [nftReceipes, stakingPool])

  const unclaimedNftCount = reward
    ? reward.account.nfts.reduce((acc, nft) => nft.quantity + acc, 0)
    : 0

  const unstake = async () => {
    setLoading(true)
    if (!stakingPool || !selectedTier || !selectedTier.nftRewards) {
      throw new Error('No stakingPool!')
    }
    if (!stakeAccountForTier) {
      throw new Error('No stakingAccount!')
    }
    try {
      const result = await endSrinStaking({
        wallet,
        connection,
        userTokens: tokenAccounts,
        stakingTier: selectedTier.publicKey,
        nftTierReward: selectedTier.nftRewards[0].publicKey,
        stakingPool,
        stakedAmount: stakeAccountForTier.account.amount,
      })

      await refreshAll()
    } catch (e) {
      console.warn('unstake error', e)
    } finally {
      setLoading(false)
    }
  }

  const v = Math.floor(
    parseFloat(amount || '0') * 10 ** (selectedTokenAccount?.decimals || 0)
  ).toLocaleString('fullwide', { useGrouping: false })

  const depositAmount = new BN(v)

  const notifyNoData = () => {
    notify({
      message: 'No necessary data',
    })
  }

  const claimNft = async () => {
    if (!nftReceipes) {
      notifyNoData()
      return
    }
    const receipt = nftReceipes[0]

    if (!reward || !stakingPool || !receipt) {
      notifyNoData()
      return
    }

    try {
      setLoading(true)
      const result = await claimSrinNFTs({
        wallet,
        connection,
        userNftReceipt: receipt.publicKey,
        stakingPool: stakingPool.stakingPool,
        nftRewardGroup: reward,
      })

      if (result === 'timeout') {
        notify({
          type: 'error',
          message:
            'Could not claim NFTs: confirmation timeout. Please try again later.',
        })
      }
      if (result === 'failed') {
        notify({
          type: 'error',
          message:
            'Could not claim NFTs: something went wrong. Please contact Plutonians support.',
        })
      }
    } catch (e) {
      notify({
        message: 'Something went wrong. Please contact Plutonians support.',
      })
    } finally {
      await refreshAll()
      setClaimModalClosed(true)
      setLoading(false)
    }
  }

  const stake = async () => {
    if (!selectedTokenAccount) {
      notify({
        message: 'No tokens for stake!',
      })
      return
    }
    if (!stakingPool) {
      notify({
        message: 'No staking pool!',
      })
      return
    }

    if (!selectedTier) {
      notify({
        message: 'Please select tier.',
      })
      return
    }

    try {
      setLoading(true)

      const result = await startSrinStaking({
        wallet,
        connection,
        amount: depositAmount,
        stakingPool: stakingPool.stakingPool,
        stakingTier: selectedTier.publicKey,
        userStakeTokenaccount: new PublicKey(selectedTokenAccount.address),
        stakeVault: stakingPool.stakeVault,
      })
      notify({
        message: result === 'success' ? 'Succesfully staked' : 'Staking failed',
      })
      const refreshAllResult = await refreshAll()
      // console.log('refreshAllResult: ', refreshAllResult)
      setLoading(false)
    } catch (e) {
      console.warn(`Unable to stake ${stakeTokenName}`, e)
      notify({ message: 'Something went wrong' })
      await refreshAll()
      setLoading(false)
    }
  }

  const apr =
    (parseInt(selectedTier?.account.apr.permillion.toString() || '0', 10) /
      REWARD_APR_DENOMINATOR) *
    100

  const lockDuration = selectedTier?.account.lockDuration.seconds || ONE
  const unlockDate =
    stakeAccountForTier?.account.depositedAt.add(lockDuration).toNumber() || 0

  // const timePassed =
  //   Date.now() / 1000 -
  //   (stakeAccountForTier?.account.depositedAt.toNumber() || 0)

  const timeLeft = Math.max(0, unlockDate - Date.now() / 1000)

  // const estimate = estimateTime(timeLeft)

  const isStakingDisabled =
    loading ||
    !(parseFloat(amount) > 0) ||
    !selectedTokenAccount ||
    timeLeft > 0 ||
    isRegionRestricted

  const isUnstakeDisabled = loading || !selectedTokenAccount || timeLeft > 0
  // const timeProgresss = timePassed / lockDuration.toNumber()

  const estimateRewardsInStakeTokens =
    selectedTier && stakeAccountForTier
      ? (((parseInt(selectedTier.account.apr.permillion.toString(), 10) *
          selectedTier.account.lockDuration.seconds.toNumber()) /
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
              const tierReward = ''

              const stakingAccount = stakingAccounts?.get(
                tier.publicKey.toString()
              )

              const currentTierLockDuration =
                tier?.account.lockDuration.seconds || ONE

              const stakedAmount =
                (stakingAccount?.account.amount.toNumber() || 0) /
                  10 ** PLD_DECIMALS || '--'

              return (
                <ModeContainer
                  $bg={isStaked ? null : REWARDS_BG[idx]}
                  key={`tier_${tier.publicKey.toString()}`}
                  checked={selectedTierIndex === idx}
                  onClick={() => setSelectedTierIndex(idx)}
                >
                  <FlexBlock direction="column">
                    <StretchedBlock align="center">
                      <FlexBlock alignItems="center">
                        <SvgIcon src={Lock} alt="locked" />
                        <InlineText size="md" weight={700}>
                          &nbsp;
                          {tier?.account.lockDuration.seconds
                            .divn(DAY)
                            .toString()}{' '}
                          Days
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
                            ? `${stripByAmountAndFormat(
                                stakedAmount
                              )} ${stakeTokenName}`
                            : `${
                                (parseInt(
                                  tier?.account.apr.permillion.toString() ||
                                    '0',
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
                    <TimeProgressBar
                      background={COLORS.newBlack}
                      duration={currentTierLockDuration.toNumber()}
                      startTime={
                        stakingAccount?.account.depositedAt.toNumber() || 0
                      }
                      padding="0.5em"
                      finishedText="Unlocked!"
                    />
                  ) : (
                    <InlineText size="sm" weight={600}>
                      {staking.nftRewards[idx]}
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
                  <ProgressWrap>
                    <TimeProgressBar
                      duration={lockDuration.toNumber()}
                      startTime={
                        stakeAccountForTier?.account.depositedAt.toNumber() || 0
                      }
                      finishedText="Unlocked!"
                    />
                  </ProgressWrap>
                ) : (
                  <>
                    <ContentBlock
                      style={{ alignItems: isStaked ? 'flex-start' : 'center' }}
                    >
                      {minStakeTokensForReward ? (
                        <InlineText size="sm">
                          You have to stake at least{' '}
                          {formatNumberToUSFormat(minStakeTokensForReward)}
                          {stakeTokenName} to be eligible for Aldrin Skin NFT
                          drop.
                        </InlineText>
                      ) : (
                        <InlineText size="sm">No NFTs available</InlineText>
                      )}
                    </ContentBlock>
                  </>
                )}

                {!isStaked ? (
                  <>
                    <InputWrapper style={{ width: '100%' }}>
                      <AmountInput
                        data-testid="plutonians-staking-amount-field"
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
                            <InlineText color="gray1" size="sm">
                              APR
                            </InlineText>
                            {/* <SvgIcon src={InfoIcon} width="12px" height="12px" /> */}
                          </StretchedBlock>
                          <StretchedBlock
                            style={{ margin: '3rem 0 0 0' }}
                            align="center"
                            width="xl"
                          >
                            <InlineText color="green3" size="lg" weight={700}>
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
                            <InlineText color="gray1" size="sm">
                              NFT
                            </InlineText>
                            {/* <SvgIcon src={InfoIcon} width="12px" height="12px" /> */}
                          </StretchedBlock>
                          <StretchedBlock
                            style={{ margin: '2rem 0 0 0', height: '42px' }}
                            align="center"
                            width="xl"
                          >
                            {!!minStakeTokensForReward &&
                            minStakeTokensForRewardBn &&
                            depositAmount.gte(minStakeTokensForRewardBn) ? (
                              <>
                                <InlineText
                                  color="newGreen"
                                  size="lg"
                                  weight={700}
                                >
                                  Eligible
                                </InlineText>
                                <RewardDescription size="sm" weight={600}>
                                  {staking.nftRewards[selectedTierIndex]}
                                </RewardDescription>
                              </>
                            ) : (
                              <Column>
                                {minStakeTokensForReward ? (
                                  <>
                                    <InlineText
                                      color="gray0"
                                      size="md"
                                      weight={700}
                                    >
                                      Stake at least{' '}
                                      {formatNumberToUSFormat(
                                        minStakeTokensForReward
                                      )}{' '}
                                      {stakeTokenName}
                                    </InlineText>
                                    <InlineText size="sm">
                                      to get{' '}
                                      {staking.nftRewards[selectedTierIndex]}
                                    </InlineText>
                                  </>
                                ) : (
                                  <>
                                    <InlineText
                                      color="newGreen"
                                      size="lg"
                                      weight={700}
                                      color="white1"
                                    >
                                      No NFTs for that tier
                                    </InlineText>
                                  </>
                                )}
                              </Column>
                            )}
                          </StretchedBlock>
                        </RewardContentBlock>
                      </Cell>
                    </Row>
                  </>
                ) : (
                  <StretchedBlock width="xl">
                    <ContentBlock width="48%" background="PURewardsBackground">
                      <StretchedBlock width="xl">
                        <DarkTooltip
                          title={`Your actual rewards depend on the market price of the ${stakeTokenName} and ${rewardTokenName} at the time of claiming and their projection may change dynamically over time during the lockup period.`}
                        >
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
                          {rewardTokenName}
                        </RewardDescription>
                      </StretchedBlock>
                    </ContentBlock>
                    {isRewardsUnlocked ? (
                      <RewardsComponent imgSrc={Plutonians}>
                        <StretchedBlock style={{ padding: '1.3em 1em' }}>
                          <RewardDescription weight={700} size="sm">
                            {staking.nftRewards[selectedTierIndex]}
                          </RewardDescription>
                        </StretchedBlock>
                      </RewardsComponent>
                    ) : (
                      <ContentBlock
                        width="48%"
                        background="PURewardsBackground"
                      >
                        <StretchedBlock width="xl">
                          <InlineText color="primaryGray" size="sm">
                            NFT
                          </InlineText>
                          {/* <SvgIcon src={InfoIcon} width="12px" height="12px" /> */}
                        </StretchedBlock>
                        {minStakeTokensForRewardBn &&
                        stakeAccountForTier.account.amount.gte(
                          minStakeTokensForRewardBn
                        ) ? (
                          <>
                            <StretchedBlock
                              style={{ margin: '3rem 0 0 0' }}
                              align="flex-start"
                              width="xl"
                            >
                              <RewardDescription size="sm" weight={600}>
                                {staking.nftRewards[selectedTierIndex]}
                              </RewardDescription>
                            </StretchedBlock>
                          </>
                        ) : (
                          <>
                            {minStakeTokensForReward && (
                              <InlineText
                                color="newGreen"
                                size="md"
                                weight={700}
                              >
                                Stake at least{' '}
                                {formatNumberToUSFormat(
                                  minStakeTokensForReward
                                )}{' '}
                                {stakeTokenName}
                              </InlineText>
                            )}
                          </>
                        )}
                      </ContentBlock>
                    )}
                  </StretchedBlock>
                )}
                <ConnectWalletWrapper size="button-only">
                  {isStaked ? (
                    <Button
                      data-testid="plutonians-unstake-submit-btn"
                      $width="xl"
                      $fontSize="sm"
                      disabled={isUnstakeDisabled}
                      $loading={loading}
                      onClick={unstake}
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
                      {formatNumberToUSFormat(
                        parseFloat(
                          stakeAccountForTier?.account.amount.toString()
                        ) / PLD_DENOMINATOR
                      )}{' '}
                      {stakeTokenName} and Claim Rewards
                    </Button>
                  ) : (
                    <DarkTooltip
                      title={
                        wallet.connected && isRegionRestricted
                          ? "Sorry, Aldrin.com doesn't offer its services in your region."
                          : ''
                      }
                    >
                      <SpanContainer>
                        <Button
                          data-testid="plutonians-stake-submit-btn"
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
                      </SpanContainer>
                    </DarkTooltip>
                  )}
                </ConnectWalletWrapper>
              </FormContainer>
            </AdaptiveStakingBlock>
          </StakingContainer>
        </FlexBlock>
        {!!reward && !isClaimModalClosed && (
          <Modal open onClose={() => {}} backdrop="dark">
            <BlockContent>
              <UnclaimedTitle>
                <Text>You have unclaimed rewards.</Text>
              </UnclaimedTitle>
              <TextBlock>
                <Text>{unclaimedNftCount} NFTs could be claimed.</Text>
              </TextBlock>
              <Button minWidth="100%" $loading={loading} onClick={claimNft}>
                Claim NFT
              </Button>
            </BlockContent>
          </Modal>
        )}
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
