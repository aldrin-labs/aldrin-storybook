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
} from '../../FilterSection/index.styles'
import { PlusIcon, TooltipIcon } from '../../Icons'
import { HeaderComponent } from '../Header'
import { Box, Column, Row } from '../index.styles'
import { ModalContainer } from '../WithdrawLiquidity/index.styles'
import { ValuesContainer } from './DepositContainer'
import { PeriodButton, PeriodSwitcher } from './index.styles'
import { NumberWithLabel } from '../../NumberWithLabel/NumberWithLabel'

import { Switcher } from '../Switcher/index'

export const SolStaking = ({
  onClose,
  open,
}: {
  onClose: () => void
  open: boolean
}) => {
  const [isRebalanceChecked, setIsRebalanceChecked] = useState(false)
  const [isUserVerified, setIsUserVerified] = useState(false)
  const [period, setPeriod] = useState('7D')
  //Added
  const [isStakeModeOn, setIsStakeModeOn] = useState(true)
  const [amount, setAmount] = useState('')
  const [amountGet, setAmountGet] = useState('')

  const wallet = useWallet()

  const toggleStakeMode = (value: boolean) => {
    setAmount('0')
    setAmountGet('0')
    setIsStakeModeOn(value)
  }

  return (
    <ModalContainer needBlur>
      <Modal open={open} onClose={onClose}>
        <HeaderComponent arrow close={onClose} token="SOL" />
        <Column height="auto" margin="2em 0">
          <Row width="100%" margin="2em 0 1em 0">
            <NumberWithLabel value={0} label="Epoch"></NumberWithLabel>
            <NumberWithLabel value={12} label="APY"></NumberWithLabel>
          </Row>
          <Switcher
            isStakeModeOn={isStakeModeOn}
            setIsStakeModeOn={toggleStakeMode}
          />
          <InlineText size="sm">
            Stake SOL and use mSOL while earning rewards
          </InlineText>
          <Column height="auto" width="100%" margin="1em 0 2.4em 0">
            <ValuesContainer isStakedModeOn={isStakeModeOn} />
            <Row margin="1em 0" width="100%">
              <Box height="auto" width="48%">
                <Row width="100%">
                  <Row>
                    <InlineText size="sm">Rate:</InlineText>
                  </Row>
                  <Row>
                    <InlineText size="sm" color="gray0" weight={600}>
                      0.0005 SOL
                    </InlineText>
                  </Row>
                </Row>
              </Box>

              <Box height="auto" width="48%">
                <Row width="100%">
                  <Row>
                    <InlineText size="sm">Stake Fee:</InlineText>
                  </Row>
                  <Row>
                    <InlineText size="sm" color="gray0" weight={600}>
                      $14.42
                    </InlineText>
                  </Row>
                </Row>
              </Box>
            </Row>
          </Column>

          <Column height="auto" width="100%">
            <Button
              onClick={() => {
                // connect wallet
              }}
              $variant={wallet.connected ? 'green' : 'violet'}
              $width="xl"
              $padding="xxxl"
              $fontSize="sm"
            >
              {isRebalanceChecked || !wallet.connected ? (
                'Connect Wallet to Sake SOL'
              ) : (
                <>{isStakeModeOn ? 'Stake SOL' : 'Unstake SOL'}</>
              )}
            </Button>
          </Column>
        </Column>
      </Modal>
    </ModalContainer>
  )
}
