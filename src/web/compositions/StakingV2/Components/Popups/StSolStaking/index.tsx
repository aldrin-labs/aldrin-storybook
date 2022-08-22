import React, { useState } from 'react'

import { Button } from '@sb/components/Button'
import { Modal } from '@sb/components/Modal'
import { InlineText } from '@sb/components/Typography'
import { useWallet } from '@sb/dexUtils/wallet'

import { NumberWithLabel } from '../../NumberWithLabel/NumberWithLabel'
import { HeaderComponent } from '../Header'
import { Box, Column, Container, Row } from '../index.styles'
import { Switcher } from '../Switcher/index'
import { ModalContainer } from '../WithdrawLiquidity/index.styles'
import { ValuesContainer } from './DepositContainer'
import {
  FirstInputContainer,
  InputsContainer,
  PositionatedIconContainer,
  SecondInputContainer,
  MainContainer,
} from './index.styles'
import { AmountInput } from '../../Inputs'
import { TokenIcon } from '@sb/components/TokenIcon'
import { RIN_MINT } from '@core/solana'

export const StSolStaking = ({
  onClose,
  open,
}: {
  onClose: () => void
  open: boolean
}) => {
  const [isRebalanceChecked, setIsRebalanceChecked] = useState(false)
  const [isUserVerified, setIsUserVerified] = useState(false)
  const [period, setPeriod] = useState('7D')
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
    <MainContainer>
      <ModalContainer needBlur className="modal-container">
        <Modal open={open} onClose={onClose}>
          <HeaderComponent arrow close={onClose} token="stSOL" />
          <Column height="auto" margin="2em 0">
            <Row width="100%" margin="2em 0 1em 0" className="apy-row">
              <NumberWithLabel value={0} label="Epoch" />
              <NumberWithLabel value={12} label="APY" />
            </Row>
            <Switcher
              isStakeModeOn={isStakeModeOn}
              setIsStakeModeOn={toggleStakeMode}
            />
            <InlineText color="white2" size="sm">
              Stake SOL and use stSOL while earning rewards
            </InlineText>
            <Column height="auto" width="100%" margin="1em 0 2.4em 0">
              <InputsContainer>
                <FirstInputContainer>
                  <AmountInput
                    title={isStakeModeOn ? 'Stake' : 'Unstake'}
                    maxAmount="0.00"
                    amount={0}
                    onMaxAmountClick={() => {}}
                    disabled={false}
                    onChange={() => {}}
                    appendComponent={
                      <Container>
                        <TokenIcon margin="0 5px 0 0" mint={RIN_MINT} />
                        <InlineText color="gray0" size="md" weight={600}>
                          RIN
                        </InlineText>
                      </Container>
                    }
                  />
                </FirstInputContainer>
                <PositionatedIconContainer>+</PositionatedIconContainer>
                <SecondInputContainer>
                  <AmountInput
                    title="Receive"
                    maxAmount="0.00"
                    amount={0}
                    onMaxAmountClick={() => {}}
                    onChange={() => {}}
                    appendComponent={
                      <Container>
                        <TokenIcon
                          margin="0 5px 0 0"
                          mint="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
                        />
                        <InlineText color="gray0" size="md" weight={600}>
                          USDC
                        </InlineText>
                      </Container>
                    }
                  />
                </SecondInputContainer>
              </InputsContainer>
              <Row margin="1em 0" width="100%" className="rate-row">
                <Box height="auto" width="48%" className="rate-box">
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

                <Box height="auto" width="48%" className="fee-box">
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
                  'Connect Wallet to Stake mSOL'
                ) : (
                  <>{isStakeModeOn ? 'Stake stSOL' : 'Unstake stSOL'}</>
                )}
              </Button>
            </Column>
          </Column>
        </Modal>
      </ModalContainer>
    </MainContainer>
  )
}
