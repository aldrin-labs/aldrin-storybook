import { RIN_MINT } from '@core/solana'
import { Button } from '@sb/components/Button'
import { TokenIcon } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'
import { AmountInput } from '@sb/compositions/PoolsV2/components/Inputs'
import { InputContainer } from '@sb/compositions/PoolsV2/components/Inputs/index.styles'
import { RootRow } from '@sb/compositions/PoolsV2/index.styles'
import { useWallet } from '@sb/dexUtils/wallet'
import React, { useState } from 'react'
import { Container } from '../../../../TableRow/index.styles'
import { ValuesContainer } from '../../../DepositLiquidity/DepositContainer'
import { Column, Row } from '../../../index.styles'
import { Header } from '../../components/Header'
import { RationContainer } from '../../components/RationContainer'
import {
  CustomDuration,
  DurationContainer,
  GradientBar,
  InvisibleInput,
  TokenSelectorContainer,
} from '../../index.styles'

const farmingDurations = [
  { value: '14', title: '14 Days' },
  { value: '30', title: '30 Days' },
  { value: '90', title: '90 Days' },
  { value: '365', title: '365 Days' },
]

export const SetupFarming = ({
  onClose,
  setCreationStep,
  creationStep,
}: {
  onClose: () => void
  setCreationStep: (a: string) => void
  creationStep: string
}) => {
  const { wallet } = useWallet()
  const [stepOfSetup, setStepOfSetup] = useState(0)

  return (
    <>
      <Header
        header="Setup Farming"
        description="You will be able to prolong your farming for as long as you like."
        creationStep={creationStep}
        onClose={onClose}
      />

      <Column height="auto" width="100%">
        <Container needBorder height="8.5em" width="100%">
          <Column width="100%">
            <InlineText size="sm" color="white2">
              Select Farming Duration
            </InlineText>
            <Row height="70%" width="100%" margin="0">
              <Column height="100%" width="65%">
                <Row width="100%" margin="0">
                  {farmingDurations.map((duration) => (
                    <DurationContainer>{duration.title}</DurationContainer>
                  ))}
                </Row>
                <Row width="100%" margin="0">
                  <InlineText weight={600} size="sm" color="white1">
                    Flexible
                  </InlineText>
                  <GradientBar />
                  <InlineText weight={600} size="sm" color="white1">
                    Stable
                  </InlineText>
                </Row>
              </Column>
              <CustomDuration width="30%">
                <InlineText color="white2" size="sm">
                  Custom Duration
                </InlineText>
                <RootRow margin="0.3em 0 0 0">
                  <InvisibleInput placeholderColor="white3" placeholder="28" />
                  <InlineText color="white2" size="md" weight={600}>
                    Days
                  </InlineText>
                </RootRow>
              </CustomDuration>
            </Row>
          </Column>
        </Container>
        {stepOfSetup === 0 && (
          <InputContainer>
            <AmountInput
              title="Rewards"
              maxAmount={0}
              amount={0}
              onMaxAmountClick={() => {}}
              disabled={false}
              onChange={() => {}}
              needPadding={false}
              appendComponent={
                <TokenSelectorContainer>
                  <TokenIcon margin="0 5px 0 0" mint={RIN_MINT} />
                  <InlineText color="gray0" size="md" weight={600}>
                    RIN
                  </InlineText>
                </TokenSelectorContainer>
              }
            />
          </InputContainer>
        )}
        {stepOfSetup === 1 && <ValuesContainer />}
        {stepOfSetup === 1 && <RationContainer token={'RIN'} />}
        {stepOfSetup === 0 &&  <RootRow margin="1em 0 0 0">
          <Container height="5em" needBorder width="49%">
            <RootRow margin="0" width="100%">
              <Column margin="0" width="auto">
                <InlineText size="sm" color="white2">
                  Rewards per day
                </InlineText>
                <InlineText weight={600} color="white1">
                  1.00
                </InlineText>
              </Column>
              <TokenSelectorContainer>
                <TokenIcon margin="0 5px 0 0" mint={RIN_MINT} />
                <InlineText color="gray0" size="md" weight={600}>
                  RIN
                </InlineText>
              </TokenSelectorContainer>
            </RootRow>
          </Container>
          <Container height="5em" needBorder width="49%">
            <RootRow margin="0" width="100%">
              <Column margin="0" width="auto">
                <InlineText size="sm" color="white2">
                  Est. APR for $100k TVL
                </InlineText>
                <InlineText weight={600} color="white1">
                  1.00
                </InlineText>
              </Column>
              <TokenSelectorContainer>
                <InlineText color="gray0" size="md" weight={600}>
                  &nbsp;%&nbsp;
                </InlineText>
              </TokenSelectorContainer>
            </RootRow>
          </Container>
        </RootRow>}
      </Column>
      <RootRow>
        <Button
          onClick={() => setStepOfSetup(stepOfSetup + 1)}
          $variant="skip"
          $width="rg"
          $padding="xxxl"
          $fontSize="sm"
        >
          Skip
        </Button>
        <Button
          onClick={() => setStepOfSetup(stepOfSetup + 1)}
          $variant="violet"
          $width="rg"
          $padding="xxxl"
          $fontSize="sm"
        >
          {!wallet.connected ? 'Connect Wallet to Create Pool' : 'Next'}
        </Button>
      </RootRow>
    </>
  )
}
