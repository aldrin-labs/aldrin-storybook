import React, { useState } from 'react'

import { Button } from '@sb/components/Button'
import { Modal } from '@sb/components/Modal'
import { InlineText } from '@sb/components/Typography'
import { useWallet } from '@sb/dexUtils/wallet'

import { MinusIcon, TooltipIcon } from '../../Icons'
import { ValuesContainer } from '../DepositLiquidity/DepositContainer'
import { HeaderComponent } from '../Header'
import { Box, Column, Row } from '../index.styles'
import { PeriodButton, PeriodSwitcher, ModalContainer } from './index.styles'

export const WithdrawLiquidity = ({
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
              Withdraw
            </InlineText>
            {/* make button */}
            <InlineText color="blue1" size="sm" weight={600}>
              Withdraw All
            </InlineText>
          </Row>
          <Column height="auto" width="100%">
            <ValuesContainer />

            <Row margin="1em 0" width="100%">
              <Box height="auto" width="100%">
                <Row width="100%">
                  <Row>
                    <InlineText size="sm">Network Fee:</InlineText>
                  </Row>
                  <Row>
                    <InlineText size="sm" color="gray0" weight={500}>
                      0.0005 SOL <TooltipIcon color="gray1" />
                    </InlineText>
                  </Row>
                </Row>
              </Box>
            </Row>
          </Column>

          <Column height="auto" width="100%">
            <Row width="100%">
              <Column height="auto" width="35%">
                <Box padding="1em" height="6em">
                  <InlineText size="sm" weight={300} color="gray1">
                    <TooltipIcon color="gray1" margin="0 5px 0 0" />
                    Withdrawal Value{' '}
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
                    <TooltipIcon color="white3" margin="0 5px 0 0" />
                    Estimated Earnings if you stay
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

          <Button
            onClick={() => {}}
            $variant="violet"
            $width="xl"
            $padding="xxxl"
            $fontSize="sm"
          >
            <MinusIcon />
            Withdraw Liquidity
          </Button>
        </Column>
      </Modal>
    </ModalContainer>
  )
}
