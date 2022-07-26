import React, { useState } from 'react'

import { Button } from '@sb/components/Button'
import { Modal } from '@sb/components/Modal'
import { ConnectWalletPopup } from '@sb/compositions/Chart/components/ConnectWalletPopup/ConnectWalletPopup'
import { useWallet } from '@sb/dexUtils/wallet'

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
  const [isConnectWalletPopupOpen, setIsConnectWalletPopupOpen] =
    useState(false)
  const [isDepositPopupOpen, setIsDepositPopupOpen] = useState(false)
  const wallet = useWallet()
  return (
    <StyledModal>
      <Modal open={open} onClose={onClose}>
        <HeaderComponent close={() => onClose()} />
        <BoxesWithDetails />
        <Button
          onClick={() => {
            if (!wallet.connected) {
              setIsConnectWalletPopupOpen(true)
            } else {
              setIsDepositPopupOpen(true)
            }
          }}
          $variant={!wallet.connected ? 'violet' : 'green'}
          $width="xl"
          $padding="xxxl"
          $fontSize="sm"
        >
          {!wallet.connected ? (
            'Connect Wallet to Add Liquidity'
          ) : (
            <>
              <PlusIcon color="green1" />
              Add Liquidity & Farm
            </>
          )}
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
      <ConnectWalletPopup
        open={isConnectWalletPopupOpen}
        onClose={() => setIsConnectWalletPopupOpen(false)}
      />
    </StyledModal>
  )
}
