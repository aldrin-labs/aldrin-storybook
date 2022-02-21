import { COLORS, FONT_SIZES } from '@variables/variables'
import React, { useState } from 'react'

import { SvgIcon } from '@sb/components'
import { AmountInput } from '@sb/components/AmountInput'
import { Button } from '@sb/components/Button'
import { FlexBlock, Page, StretchedBlock } from '@sb/components/Layout'
import { ProgressBar } from '@sb/components/ProgressBarBlock/ProgressBar'
import { Radio } from '@sb/components/RadioButton/RadioButton'
import { InlineText } from '@sb/components/Typography'

import InfoIcon from '@icons/info.svg'

import {
  usePlutoniansStaking,
  useSrinStakingAccounts,
} from '../../dexUtils/staking/hooks'
import { InputWrapper } from '../RinStaking/styles'
import { NumberWithLabel } from '../Staking/components/NumberWithLabel/NumberWithLabel'
import Lock from '../Staking/components/PlutoniansStaking/lock.svg'
import { ContentBlock } from '../Staking/styles'
import Plutonians from './assets/plutoniansMock.png'
import Venator from './assets/Venator.png'
import { RewardsComponent } from './components/RewardsComponent/RewardsComponent'
import { AdaptiveStakingBlock, ModeContainer, StakingContainer } from './styles'

const EXTRA_REWARDS = [
  ' Aldrin Skin + 2 components',
  'Aldrin Skin + 4 components',
  ' Venator + Aldrin Skin + 4 components',
  ' Star Hunter + Aldrin Skin + 4 components + 1 exotic component',
]

