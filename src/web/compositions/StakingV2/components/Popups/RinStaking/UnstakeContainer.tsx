import React from 'react'

import { Button } from '@sb/components/Button'
import { TokenIcon } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'
import { useWallet } from '@sb/dexUtils/wallet'

import { RIN_MINT } from '@core/solana'

import { AmountInput } from '../../Inputs'
import { Container } from '../index.styles'
import { FirstInputContainer, InputsContainer } from './index.styles'

export const UnstakeContainer = ({
  setIsConnectWalletPopupOpen,
  end,
  setUnstakeAmount,
  unstakeAmount,
  maxAmount,
}: {
  setIsConnectWalletPopupOpen: (a: boolean) => void
  end: (a: number) => void
  setUnstakeAmount: (a: string | number) => void
  unstakeAmount: number
  maxAmount: number | string
}) => {
  const wallet = useWallet()

  return (
    <InputsContainer margin="0">
      <FirstInputContainer>
        <AmountInput
          title="Unstake"
          maxAmount={maxAmount}
          amount={unstakeAmount}
          onMaxAmountClick={() => setUnstakeAmount(maxAmount)}
          disabled={false}
          onChange={setUnstakeAmount}
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
        onClick={() =>
          !wallet.connected
            ? setIsConnectWalletPopupOpen(true)
            : end(unstakeAmount)
        }
        disabled={unstakeAmount === 0 || unstakeAmount === ''}
        $variant="violet"
        $width="xl"
        $padding="xxxl"
        $fontSize="md"
      >
        {!wallet.connected ? 'Connect Wallet to Unstake RIN' : <>Unstake RIN</>}
      </Button>
    </InputsContainer>
  )
}
