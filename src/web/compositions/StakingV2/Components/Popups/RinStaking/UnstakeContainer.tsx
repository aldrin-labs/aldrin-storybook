import React from 'react'

import { TokenIcon } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'
import { useWallet } from '@sb/dexUtils/wallet'

import { RIN_MINT } from '@core/solana'

import { AmountInput } from '../../Inputs'
import { Container } from '../index.styles'
import {
  FirstInputContainer,
  InputsContainer,
  PositionatedIconContainer,
  SecondInputContainer,
} from './index.styles'

import { Button } from '@sb/components/Button'

export const UnstakeContainer = () => {
  const wallet = useWallet()

  return (
    <InputsContainer>
      <FirstInputContainer>
        <AmountInput
          title="Unstake"
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
      {/* <SecondInputContainer>
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
      </SecondInputContainer> */}
      <Button
        onClick={() => {
          // connect wallet
        }}
        $variant={'violet'}
        $width="xl"
        $padding="xxxl"
        $fontSize="sm"
      >
        {!wallet.connected ? 'Connect Wallet to Unstake RIN' : <>Unstake RIN</>}
      </Button>
    </InputsContainer>
  )
}