export const PlutoniansStaking = () => {
  const [isRewardsUnlocked, setIsRewardsUnlocked] = useState(false)

  const [selectedTierIndex, setSelectedTierIndex] = useState(0) // TODO: rewrite with real keys

  const { data: stakingPool } = usePlutoniansStaking()
  const { data: stakingAccounts } = useSrinStakingAccounts()

  const selectedTier = stakingPool?.tiers[selectedTierIndex]
  const stakeAccountForTier = stakingAccounts.get(
    selectedTier?.publicKey.toString(0)
  )

  const isStaked = !!stakeAccountForTier

  return (
    <Page>
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <FlexBlock alignItems="center" direction="column">
          <StakingContainer>
            {EXTRA_REWARDS.map((tierReward, idx) => {
              const tier = stakingPool?.tiers[idx]
              return (
                <ModeContainer
                  // eslint-disable-next-line react/no-array-index-key
                  key={`tier_${idx}`}
                  checked={selectedTierIndex === idx}
                  height="25rem"
                  onClick={() => setSelectedTierIndex(idx)}
                  backgroundColor={COLORS.cardsBack}
                >
                  <FlexBlock direction="column">
                    <StretchedBlock
                      style={{ margin: '0 0 2rem 0' }}
                      align="center"
                    >
                      <InlineText size="md" weight={700}>
                        <SvgIcon src={Lock} alt="locked" />{' '}
                        {tier?.account.lockDuration.toString()} Days
                      </InlineText>{' '}
                      <Radio
                        checked={selectedTierIndex === idx}
                        change={() => setSelectedTierIndex(idx)}
                      />
                    </StretchedBlock>{' '}
                    <NumberWithLabel
                      size={FONT_SIZES.es}
                      value={null}
                      label={`${tier?.account.apr.toString()}% APR + NFT`}
                    />
                  </FlexBlock>
                  <InlineText
                    style={{
                      position: 'absolute',
                      bottom: '3rem',
                      width: '70%',
                    }}
                    size="sm"
                    weight={600}
                  >
                    {tierReward}
                  </InlineText>
                  <img
                    className="aldrinSkin"
                    src={Venator}
                    alt="aldrin skin"
                    width="100%"
                    height="auto"
                  />
                </ModeContainer>
              )
            })}
          </StakingContainer>
          <StakingContainer style={{ margin: '1em 0 0 0' }}>
            <AdaptiveStakingBlock style={{ width: '100%' }}>
              <FlexBlock direction="column" style={{ padding: '1em' }}>
                {isStaked ? (
                  <ProgressBar width={isRewardsUnlocked ? '100%' : '50%'}>
                    {isRewardsUnlocked ? (
                      'Unlocked!'
                    ) : (
                      <>
                        {' '}
                        25d 21h 39m{' '}
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
                      value="0"
                      onChange={() => {}}
                    />
                  </InputWrapper>
                )}
                {!isStaked ? (
                  <StretchedBlock width="xl">
                    <ContentBlock
                      style={{ background: 'rgba(38, 159, 19, 10%)' }}
                      width="48%"
                    >
                      <StretchedBlock width="xl">
                        <InlineText color="primaryGray" size="sm">
                          APY
                        </InlineText>{' '}
                        <SvgIcon src={InfoIcon} width="12px" height="12px" />
                      </StretchedBlock>
                      <StretchedBlock
                        style={{ margin: '3rem 0 0 0' }}
                        align="center"
                        width="xl"
                      >
                        <InlineText color="newGreen" size="lg" weight={700}>
                          7 %
                        </InlineText>
                        <InlineText size="md" weight={600}>
                          PU238
                        </InlineText>
                      </StretchedBlock>
                    </ContentBlock>{' '}
                    <ContentBlock
                      style={{ background: 'rgba(38, 159, 19, 10%)' }}
                      width="48%"
                    >
                      <StretchedBlock width="xl">
                        <InlineText color="primaryGray" size="sm">
                          NFT
                        </InlineText>{' '}
                        <SvgIcon src={InfoIcon} width="12px" height="12px" />
                      </StretchedBlock>
                      <StretchedBlock
                        style={{ margin: '3rem 0 0 0' }}
                        align="center"
                        width="xl"
                      >
                        <InlineText color="newGreen" size="lg" weight={700}>
                          Eligible
                        </InlineText>
                        <InlineText size="sm" weight={600}>
                          Aldrin Skin + 2 components
                        </InlineText>
                      </StretchedBlock>
                    </ContentBlock>
                  </StretchedBlock>
                ) : (
                  <StretchedBlock width="xl">
                    {' '}
                    <ContentBlock width="48%">
                      <StretchedBlock width="xl">
                        <InlineText color="primaryGray" size="sm">
                          Rewards
                        </InlineText>{' '}
                        <SvgIcon src={InfoIcon} width="12px" height="12px" />
                      </StretchedBlock>
                      <InlineText
                        style={{ margin: '1rem 0' }}
                        color="newGreen"
                        size="lg"
                        weight={700}
                      >
                        24.25{' '}
                      </InlineText>
                      <StretchedBlock align="center" width="xl">
                        <InlineText size="sm" weight={600}>
                          $ 120.24
                        </InlineText>
                        <InlineText size="md" weight={600}>
                          PU238
                        </InlineText>
                      </StretchedBlock>
                    </ContentBlock>{' '}
                    {isRewardsUnlocked ? (
                      <RewardsComponent imgSrc={Plutonians}>
                        <StretchedBlock style={{ padding: '1.3em 1em' }}>
                          <InlineText weight={700} size="sm">
                            Aldrin Skin + 2 components
                          </InlineText>
                        </StretchedBlock>
                      </RewardsComponent>
                    ) : (
                      <ContentBlock width="48%">
                        <StretchedBlock width="xl">
                          <InlineText color="primaryGray" size="sm">
                            NFT
                          </InlineText>{' '}
                          <SvgIcon src={InfoIcon} width="12px" height="12px" />
                        </StretchedBlock>
                        <StretchedBlock
                          style={{ margin: '3rem 0 0 0' }}
                          align="flex-start"
                          width="xl"
                        >
                          <InlineText size="sm" weight={600}>
                            Aldrin Skin + 2 components
                          </InlineText>
                        </StretchedBlock>
                      </ContentBlock>
                    )}
                  </StretchedBlock>
                )}
                <Button
                  $width="xl"
                  $fontSize={isStaked ? 'sm' : 'md'}
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
      </div>
    </Page>
  )
}
