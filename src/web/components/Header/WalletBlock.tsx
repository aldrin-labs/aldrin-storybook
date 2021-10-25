import React, { useState } from 'react'
import { useWallet } from '@sb/dexUtils/wallet'

import WalletIcon from '@icons/walletIcon.svg'

// TODO: move that
import { ConnectWalletPopup } from '@sb/compositions/Chart/components/ConnectWalletPopup/ConnectWalletPopup'
import { SvgIcon } from '..'
import { WalletButton, WalletName, WalletAddress, WalletData, WalletDisconnectButton } from './styles'
import { Button } from '../Button'


export const WalletBlock = () => {
  const [isConnectWalletPopupOpen, setIsConnectWalletPopupOpen] = useState(
    false
  )
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
        <>
          <SvgIcon
            src={WalletIcon}
            width="1em"
            height="1em"
            style={{ margin: '0 1em' }}
          />
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
        </>
      )}
      {/* {connected && (
        <RowContainer wrap="nowrap">
          <SvgIcon
            src={WalletIcon}
            width="1.6rem"
            height="1.6rem"
            style={{ margin: '0 2rem' }}
          />
          <Row direction="column" align="flex-start" margin="0 0 1rem 0">
            <Title fontSize="1rem" fontFamily="Avenir Next">
              {isCCAIActive ? (
                <>
                  <span style={{ fontFamily: 'Avenir Next Demi' }}>
                    Wallet™
                  </span>{' '}
                  &nbsp; by Aldrin.com
                </>
              ) : isSolletActive ? (
                'Sollet Wallet'
              ) : isSolletExtensionActive ? (
                'Sollet Extension Wallet'
              ) : isMathWalletActive ? (
                'Math Wallet'
              ) : isSolongWallet ? (
                'Solong Wallet'
              ) : (
                          'Wallet'
                        )}
            </Title>
            <Title
              fontFamily="Avenir Next"
              color={'rgb(147, 160, 178)'}
              fontSize="1rem"
            >
              {wallet?.publicKey?.toBase58()}
            </Title>
          </Row>
          <RedButton
            width="10rem"
            height="2rem"
            theme={theme}
            fontSize="1.2rem"
            onClick={() => {
              wallet?.disconnect && wallet.disconnect()
            }}
            style={{
              position: 'absolute',
              right: '0',
              bottom: '.5rem',
              fontFamily: 'Avenir Next Demi',
            }}
          >
            Disconnect
          </RedButton>
        </RowContainer>
      )} */}
      <ConnectWalletPopup
        theme={theme}
        open={isConnectWalletPopupOpen}
        onClose={() => setIsConnectWalletPopupOpen(false)}
      />
    </>
  )
}