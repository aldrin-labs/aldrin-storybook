import copy from 'clipboard-copy'
import React, { useState } from 'react'
import { PublicKey } from '@solana/web3.js'

import { SvgIcon } from '@sb/components'
import { ConnectWalletPopup } from '@sb/compositions/Chart/components/ConnectWalletPopup/ConnectWalletPopup'
import { useWallet, useBalanceInfo } from '@sb/dexUtils/wallet'

import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'

import Astronaut from '@icons/astronaut.webp'
import CheckMark from '@icons/checkmarkWhite.svg'

import { formatSymbol } from '../AllocationBlock/DonutChart/utils'

import {
  WalletButton,
  WalletDataContainer,
  WalletDisconnectButton,
  WalletData,
  Column,
  WalletAddress,
  BalanceTitle,
  WalletDisconnectBlock,
  CopyAddressButton,
} from './styles'

export const WalletBlock = () => {
  const [isConnectWalletPopupOpen, setIsConnectWalletPopupOpen] =
    useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const { connected, wallet } = useWallet()

  const publicKey = wallet.publicKey?.toString() || ''
  const balanceInfo = useBalanceInfo(wallet.publicKey)
  const { amount, decimals } = balanceInfo || {
    amount: 0,
    decimals: 8,
  }
  const SOLAmount = amount / 10 ** decimals

  return (
    <>
      {!connected && (
        <WalletButton
          data-testid="header-connect-wallet-btn"
          onClick={() => {
            setIsConnectWalletPopupOpen(true)
          }}
        >
          Connect Wallet
        </WalletButton>
      )}

      {connected && (
        <WalletDataContainer>
          <WalletData className="wallet-data">
            <img src={Astronaut} alt="aldrin" width="24px" height="24px" />
            <Column>
              <BalanceTitle>
                {stripByAmountAndFormat(SOLAmount, 4)} SOL
              </BalanceTitle>
              <WalletAddress>
                {formatSymbol({ symbol: publicKey })}
              </WalletAddress>
            </Column>
          </WalletData>

          <WalletDisconnectBlock className="disconnect-wallet">
            <WalletDisconnectButton
              data-testid="header-disconnect-wallet-btn"
              onClick={() => {
                if (wallet?.disconnect) {
                  wallet.disconnect()
                }
              }}
            >
              Disconnect
            </WalletDisconnectButton>
            <CopyAddressButton
              data-testid="header-copy-address-btn"
              isCopied={isCopied}
              onClick={() => {
                setIsCopied(true)
                copy(publicKey)
                setTimeout(() => setIsCopied(false), 1500)
              }}
            >
              {isCopied ? (
                <SvgIcon src={CheckMark} />
              ) : (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17 7.4V14.8667C17 16.04 16.04 17 14.8667 17H7.4"
                    stroke="#C1C1C1"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3.1334 1.00007H10.6001C11.7734 1.00007 12.7334 1.96007 12.7334 3.1334V10.6001C12.7334 11.7734 11.7734 12.7334 10.6001 12.7334H3.1334C1.96007 12.7334 1.00007 11.7734 1.00007 10.6001V3.1334C1.00007 1.96007 1.96007 1.00007 3.1334 1.00007Z"
                    stroke="#C1C1C1"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </CopyAddressButton>
          </WalletDisconnectBlock>
        </WalletDataContainer>
      )}

      <ConnectWalletPopup
        open={isConnectWalletPopupOpen}
        onClose={() => setIsConnectWalletPopupOpen(false)}
      />
    </>
  )
}
