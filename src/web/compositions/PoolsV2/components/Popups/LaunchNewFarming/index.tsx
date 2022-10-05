import React from 'react'

import { Button } from '@sb/components/Button'
import { Modal } from '@sb/components/Modal'
import { InlineText } from '@sb/components/Typography'
import { farmingDurations } from '@sb/compositions/PoolsV2/config'
import { RootRow } from '@sb/compositions/PoolsV2/index.styles'

import { CustomTextInput, ValuesContainer } from '../../Inputs'
import { Container } from '../../TableRow/index.styles'
import { Header } from '../CreatePool/components/Header'
import { RationContainer } from '../CreatePool/components/RationContainer'
import {
  CustomDuration,
  DurationContainer,
  GradientBar,
  InvisibleInput,
  SContainer,
  TokenSelectorContainer,
} from '../CreatePool/index.styles'
import { Column, Row, StyledModal } from '../index.styles'

export const LaunchFarmingModal = ({
  open,
  onClose,
  scheduleNewFarming,
}: {
  open: boolean
  onClose: () => void
  scheduleNewFarming: boolean
}) => {
  return (
    <StyledModal>
      <Modal open={open} onClose={onClose}>
        <Header
          header="Launch New Farming for"
          description="USDT/USDC"
          needSteps={false}
          arrow={false}
          onClose={() => onClose()}
        />
        <Column justify="center" margin="1em 0" width="100%">
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
                    <InvisibleInput
                      placeholderColor="white3"
                      placeholder="28"
                    />
                    <InlineText color="white2" size="md" weight={600}>
                      Days
                    </InlineText>
                  </RootRow>
                </CustomDuration>
              </Row>
            </Column>
          </Container>
          <ValuesContainer />
          <RationContainer
            needElement={false}
            needPadding={false}
            token="RIN"
          />
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
                <InlineText color="white1" size="md" weight={600}>
                  &nbsp;%&nbsp;
                </InlineText>
              </TokenSelectorContainer>
            </RootRow>
          </Container>
          {scheduleNewFarming && (
            <SContainer
              padding="0.5em 1em"
              height="8em"
              needBorder
              width="100%"
            >
              <Column justify="space-between" width="100%">
                <RootRow margin="0" width="100%">
                  <InlineText color="white2" size="sm">
                    Launch Pool
                  </InlineText>
                </RootRow>

                <RootRow margin="0" width="100%">
                  <CustomTextInput
                    title="Launch Date"
                    placeholder="DD / MM / YYYY"
                    width="49%"
                  />
                  <CustomTextInput
                    title="Launch Time (24h format)"
                    placeholder="HH/MM"
                    width="49%"
                  />
                </RootRow>
              </Column>
            </SContainer>
          )}
        </Column>
        <RootRow margin="0 0 2em 0">
          <Button
            onClick={() => {}}
            $variant="violet"
            $width="xl"
            $padding="xxxl"
            $fontSize="sm"
          >
            Launch New Farming{' '}
          </Button>
        </RootRow>
      </Modal>
    </StyledModal>
  )
}
