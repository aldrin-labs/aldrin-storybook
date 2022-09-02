import React from 'react'

import { Button } from '@sb/components/Button'
import { useWallet } from '@sb/dexUtils/wallet'

import { ValuesContainer } from '../../../DepositLiquidity/DepositContainer'
import { Column } from '../../../index.styles'
import { Header } from '../../components/Header'
import { RationContainer } from '../../components/RationContainer'

const tiers = [
  { value: '0.01', title: 'Best for very stable pairs' },
  { value: '0.05', title: 'Best for stable pairs' },
  { value: '0.3', title: 'Best for most pairs' },
  { value: '1', title: 'Best for exotic pairs' },
]

export const SetupFarming = ({
  onClose,
  setCreationStep,
  creationStep,
}: {
  onClose: () => void
  setCreationStep: (a: string) => void
  creationStep: string
}) => {
  const { wallet } = useWallet()

  return (
    <>
      <Header
        header="Setup Farming"
        description="You will be able to prolong your farming for as long as you like."
        creationStep={creationStep}
        onClose={onClose}
      />
      <Column height="auto" width="100%">
        <ValuesContainer />
        {wallet.connected && <RationContainer token="RIN" />}
      </Column>
      <Button
        onClick={() => null}
        $variant="violet"
        $width="xl"
        $padding="xxxl"
        $fontSize="sm"
      >
        {!wallet.connected ? 'Connect Wallet to Create Pool' : 'Next'}
      </Button>
    </>
  )
}
