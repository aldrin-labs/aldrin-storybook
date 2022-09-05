import React from 'react'

import { TokenIcon } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'

import { RIN_MINT } from '@core/solana'

import { BalanceLine } from '../../BalanceLine'
import { TooltipIcon } from '../../Icons'
import { Row, Box, Column } from '../index.styles'
import { GrayBox } from './index.styles'

export const BoxesWithDetails = () => {
  return (
    <Row height="15em" padding="2.5em 0" width="100%">
      <Box height="100%" width="31%">
        <Column height="3.5em">
          <InlineText size="sm" weight={300} color="gray1">
            Total Liquidity
          </InlineText>
          <InlineText color="gray0" size="xmd" weight={600}>
            <InlineText color="gray1">$</InlineText> 10.42m
          </InlineText>
        </Column>

        <GrayBox>
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
        </GrayBox>
      </Box>
      <Row height="100%" width="66%">
        <Column width="48%">
          <Box>
            <InlineText size="sm" weight={300} color="gray1">
              <TooltipIcon color="gray1" margin="0 5px 0 0" />
              Trading Fee
            </InlineText>
            <InlineText color="gray0" size="xmd" weight={600}>
              0.038%
            </InlineText>
          </Box>
          <Box>
            <InlineText size="sm" weight={300} color="gray1">
              Farming Rewards
            </InlineText>
            <Row>
              <Row>
                <TokenIcon margin="0 5px 0 0" mint={RIN_MINT} />
                <InlineText color="gray0" size="md" weight={600}>
                  RIN
                </InlineText>
              </Row>
            </Row>
          </Box>
        </Column>
        <Column width="48%">
          <Box>
            <InlineText size="sm" weight={300} color="gray1">
              Volume <InlineText color="gray13">7d</InlineText>
            </InlineText>
            <InlineText color="gray0" size="xmd" weight={600}>
              <InlineText color="gray1">$</InlineText> 924.42k
            </InlineText>
          </Box>
          <Box>
            <Row width="100%" height="100%">
              <Column>
                <InlineText size="sm" weight={300} color="gray1">
                  <TooltipIcon color="gray1" margin="0 5px 0 0" />
                  APR
                </InlineText>
                <InlineText color="green4" size="xmd" weight={600}>
                  125.24%
                </InlineText>
              </Column>
              <BalanceLine needRotate value1="80%" value2="20%" />
            </Row>
          </Box>
        </Column>
      </Row>
    </Row>
  )
}
