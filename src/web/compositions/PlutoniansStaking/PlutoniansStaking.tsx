import { COLORS, FONT_SIZES } from '@variables/variables'
import { BN } from 'bn.js'
import React, { useEffect, useState } from 'react'

import { SvgIcon } from '@sb/components'
import { AmountInput } from '@sb/components/AmountInput'
import { Button } from '@sb/components/Button'
import { FlexBlock, Page, StretchedBlock } from '@sb/components/Layout'
import { ProgressBar } from '@sb/components/ProgressBarBlock/ProgressBar'
import { Radio } from '@sb/components/RadioButton/RadioButton'
import { InlineText } from '@sb/components/Typography'
import { startSrinStaking } from '@sb/dexUtils/staking/actions'

import { getDexTokensPrices } from '@core/graphql/queries/pools/getDexTokensPrices'

import { queryRendererHoc } from '../../../../../core/src/components/QueryRenderer'
import { useConnection } from '../../dexUtils/connection'
import { notify } from '../../dexUtils/notifications'
import { useSrinStakingAccounts } from '../../dexUtils/staking/hooks'
import { useUserTokenAccounts } from '../../dexUtils/token/hooks'
import { TokenInfo } from '../../dexUtils/types'
import { useWallet } from '../../dexUtils/wallet'
import { InputWrapper } from '../RinStaking/styles'
import { NumberWithLabel } from '../Staking/components/NumberWithLabel/NumberWithLabel'
import Lock from '../Staking/components/PlutoniansStaking/lock.svg'
import { ContentBlock } from '../Staking/styles'
import Centuria from './assets/Centuria.png'
import Colossus from './assets/Colossus.png'
import Leviathan from './assets/Leviathan.png'
import Plutonians from './assets/plutoniansMock.png'
import Venator from './assets/Venator.png'
import { RewardsComponent } from './components/RewardsComponent/RewardsComponent'
import { RewardDescription } from './components/RewardsComponent/styles'
import {
  AdaptiveStakingBlock,
  AprWrap,
  Content,
  ModeContainer,
  RewardContentBlock,
  StakingContainer,
} from './styles'

const EXTRA_REWARDS = [
  'Aldrin Skin + 2 components',
  'Aldrin Skin + 4 components',
  'Venator + Aldrin Skin + 4 components',
  'Star Hunter + Aldrin Skin + 4 components + 1 exotic component',
]

const REWARDS_BG = [Centuria, Colossus, Venator, Leviathan]

const Block = () => {
  const { wallet } = useWallet()
  const connection = useConnection()
  const [isRewardsUnlocked, setIsRewardsUnlocked] = useState(true)

  const [selectedTierIndex, setSelectedTierIndex] = useState(0) // TODO: rewrite with real keys

  const [tokenAccounts, refreshTokenAccounts] = useUserTokenAccounts()

  // const { data: stakingPool, mutate: updatePools } = usePlutoniansStaking()

  const stakingPool = undefined
  const { data: stakingAccounts, mutate: updateStakeAccounts } =
    useSrinStakingAccounts()

  const selectedTier = stakingPool?.tiers[selectedTierIndex]
  const stakeAccountForTier = stakingAccounts?.get(
    selectedTier?.publicKey.toString() || ''
  )

  const isStaked = !!stakeAccountForTier

  const [selectedTokenAccount, setSelectedTokenAccount] = useState<
    TokenInfo | undefined
  >()

  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!selectedTokenAccount) {
      const rewardsMint = stakingPool?.rewardTokenMint.toString()
      const sta = tokenAccounts.find((ta) => ta.mint === rewardsMint)
      setSelectedTokenAccount(sta)
    }
  }, [tokenAccounts, stakingPool])

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
      parseFloat(amount) * 10 ** selectedTokenAccount.decimals
    )
    try {
      setLoading(true)
      const result = await startSrinStaking({
        wallet,
        connection,
        amount: depositAmount,
        stakingPool: stakingPool.stakingPool,
        stakingTier: selectedTier.publicKey,
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

  return (
    <Page>
      <Content>
        <FlexBlock alignItems="center" direction="column">
          <StakingContainer>
            {EXTRA_REWARDS.map((tierReward, idx) => {
              const tier = stakingPool?.tiers[idx]
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
                          {tier?.account.lockDuration.toString()} Days
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
                        label={`${tier?.account.apr.toString()}% APR + NFT`}
                      />
                    </AprWrap>
                  </FlexBlock>
                  <InlineText size="sm" weight={600}>
                    {tierReward}
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
                {!isStaked && (
                  <InputWrapper style={{ width: '100%' }}>
                    <AmountInput
                      label="Stake"
                      placeholder="0"
                      amount={0}
                      mint=""
                      name="amount"
                      value={amount}
                      onChange={setAmount}
                    />
                  </InputWrapper>
                )}
                {!isStaked ? (
                  <StretchedBlock width="xl">
                    <RewardContentBlock width="48%">
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
                          7 %
                        </InlineText>
                        <RewardDescription size="md" weight={600}>
                          PU238
                        </RewardDescription>
                      </StretchedBlock>
                    </RewardContentBlock>
                    <RewardContentBlock width="48%">
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
                  </StretchedBlock>
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
                <Button
                  $width="xl"
                  $fontSize={isStaked ? 'sm' : 'md'}
                  disabled={isStakingDisabled}
                  style={{
                    fontWeight: isStaked ? '500' : '600',
                    padding: '1em',
                    color: isStaked ? COLORS.lightGray : COLORS.primaryWhite,
                  }}
                  //   disabled={isStaked}
                >
                  {isStaked
                    ? 'Unstake 10.522 PLD and Claim Rewards & Common Small Fighter'
                    : 'Stake'}
                </Button>
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
