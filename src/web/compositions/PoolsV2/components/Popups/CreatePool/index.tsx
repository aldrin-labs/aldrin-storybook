import React, { useState } from 'react'

import { Modal } from '@sb/components/Modal'

import { StyledModal } from '../index.styles'
import { CreatePool } from './steps/CreatePool'
import { SetupFarming } from './steps/SetupFarming'

export const CreatePoolModal = ({
  open,
  onClose,
  setIsConnectWalletPopupOpen,
}: {
  open: boolean
  onClose: () => void
  setIsConnectWalletPopupOpen: (a: boolean) => void
}) => {
  const [creationStep, setCreationStep] = useState('createPool')

  return (
    <StyledModal>
      <Modal open={open} onClose={onClose}>
        {creationStep === 'createPool' && (
          <CreatePool
            onClose={onClose}
            creationStep={creationStep}
            setCreationStep={setCreationStep}
            setIsConnectWalletPopupOpen={setIsConnectWalletPopupOpen}
          />
        )}
        {creationStep === 'setupFarming' && (
          <SetupFarming
            onClose={onClose}
            creationStep={creationStep}
            setCreationStep={setCreationStep}
          />
        )}
      </Modal>
    </StyledModal>
  )
}
