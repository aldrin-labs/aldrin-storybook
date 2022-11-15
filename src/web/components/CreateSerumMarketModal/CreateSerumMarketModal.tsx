import React from 'react'

import { Modal } from '../Modal'
import { ModalBody } from '../Modal/styles'
import { Sidebar } from './CreateSerumMarketModal.styles'
import { CreateSerumMarketModalProps } from './CreateSerumMarketModal.types'

export const CreateSerumMarketModal: React.FC<CreateSerumMarketModalProps> = (
  props
) => {
  const { onClose } = props
  return (
    <Modal open onClose={onClose}>
      <ModalBody>
        <Sidebar>Sidebar</Sidebar>
        <Sidebar>Content</Sidebar>
      </ModalBody>
    </Modal>
  )
}
