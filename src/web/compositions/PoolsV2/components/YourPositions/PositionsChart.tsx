import React from 'react'

import { InlineText } from '@sb/components/Typography'

import { GrayContainer, RootRow } from '../../index.styles'
import { VolumeChart } from '../Charts'
import { TooltipIcon } from '../Icons'
import { Row } from '../Popups/index.styles'
import { TokenIconsContainer } from '../TokenIconsContainer'

export const PositionsCharts = () => {
  return (
    <RootRow margin="30px 0 0 0">
      <Row width="49%">
        <GrayContainer>
          <Row width="100%">
            <InlineText color="white2" weight={400} size="esm">
              Total P&L
            </InlineText>
            <TooltipIcon color="white2" />
          </Row>
          <Row width="100%">
            <Row>
              <InlineText color="white3" weight={600} size="xlmd">
                $
              </InlineText>
              &nbsp;
              <InlineText color="green1" weight={600} size="xlmd">
                1.01k
              </InlineText>
            </Row>

            <InlineText color="white2" weight={600} size="sm">
              + 23.4%
            </InlineText>
          </Row>
        </GrayContainer>
        <GrayContainer>
          <Row width="100%">
            <InlineText color="white2" weight={400} size="esm">
              Top Performing Pool
            </InlineText>
            <TokenIconsContainer
              size={24}
              needElement
              elementSize="sm"
              mint="E5ndSkaB17Dm7CsD22dvcjfrYSDLCxFcMd6z8ddCk5wp"
            />
          </Row>
          <Row width="100%">
            <Row>
              <InlineText color="gray0" weight={600} size="md">
                RIN/USDC
              </InlineText>
            </Row>
          </Row>
        </GrayContainer>
      </Row>
      <VolumeChart chartHeight={80} />
    </RootRow>
  )
}
