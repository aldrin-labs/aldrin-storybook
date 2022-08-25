import React from 'react'

import { Button } from '@sb/components/Button'
import { TokenIcon } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'
import { useWallet } from '@sb/dexUtils/wallet'

import { RIN_MINT } from '@core/solana'

import { AmountInput } from '../../Inputs'
import { Container } from '../index.styles'
import { FirstInputContainer, InputsContainer } from './index.styles'

export const StakeContainer = ({
  setIsConnectWalletPopupOpen,
  start,
  setStakeAmount,
  stakeAmount,
  maxAmount,
}: {
  setIsConnectWalletPopupOpen: (a: boolean) => void
  start: (a: number) => void
  setStakeAmount: (a: string | number) => void
  stakeAmount: number
  maxAmount: number | string
}) => {
  const wallet = useWallet()

  return (
    <InputsContainer>
      <FirstInputContainer>
        <AmountInput
          title="Stake"
          maxAmount={maxAmount}
          amount={stakeAmount}
          onMaxAmountClick={() => setStakeAmount(maxAmount)}
          disabled={false}
          onChange={setStakeAmount}
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
      <Button
        disabled={stakeAmount === 0}
        onClick={() =>
          !wallet.connected
            ? setIsConnectWalletPopupOpen(true)
            : start(stakeAmount)
        }
        $variant="violet"
        $width="xl"
        $padding="xxxl"
        $fontSize="md"
      >
        {!wallet.connected ? 'Connect Wallet to Stake RIN' : <>Stake RIN</>}
      </Button>
    </InputsContainer>
  )
}
