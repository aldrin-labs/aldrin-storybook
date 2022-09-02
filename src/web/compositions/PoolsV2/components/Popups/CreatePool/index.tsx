import React, { useState } from 'react'

import { Button } from '@sb/components/Button'
import { Modal } from '@sb/components/Modal'
import { InlineText } from '@sb/components/Typography'
import { RootRow } from '@sb/compositions/PoolsV2/index.styles'
import { useWallet } from '@sb/dexUtils/wallet'

import { Container } from '../../TableRow/index.styles'
import { ValuesContainer } from '../DepositLiquidity/DepositContainer'
import { Column, StyledModal } from '../index.styles'
import { Header } from './components/Header'
import { InvisibleInput, TierContainer } from './index.styles'

const tiers = [
  { value: '0.01', title: 'Best for very stable pairs' },
  { value: '0.05', title: 'Best for stable pairs' },
  { value: '0.3', title: 'Best for most pairs' },
  { value: '1', title: 'Best for exotic pairs' },
]

export const CreatePoolModal = ({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) => {
  const [isConnectWalletPopupOpen, setIsConnectWalletPopupOpen] =
    useState(false)

  const { wallet } = useWallet()

  return (
    <StyledModal>
      <Modal open={open} onClose={onClose}>
        <Header onClose={onClose} />
        <Column height="auto" width="100%">
          {' '}
          <Container height="9.5em" width="100%">
            <Column width="100%">
              <InlineText size="sm" color="white2">
                Select Fee Tier
              </InlineText>
              <RootRow margin="0">
                {tiers.map((tier) => (
                  <TierContainer width="18%">
                    <InlineText color="white4" size="md" weight={600}>
                      {tier.value}%
                    </InlineText>
                    <InlineText color="white4" size="xs">
                      {tier.title}
                    </InlineText>
                  </TierContainer>
                ))}
                <TierContainer width="25%">
                  <InlineText color="white4" size="sm">
                    Custom Fee
                  </InlineText>
                  <RootRow margin="0.8em 0 0 0">
                    <InvisibleInput placeholder="0.3" />{' '}
                    <InlineText color="white4" size="md" weight={600}>
                      %
                    </InlineText>
                  </RootRow>
                </TierContainer>
              </RootRow>
            </Column>
          </Container>
          <ValuesContainer />
        </Column>
        <Button
          onClick={() =>
            !wallet.connected ? setIsConnectWalletPopupOpen(true) : null
          }
          $variant="violet"
          $width="xl"
          $padding="xxxl"
          $fontSize="sm"
        >
          Connect Wallet to Create Pool
        </Button>
      </Modal>
    </StyledModal>
  )
}
