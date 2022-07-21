import copy from 'clipboard-copy'
import React, { useState } from 'react'

import { SvgIcon } from '@sb/components'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
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
          <Row margin="0 0.3em 0 0">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.5 4.5H3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11 5.48495V6.51498C11 6.78998 10.78 7.01496 10.5 7.02496H9.52C8.98 7.02496 8.48502 6.62997 8.44002 6.08997C8.41002 5.77497 8.53001 5.47996 8.74001 5.27496C8.92501 5.08496 9.18001 4.97498 9.46001 4.97498H10.5C10.78 4.98498 11 5.20995 11 5.48495Z"
                fill="#14141F"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.73999 5.27499C8.52999 5.47999 8.41 5.775 8.44 6.09C8.485 6.63 8.97999 7.02499 9.51999 7.02499H10.5V7.75C10.5 9.25 9.5 10.25 8 10.25H3.5C2 10.25 1 9.25 1 7.75V4.25C1 2.89 1.82 1.94 3.095 1.78C3.225 1.76 3.36 1.75 3.5 1.75H8C8.13 1.75 8.255 1.75499 8.375 1.77499C9.665 1.92499 10.5 2.88 10.5 4.25V4.97501H9.45999C9.17999 4.97501 8.92499 5.08499 8.73999 5.27499Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Row>
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
