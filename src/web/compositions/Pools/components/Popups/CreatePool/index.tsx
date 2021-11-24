import React, { useState } from 'react'
import { Modal } from '@sb/components/Modal'
import { CoinSelector } from '@sb/components/CoinSelector'
import { Footer, Title, Body } from './styles'
import { Button } from '@sb/components/Button'

interface CreatePoolProps {
  onClose: () => void
}

const steps = [
  'Set up a Pool',
  'Add Initial Liquidity',
  'Set Up Farming'
]

export const CreatePoolModal: React.FC<CreatePoolProps> = (props) => {
  const { onClose } = props
  const [step, setStep] = useState(1)
  const stepsSize = steps.length
  return (
    <Modal
      title={
        <Title>
          Step {step}/{stepsSize} <span>{steps[step - 1]}</span>
        </Title>
      }
      open
      onClose={onClose}
    >
      <Body>
        Modal
      <CoinSelector></CoinSelector>
        <Footer>
          <Button $variant="outline-white">Cancel</Button>
          <Button>Next</Button>
        </Footer>
      </Body>

    </Modal>
  )
}