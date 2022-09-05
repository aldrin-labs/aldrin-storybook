import React from 'react'

import { Button } from '@sb/components/Button'
import { InlineText } from '@sb/components/Typography'
import { RootRow } from '@sb/compositions/PoolsV2/index.styles'
import { useWallet } from '@sb/dexUtils/wallet'

import { Container } from '../../../../TableRow/index.styles'
import { ValuesContainer } from '../../../DepositLiquidity/DepositContainer'
import { Column } from '../../../index.styles'
import { Header } from '../../components/Header'
import { RationContainer } from '../../components/RationContainer'
import { InvisibleInput, TierContainer } from '../../index.styles'

const tiers = [
  { value: '0.01', title: 'Best for very stable pairs' },
  { value: '0.05', title: 'Best for stable pairs' },
  { value: '0.3', title: 'Best for most pairs' },
  { value: '1', title: 'Best for exotic pairs' },
]

export const CreatePool = ({
  onClose,
  creationStep,
  setIsConnectWalletPopupOpen,
  setCreationStep,
}: {
  onClose: () => void
  creationStep: string
  setIsConnectWalletPopupOpen: (a: boolean) => void
  setCreationStep: (a: string) => void
}) => {
  const { wallet } = useWallet()

  return (
    <>
      <Header
        creationStep={creationStep}
        header="Create Pool & Deposit Liquidity"
        description="If your token name or logo are not displayed correctly you can submit it to the Aldrin Registry here."
        onClose={onClose}
      />
      <Column height="30em" margin="2em 0" width="100%">
        <Container needBorder height="9.5em" width="100%">
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
        {wallet.connected && <RationContainer token="RIN" />}
      </Column>
      <RootRow margin="0 0 2em 0">
        <Button
          onClick={() =>
            !wallet.connected
              ? setIsConnectWalletPopupOpen(true)
              : setCreationStep('setupFarming')
          }
          $variant="violet"
          $width="xl"
          $padding="xxxl"
          $fontSize="sm"
        >
          {!wallet.connected ? 'Connect Wallet to Create Pool' : 'Next'}
        </Button>
      </RootRow>
    </>
  )
}
