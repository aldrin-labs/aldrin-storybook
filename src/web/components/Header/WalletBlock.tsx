import React, { useState } from 'react'
import { useWallet } from '@sb/dexUtils/wallet'

import WalletIcon from '@icons/walletIcon.svg'

// TODO: move that
import { ConnectWalletPopup } from '@sb/compositions/Chart/components/ConnectWalletPopup/ConnectWalletPopup'
import { SvgIcon } from '..'
import { WalletButton, WalletName, WalletAddress, WalletData, WalletDisconnectButton } from './styles'

export const WalletBlock = () => {
  const [isConnectWalletPopupOpen, setIsConnectWalletPopupOpen] = useState(
    false
  )
  const { connected, wallet, providerName, providerFullName } = useWallet()

  return (
    <>
      <SvgIcon
        src={WalletIcon}
        width="1em"
        height="1em"
        style={{ margin: '0 1em' }}
      />
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
        <WalletData>
          <WalletName>{providerFullName || providerName}</WalletName>
          <WalletAddress>{wallet.publicKey?.toBase58()}</WalletAddress>
          <WalletDisconnectButton
            onClick={() => {
              wallet?.disconnect && wallet.disconnect()
            }}
          >
            Disconnect
            </WalletDisconnectButton>
        </WalletData>
      )}
      <ConnectWalletPopup
        open={isConnectWalletPopupOpen}
        onClose={() => setIsConnectWalletPopupOpen(false)}
      />
    </>
  )
}