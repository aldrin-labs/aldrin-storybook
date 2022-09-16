import React, { useState } from 'react'

import { Modal } from '@sb/components/Modal'

import { StyledModal } from '../index.styles'
import { CreatePool } from './steps/CreatePool'
import { SetPreferences } from './steps/SetPreferences'
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
            header="Setup Farming"
            description="You will be able to prolong your farming for as long as you like."
            onClose={onClose}
            creationStep={creationStep}
            needSteps
            setCreationStep={setCreationStep}
          />
        )}
        {creationStep === 'setPreferences' && (
          <SetPreferences
            onClose={onClose}
            creationStep={creationStep}
            setCreationStep={setCreationStep}
          />
        )}
      </Modal>
    </StyledModal>
  )
}
