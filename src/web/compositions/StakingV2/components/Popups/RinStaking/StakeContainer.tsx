import React from 'react'

import { Button } from '@sb/components/Button'
import { TokenIcon } from '@sb/components/TokenIcon'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { InlineText } from '@sb/components/Typography'
import { useWallet } from '@sb/dexUtils/wallet'

import { RIN_MINT } from '@core/solana'
import { stripByAmount } from '@core/utils/numberUtils'

import { AmountInput } from '../../Inputs'
import { Container } from '../index.styles'
import {
  FirstInputContainer,
  InputsContainer,
  SpanContainer,
} from './index.styles'

export const StakeContainer = ({
  setIsConnectWalletPopupOpen,
  start,
  setStakeAmount,
  stakeAmount,
  maxAmount,
  loading,
  isRegionRestricted,
}: {
  setIsConnectWalletPopupOpen: (a: boolean) => void
  start: (a: number) => void
  setStakeAmount: (a: string | number) => void
  stakeAmount: number
  maxAmount: number | string
  loading: boolean
  isRegionRestricted: boolean
}) => {
  const wallet = useWallet()
  const isMaxAmount = stakeAmount === stripByAmount(maxAmount)
  const amountToStake = isMaxAmount ? +maxAmount : stakeAmount
  const disabled =
    (wallet.connected &&
      (stakeAmount === 0 || stakeAmount === '' || loading)) ||
    isRegionRestricted
  return (
    <InputsContainer>
      <FirstInputContainer>
        <AmountInput
          title="Stake"
          maxAmount={maxAmount}
          amount={stakeAmount}
          onMaxAmountClick={() => setStakeAmount(stripByAmount(maxAmount))}
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
      <DarkTooltip
        title={
          wallet.connected && isRegionRestricted
            ? "Sorry, Aldrin.com doesn't offer its services in your region."
            : ''
        }
      >
        <SpanContainer>
          <Button
            disabled={disabled}
            onClick={() =>
              !wallet.connected
                ? setIsConnectWalletPopupOpen(true)
                : start(amountToStake)
            }
            $variant="violet"
            $width="xl"
            $padding="xxxl"
            $fontSize="md"
          >
            {!wallet.connected ? 'Connect Wallet to Stake RIN' : <>Stake RIN</>}
          </Button>
        </SpanContainer>
      </DarkTooltip>
    </InputsContainer>
  )
}
