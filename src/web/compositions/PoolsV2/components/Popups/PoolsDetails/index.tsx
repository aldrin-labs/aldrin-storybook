import React, { useState } from 'react'

import { Button } from '@sb/components/Button'
import { Modal } from '@sb/components/Modal'

import { RIN_MINT } from '@core/solana'

import { PlusIcon } from '../../Icons'
import { DepositLiquidity } from '../DepositLiquidity'
import { HeaderComponent } from '../Header'
import { Row, StyledModal } from '../index.styles'
import { BoxesWithDetails } from './BoxesWithDetailsComponent'
import { PoolsChart } from './Chart'

export const PoolsDetails = ({
  onClose,
  open,
}: {
  onClose: () => void
  open: boolean
}) => {
  const [isDepositPopupOpen, setIsDepositPopupOpen] = useState(false)

  return (
    <StyledModal>
      <Modal open={open} onClose={onClose}>
        <HeaderComponent close={() => onClose()} />
        <BoxesWithDetails />
        <Button
          onClick={() => {
            setIsDepositPopupOpen(true)
          }}
          $variant="green"
          $width="xl"
          $padding="xxxl"
          $fontSize="sm"
        >
          <PlusIcon color="green1" />
          Add Liquidity & Farm
        </Button>
        <Row width="100%" height="15em" style={{ marginTop: '2em' }}>
          <PoolsChart
            marketType={2}
            inputTokenMintAddress={RIN_MINT}
            outputTokenMintAddress="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
          />
        </Row>
      </Modal>
      <DepositLiquidity
        open={isDepositPopupOpen}
        onClose={() => {
          setIsDepositPopupOpen(false)
        }}
      />
    </StyledModal>
  )
}
