import React from 'react'

import { Button } from '@sb/components/Button'
import { Modal } from '@sb/components/Modal'

import { PlusIcon } from '../../Icons'
import { HeaderComponent } from '../Header'
import { StyledModal } from '../index.styles'
import { BoxesWithDetails } from './BoxesWithDetailsComponent'

export const PoolsDetails = ({
  onClose,
  open,
}: {
  onClose: () => void
  open: boolean
}) => {
  return (
    <StyledModal>
      <Modal open={open} onClose={onClose}>
        <HeaderComponent />
        <BoxesWithDetails />
        <Button $variant="green" $width="xl" $padding="xxxl" $fontSize="md">
          <PlusIcon color="green1" />
          Add Liquidity & Farm
        </Button>
      </Modal>
    </StyledModal>
  )
}
