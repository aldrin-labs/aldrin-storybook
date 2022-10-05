/* eslint-disable no-nested-ternary */
import React, { useState } from 'react'

import { Button } from '@sb/components/Button'
import { TokenIcon } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'
import {
  AmountInput,
  ValuesContainer,
} from '@sb/compositions/PoolsV2/components/Inputs'
import { InputContainer } from '@sb/compositions/PoolsV2/components/Inputs/index.styles'
import { farmingDurations } from '@sb/compositions/PoolsV2/config'
import { RootRow } from '@sb/compositions/PoolsV2/index.styles'
import { useWallet } from '@sb/dexUtils/wallet'

import { RIN_MINT } from '@core/solana'

import { Container } from '../../../../TableRow/index.styles'
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

export const SetupFarming = ({
  onClose,
  needSteps,
  header,
  description,
  setCreationStep = () => {},
  creationStep = 'setupFarming',
}: {
  onClose: () => void
  needSteps?: boolean
  header: string
  description: string
  setCreationStep?: (a: string) => void
  creationStep?: string
}) => {
  const { wallet } = useWallet()
  const [stepOfSetup, setStepOfSetup] = useState(0)

  return (
    <>
      <Header
        header={header}
        description={description}
        creationStep={creationStep}
        needSteps={needSteps}
        arrow={!!needSteps}
        onClose={() =>
          needSteps
            ? stepOfSetup === 0
              ? setCreationStep('createPool')
              : setStepOfSetup(stepOfSetup - 1)
            : onClose()
        }
      />
      <Column
        justify="center"
        height={stepOfSetup === 1 || !needSteps ? '32em' : '30em'}
        margin={stepOfSetup === 1 || !needSteps ? '1em 0' : '2em 0'}
        width="100%"
      >
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
        {stepOfSetup === 0 && needSteps && (
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
        {(stepOfSetup === 1 || !needSteps) && <ValuesContainer />}
        {(stepOfSetup === 1 || !needSteps) && (
          <RationContainer
            needElement={false}
            needPadding={false}
            token="RIN"
          />
        )}
        {stepOfSetup === 0 && needSteps && (
          <RootRow margin="1em 0 0 0">
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
          </RootRow>
        )}
        {(stepOfSetup === 1 || !needSteps) && (
          <Container padding="0.5em 1em" height="4em" needBorder width="100%">
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
        )}
      </Column>
      <RootRow margin="0 0 2em 0">
        <Button
          onClick={() => setCreationStep('setPreferences')}
          $variant="skip"
          $width="rg"
          $padding="xxxl"
          $fontSize="sm"
        >
          Skip
        </Button>
        <Button
          onClick={() =>
            stepOfSetup === 1
              ? setCreationStep('setPreferences')
              : setStepOfSetup(stepOfSetup + 1)
          }
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
