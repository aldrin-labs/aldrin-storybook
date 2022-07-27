import React, { useState } from 'react'

import { Button } from '@sb/components/Button'
import { Modal } from '@sb/components/Modal'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { InlineText } from '@sb/components/Typography'
import { useWallet } from '@sb/dexUtils/wallet'

import {
  CheckboxContainer,
  HiddenCheckbox,
  Icon,
  StyledCheckbox,
} from '../../FiltersSection/index.styles'
import { PlusIcon, TooltipIcon } from '../../Icons'
import { HeaderComponent } from '../Header'
import { Box, Column, Row } from '../index.styles'
import { ModalContainer } from '../WithdrawLiquidity/index.styles'
import { PeriodButton, PeriodSwitcher } from './index.styles'
import { ValuesContainer } from './ValuesContainer'

export const DepositLiquidity = ({
  onClose,
  open,
}: {
  onClose: () => void
  open: boolean
}) => {
  const [isRebalanceChecked, setIsRebalanceChecked] = useState(false)
  const [isUserVerified, setIsUserVerified] = useState(false)
  const [period, setPeriod] = useState('7D')
  const wallet = useWallet()
  return (
    <ModalContainer needBlur>
      <Modal open={open} onClose={onClose}>
        <HeaderComponent arrow close={onClose} />
        <Column height="calc(100% - 11em)" margin="2em 0">
          <Row width="100%">
            <InlineText color="gray1" size="sm">
              Deposit
            </InlineText>
            <Row
              onClick={() => {
                setIsRebalanceChecked(!isRebalanceChecked)
              }}
            >
              <CheckboxContainer>
                <HiddenCheckbox type="checkbox" checked={isRebalanceChecked} />
                <StyledCheckbox hoverColor="blue2" color="blue2">
                  <Icon
                    hoverColor="blue2"
                    color="blue2"
                    checked={isRebalanceChecked}
                    viewBox="0 0 24 24"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </Icon>
                </StyledCheckbox>
              </CheckboxContainer>
              <InlineText color="blue2" size="sm">
                Rebalance uneven amounts
              </InlineText>
              <DarkTooltip title="Liquidity must be deposited according to the ratio of the pool. Enable rebalance to auto-trade any entered amount to the pool ratio. When you withdraw the liquidity, you will get values equal to the ratio of the pool at withdrawal time.">
                <span>
                  <TooltipIcon color="blue2" />
                </span>
              </DarkTooltip>
            </Row>
          </Row>
          <Column height="auto" width="100%">
            <ValuesContainer />
            {isRebalanceChecked && (
              <Row margin="1em 0" width="100%">
                <Box height="auto" width="48%">
                  <Row width="100%">
                    <Row>
                      <InlineText size="sm">Network Fee:</InlineText>
                    </Row>
                    <Row>
                      <InlineText size="sm" color="gray0" weight={600}>
                        0.0005 SOL <TooltipIcon color="gray1" />
                      </InlineText>
                    </Row>
                  </Row>
                </Box>

                <Box height="auto" width="48%">
                  <Row width="100%">
                    <Row>
                      <InlineText size="sm">Rebalance Fee:</InlineText>
                    </Row>
                    <Row>
                      <InlineText size="sm" color="gray0" weight={600}>
                        $14.42 <TooltipIcon color="gray1" />
                      </InlineText>
                    </Row>
                  </Row>
                </Box>
              </Row>
            )}
          </Column>

          {isRebalanceChecked && (
            <>
              <Column height="auto" width="100%">
                <Row width="100%">
                  <Column height="auto" width="35%">
                    <Box padding="1em" height="6em">
                      <InlineText size="sm" weight={300} color="gray1">
                        <TooltipIcon color="gray1" margin="0 5px 0 0" />
                        Position Value{' '}
                      </InlineText>
                      <InlineText color="gray0" size="xmd" weight={600}>
                        <InlineText color="gray1" size="md" weight={600}>
                          $
                        </InlineText>{' '}
                        120.50
                      </InlineText>
                    </Box>
                  </Column>
                  <Column height="auto" width="60%">
                    <Box padding="1em" height="6em">
                      <InlineText size="sm" weight={300} color="gray1">
                        <TooltipIcon color="gray1" margin="0 5px 0 0" />
                        Estimated Earnings
                      </InlineText>
                      <Row width="100%">
                        <InlineText color="gray0" size="xmd" weight={600}>
                          <InlineText color="gray1" size="md" weight={600}>
                            $
                          </InlineText>{' '}
                          20.50
                        </InlineText>
                        <PeriodSwitcher>
                          <PeriodButton
                            isActive={period === '7D'}
                            onClick={() => {
                              setPeriod('7D')
                            }}
                          >
                            <InlineText size="esm">7D</InlineText>
                          </PeriodButton>
                          <PeriodButton
                            isActive={period === '1M'}
                            onClick={() => {
                              setPeriod('1M')
                            }}
                          >
                            <InlineText size="esm">1M</InlineText>
                          </PeriodButton>
                          <PeriodButton
                            isActive={period === '1Y'}
                            onClick={() => {
                              setPeriod('1Y')
                            }}
                          >
                            <InlineText size="esm">1Y</InlineText>
                          </PeriodButton>
                        </PeriodSwitcher>
                      </Row>
                    </Box>
                  </Column>
                </Row>
              </Column>
            </>
          )}
          <Column height="auto">
            <Row
              margin="1em 0"
              width="100%"
              onClick={() => {
                setIsUserVerified(!isUserVerified)
              }}
            >
              <CheckboxContainer marginRight="0.5em">
                <HiddenCheckbox type="checkbox" checked={isUserVerified} />
                <StyledCheckbox hoverColor="yellow7" color="yellow7">
                  <Icon
                    hoverColor="yellow7"
                    color="yellow7"
                    checked={isUserVerified}
                    viewBox="0 0 24 24"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </Icon>
                </StyledCheckbox>
              </CheckboxContainer>
              <InlineText color="yellow7" size="xs">
                I verify that I have read the{' '}
                <InlineText
                  color="yellow7"
                  as="a"
                  target="_blank"
                  href="https://docs.aldrin.com/amm/aldrin-pools-guide-for-farmers"
                >
                  Aldrin Pools Guide
                </InlineText>{' '}
                and understand the risks of providing liquidity, including
                impermanent loss.
              </InlineText>
            </Row>
            <Button
              onClick={() => {
                // connect wallet
              }}
              $variant={isRebalanceChecked ? 'violet' : 'green'}
              $width="xl"
              $padding="xxxl"
              $fontSize="sm"
            >
              {isRebalanceChecked || !wallet.connected ? (
                'Connect Wallet to Add Liquidity'
              ) : (
                <>
                  <PlusIcon color="green1" />
                  Add Liquidity & Farm
                </>
              )}
            </Button>
          </Column>
        </Column>
      </Modal>
    </ModalContainer>
  )
}
