import React, { useState } from 'react'

import { ConnectWalletPopup } from '@sb/compositions/Chart/components/ConnectWalletPopup/ConnectWalletPopup'
import { useWallet } from '@sb/dexUtils/wallet'

// TODO: move that
import {
  WalletButton,
  WalletDataContainer,
  WalletDisconnectButton,
} from './styles'

export const WalletBlock = () => {
  const [isConnectWalletPopupOpen, setIsConnectWalletPopupOpen] =
    useState(false)
  const { connected, wallet, providerName, providerFullName } = useWallet()

  return (
    <>
      {!connected && (
        <WalletButton
          onClick={() => {
            setIsConnectWalletPopupOpen(true)
          }}
        >
          Connect wallet
        </WalletButton>
      )}
      {connected && (
        <WalletDataContainer>
          {/* <WalletName>{providerFullName || providerName}</WalletName>
          <WalletAddress>{wallet.publicKey?.toBase58()}</WalletAddress>
          <WalletDisconnectButton
            onClick={() => {
              if (wallet?.disconnect) {
                wallet.disconnect()
              }
            }}
          >
            Disconnect
          </WalletDisconnectButton> */}
          hhh
          <WalletDisconnectButton>Disconnect</WalletDisconnectButton>
        </WalletDataContainer>
      )}
      <ConnectWalletPopup
        open={isConnectWalletPopupOpen}
        onClose={() => setIsConnectWalletPopupOpen(false)}
      />
    </>
  )
}
