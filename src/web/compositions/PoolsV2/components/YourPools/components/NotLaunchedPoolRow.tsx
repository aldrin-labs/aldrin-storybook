import React from 'react'

import { Button } from '@sb/components/Button'
import { TokenIcon } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'
import {
  Line,
  RootColumn,
  RootRow,
} from '@sb/compositions/PoolsV2/index.styles'

import { RIN_MINT } from '@core/solana'

import { ClockIcon, TooltipIcon } from '../../Icons'
import { Row } from '../../Popups/index.styles'
import { GrayBox, GrayContainer } from '../../Popups/PoolsDetails/index.styles'
import { Container } from '../../TableRow/index.styles'
import { PoolsCard } from './PoolCard'

export const NotLaunchedPool = () => {
  return (
    <Container height="auto" margin="0" width="100%">
      <RootRow align="center" margin="0" width="100%">
        <PoolsCard />
        <Row width="16%" height="10.5em">
          <RootColumn width="100%" height="100%">
            <GrayContainer>
              <GrayBox align="flex-start" height="50%">
                <Row width="100%">
                  <InlineText size="sm" weight={400} color="white2">
                    Fees Earned
                  </InlineText>
                  <TooltipIcon color="white2" />
                </Row>
                <Row width="14%">
                  <InlineText size="xmd" weight={400} color="white3">
                    $
                  </InlineText>
                  &nbsp;
                  <InlineText size="xmd" weight={600} color="white1">
                    105.2k
                  </InlineText>
                </Row>
              </GrayBox>
              <GrayBox align="flex-start" height="45%">
                <RootColumn width="100%" height="100%">
                  <Row width="100%">
                    <TokenIcon size={20} mint={RIN_MINT} />
                    <InlineText size="sm" weight={400} color="gray1">
                      124.42k
                    </InlineText>
                  </Row>

                  <Row width="100%">
                    <TokenIcon size={20} mint={RIN_MINT} />
                    <InlineText size="sm" weight={400} color="gray1">
                      124.42k
                    </InlineText>
                  </Row>
                </RootColumn>
              </GrayBox>
            </GrayContainer>
          </RootColumn>
        </Row>
        <Row width="35%">
          <GrayContainer>
            <RootRow height="100%" margin="0">
              <RootColumn width="45%" height="100%">
                <GrayBox align="flex-start" height="50%">
                  <Row width="100%">
                    <InlineText size="sm" weight={400} color="white2">
                      Farming Supply
                    </InlineText>
                    <TooltipIcon color="white2" />
                  </Row>
                  <Row width="14%">
                    <InlineText size="xmd" weight={400} color="white3">
                      $
                    </InlineText>
                    &nbsp;
                    <InlineText size="xmd" weight={600} color="white1">
                      105.2k
                    </InlineText>
                  </Row>
                </GrayBox>
                <GrayBox $justify="center" align="flex-start" height="45%">
                  <Row width="100%">
                    <TokenIcon size={20} mint={RIN_MINT} />
                    <InlineText size="sm" weight={400} color="gray1">
                      124.42k
                    </InlineText>
                  </Row>
                </GrayBox>
              </RootColumn>
              <Line />
              <RootColumn width="45%" height="100%">
                <GrayBox $justify="center" align="flex-start" height="100%">
                  <RootColumn width="100%" height="70%">
                    <Row width="100%">
                      <InlineText size="sm" weight={400} color="white2">
                        Farming Supply
                      </InlineText>
                      <TooltipIcon color="white2" />
                    </Row>
                    <InlineText size="xmd" weight={600} color="white1">
                      Jul 28, 2022
                    </InlineText>
                    <InlineText size="md" weight={400} color="white2">
                      21:24
                    </InlineText>
                  </RootColumn>
                </GrayBox>
              </RootColumn>
            </RootRow>
          </GrayContainer>
        </Row>
        <Row width="30%">
          <RootColumn margin="0" width="100%" height="10.5em">
            <GrayContainer height="6.5em">
              <RootColumn
                $justify="center"
                margin="0"
                height="100%"
                width="100%"
              >
                <ClockIcon color="white2" />
                <RootRow margin="1em 0 0 0">
                  <InlineText color="white1" size="sm">
                    Will Launch on Jul 19, 2022 at 7:56 PM
                  </InlineText>
                </RootRow>
              </RootColumn>
            </GrayContainer>
            <RootRow margin="0">
              <Button $padding="xxl" $variant="red" $fontSize="sm">
                Cancel
              </Button>
              <Button
                $width="emd"
                $padding="xxl"
                $variant="violet"
                $fontSize="sm"
              >
                Launch Now
              </Button>
              <Button
                $width="emd"
                $padding="xxl"
                $variant="violet"
                $fontSize="sm"
              >
                <ClockIcon color="blue1" />
                &nbsp;Reschedule
              </Button>
            </RootRow>
          </RootColumn>
        </Row>
      </RootRow>
    </Container>
  )
}
