import React, { useState } from 'react'

import { Button } from '@sb/components/Button'
import { TokenIcon } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'
import { RIN_MINT } from '@sb/dexUtils/utils'

import { RootColumn, RootRow } from '../../index.styles'
import { MinusIcon, PlusIcon, TooltipIcon } from '../Icons'
import { DepositLiquidity } from '../Popups/DepositLiquidity'
import { Row } from '../Popups/index.styles'
import { GrayBox } from '../Popups/PoolsDetails/index.styles'
import { WithdrawLiquidity } from '../Popups/WithdrawLiquidity'
import { Container } from '../TableRow/index.styles'
import {
  Container as SwitcherContainer,
  SwitcherButton,
} from '../TablesSwitcher/index.styles'
import { PNLChart } from './PNLChart'
import { PositionCard } from './PositionCard'

export const PositionsCounter = () => {
  return (
    <SwitcherContainer $variant="text">
      Classic Liquidity Positions{' '}
      <SwitcherButton $variant="text">1</SwitcherButton>
    </SwitcherContainer>
  )
}

export const PositionInfo = ({
  positionsDataView,
}: {
  positionsDataView: string
}) => {
  const [isWithdrawPopupOpen, setIsWithdrawPopupOpen] = useState(false)
  const [isDepositPopupOpen, setIsDepositPopupOpen] = useState(false)

  const isPositionViewDetailed = positionsDataView === 'detailed'
  const rootRowHeight = isPositionViewDetailed ? '16em' : '10em'
  const grayBoxHeight = isPositionViewDetailed ? '4.5em' : '6em'

  return (
    <RootRow margin="30px 0 0 0">
      <Container height="auto" margin="0" width="100%">
        <RootRow align="flex-end" margin="0" width="100%">
          <Row width="48%">
            <PositionCard isPositionViewDetailed={isPositionViewDetailed} />
            <PNLChart isPositionViewDetailed={isPositionViewDetailed} />
          </Row>
          <Row width="48%">
            <Row width="65%">
              <Row width="47%" height={rootRowHeight}>
                <RootColumn width="100%" height="100%">
                  <RootColumn width="100%" height="65%">
                    <GrayBox
                      $background="white5"
                      align="flex-start"
                      height={grayBoxHeight}
                    >
                      <Row width="100%">
                        <InlineText size="sm" weight={400} color="white2">
                          Your Liquidity
                        </InlineText>
                        <TooltipIcon color="white2" />
                      </Row>
                      <Row>
                        <InlineText size="xmd" weight={400} color="white3">
                          $
                        </InlineText>
                        &nbsp;
                        <InlineText size="xmd" weight={600} color="white1">
                          10.52k
                        </InlineText>
                      </Row>
                    </GrayBox>

                    {isPositionViewDetailed && (
                      <GrayBox
                        $background="white5"
                        align="flex-start"
                        height={grayBoxHeight}
                      >
                        <Row width="100%">
                          <TokenIcon size={20} mint={RIN_MINT} />
                          <InlineText size="sm" weight={400} color="gray1">
                            124.42k
                          </InlineText>
                        </Row>
                        <Row width="100%">
                          <TokenIcon
                            size={20}
                            mint="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
                          />
                          <InlineText size="sm" weight={400} color="gray1">
                            124.42k
                          </InlineText>
                        </Row>
                      </GrayBox>
                    )}
                  </RootColumn>
                  <Button
                    onClick={() => {
                      setIsDepositPopupOpen(true)
                    }}
                    $width="xl"
                    $borderRadius="md"
                    $padding="xxl"
                    $variant="violet"
                    $fontSize="sm"
                  >
                    <PlusIcon /> Deposit More
                  </Button>
                </RootColumn>
              </Row>
              <Row width="47%" height={rootRowHeight}>
                <RootColumn height="100%" width="100%">
                  <RootColumn width="100%" height="65%">
                    <GrayBox
                      $background="white5"
                      align="flex-start"
                      height={grayBoxHeight}
                    >
                      <Row width="100%">
                        <InlineText size="sm" weight={400} color="white2">
                          Fees Earned
                        </InlineText>
                        <TooltipIcon color="white2" />
                      </Row>
                      <Row>
                        <InlineText size="xmd" weight={400} color="white3">
                          $
                        </InlineText>
                        &nbsp;
                        <InlineText size="xmd" weight={600} color="white1">
                          105.2k
                        </InlineText>
                      </Row>
                    </GrayBox>

                    {isPositionViewDetailed && (
                      <GrayBox
                        $background="white5"
                        align="flex-start"
                        height={grayBoxHeight}
                      >
                        <Row width="100%">
                          <TokenIcon size={20} mint={RIN_MINT} />
                          <InlineText size="sm" weight={400} color="gray1">
                            124.42k
                          </InlineText>
                        </Row>
                        <Row width="100%">
                          <TokenIcon
                            size={20}
                            mint="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
                          />
                          <InlineText size="sm" weight={400} color="gray1">
                            124.42k
                          </InlineText>
                        </Row>
                      </GrayBox>
                    )}
                  </RootColumn>

                  <Button
                    onClick={() => {
                      setIsWithdrawPopupOpen(true)
                    }}
                    $width="xl"
                    $borderRadius="md"
                    $padding="xxl"
                    $variant="violet"
                    $fontSize="sm"
                  >
                    <MinusIcon /> Withdraw
                  </Button>
                </RootColumn>
              </Row>
            </Row>

            <Row width="26%" height={rootRowHeight}>
              <RootColumn width="100%" height="100%">
                <RootColumn width="100%" height="65%">
                  <GrayBox
                    $background="white5"
                    align="flex-start"
                    height={grayBoxHeight}
                  >
                    <Row width="100%">
                      <InlineText size="sm" weight={400} color="white2">
                        Rewards
                      </InlineText>
                      <TooltipIcon color="white2" />
                    </Row>
                    <Row>
                      <InlineText size="xmd" weight={400} color="white3">
                        $
                      </InlineText>
                      &nbsp;
                      <InlineText size="xmd" weight={600} color="white1">
                        1.52k
                      </InlineText>
                    </Row>
                  </GrayBox>

                  {isPositionViewDetailed && (
                    <GrayBox $background="white5" height={grayBoxHeight}>
                      <Row height="100%" width="100%">
                        <TokenIcon size={20} mint={RIN_MINT} />
                        <InlineText size="sm" weight={400} color="gray1">
                          124.42k
                        </InlineText>
                      </Row>
                    </GrayBox>
                  )}
                </RootColumn>
                <Button
                  onClick={() => {}}
                  $width="xl"
                  $borderRadius="md"
                  $padding="xxl"
                  $variant="green"
                  $fontSize="sm"
                >
                  Claim rewards
                </Button>
              </RootColumn>
            </Row>
          </Row>
        </RootRow>
      </Container>
      <WithdrawLiquidity
        open={isWithdrawPopupOpen}
        onClose={() => setIsWithdrawPopupOpen(false)}
      />
      <DepositLiquidity
        open={isDepositPopupOpen}
        onClose={() => setIsDepositPopupOpen(false)}
      />
    </RootRow>
  )
}
