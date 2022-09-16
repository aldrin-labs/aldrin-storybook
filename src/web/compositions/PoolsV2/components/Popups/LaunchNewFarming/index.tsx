import React from 'react'

import { Modal } from '@sb/components/Modal'

import { SetupFarming } from '../CreatePool/steps/SetupFarming'
import { StyledModal } from '../index.styles'

export const LaunchFarmingModal = ({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) => {
  return (
    <StyledModal>
      <Modal open={open} onClose={onClose}>
        <SetupFarming
          header="Launch New Farming for"
          description="USDT/USDC"
          needSteps={false}
          onClose={onClose}
        />
      </Modal>
    </StyledModal>
  )
}
